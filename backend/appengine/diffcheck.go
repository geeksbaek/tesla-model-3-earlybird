package main

import (
	"compress/gzip"
	"context"
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/sergi/go-diff/diffmatchpatch"

	"cloud.google.com/go/firestore"
	"github.com/julienschmidt/httprouter"
	"google.golang.org/api/iterator"
)

const (
	projectID = "tesla-238517"
)

type Region struct {
	PageURL        string
	RequestHeaders map[string]string
	FirestoreID    string
}

var (
	regionKR = &Region{
		PageURL: "https://www.tesla.com/ko_KR/model3",
		RequestHeaders: map[string]string{
			"Authority":                 "www.tesla.com",
			"Pragma":                    "no-cache",
			"Cache-Control":             "no-cache",
			"Upgrade-Insecure-Requests": "1",
			"User-Agent":                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
			"Accept":                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
			"Accept-Encoding":           "gzip, deflate, br",
			"Accept-Language":           "en-US,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,und;q=0.6",
		},
		FirestoreID: "teslaPageKR",
	}
	regionUS = &Region{
		PageURL: "https://www.tesla.com/model3/design",
		RequestHeaders: map[string]string{
			"accept":                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
			"accept-encoding":           "gzip, deflate, br",
			"accept-language":           "en-US,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,und;q=0.6",
			"cache-control":             "no-cache",
			"pragma":                    "no-cache",
			"upgrade-insecure-requests": "1",
			"user-agent":                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
		},
		FirestoreID: "teslaPageUS",
	}
)

var errEmptyDocuments = errors.New("empty")

type DiffCheckResponse struct {
	DiffHTML    string   `json:"diff_html"`
	HTMLHistory []string `json:"html_history"`
}

func DiffCheckHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	encoder := json.NewEncoder(w)
	encoder.SetEscapeHTML(false)

	var region *Region
	switch ps.ByName("region") {
	case "KR":
		region = regionKR
	case "US":
		region = regionUS
	default:
		encoder.Encode(&DiffCheckResponse{})
		return
	}
	ctx := r.Context()

	html, err := fetchCurrentPage(ctx, region)
	if err != nil {
		log.Fatal(err)
	}

	allPages, err := loadAllPages(ctx, region)
	if err != nil {
		if err == errEmptyDocuments {
			if err := addCurrentPage(ctx, region, html); err != nil {
				log.Fatal(err)
			}
			encoder.Encode(&DiffCheckResponse{
				HTMLHistory: []string{html},
			})
			return
		}
		log.Fatal(err)
	}

	var diffHTML string
	dmp := diffmatchpatch.New()
	if html != allPages[0] {
		if err := addCurrentPage(ctx, region, html); err != nil {
			log.Fatal(err)
		}
		diffs := dmp.DiffMain(html, allPages[0], false)
		diffs = dmp.DiffCleanupEfficiency(diffs)
		diffHTML = dmp.DiffPrettyHtml(diffs)
	} else {
		diffs := dmp.DiffMain(allPages[0], allPages[len(allPages)-1], false)
		diffs = dmp.DiffCleanupEfficiency(diffs)
		diffHTML = dmp.DiffPrettyHtml(diffs)
	}

	encoder.Encode(&DiffCheckResponse{
		DiffHTML:    diffHTML,
		HTMLHistory: allPages,
	})
}

func mustNewFirestoreClient(ctx context.Context) *firestore.Client {
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	return client
}

func addCurrentPage(ctx context.Context, region *Region, html string) (err error) {
	client := mustNewFirestoreClient(ctx)
	defer client.Close()

	_, _, err = client.Collection(region.FirestoreID).Add(ctx, map[string]interface{}{
		"html": html,
		"date": time.Now(),
	})
	return
}

func loadAllPages(ctx context.Context, region *Region) (htmls []string, err error) {
	client := mustNewFirestoreClient(ctx)
	defer client.Close()

	iter := client.Collection(region.FirestoreID).Documents(ctx)
	defer iter.Stop()

	htmls = []string{}
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Failed to iterate: %v", err)
		}
		htmls = append(htmls, doc.Data()["html"].(string))
	}
	if len(htmls) == 0 {
		err = errEmptyDocuments
	}
	return
}

func fetchCurrentPage(ctx context.Context, region *Region) (html string, err error) {
	req, err := http.NewRequest("GET", region.PageURL, nil)
	if err != nil {
		// handle err
	}
	req.Header.Set("Authority", "www.tesla.com")
	req.Header.Set("Pragma", "no-cache")
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Upgrade-Insecure-Requests", "1")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3")
	req.Header.Set("Accept-Encoding", "gzip, deflate, br")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,und;q=0.6")

	req.WithContext(ctx)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()

	var reader io.ReadCloser
	switch resp.Header.Get("Content-Encoding") {
	case "gzip":
		reader, err = gzip.NewReader(resp.Body)
		defer reader.Close()
	default:
		reader = resp.Body
	}

	b, err := ioutil.ReadAll(reader)
	if err != nil {
		return
	}

	html = string(b)
	return
}
