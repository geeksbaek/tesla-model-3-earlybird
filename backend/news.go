// Package p contains an HTTP Cloud Function.
package p

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

var newsAPI = "https://openapi.naver.com/v1/search/news.json?query=%ED%85%8C%EC%8A%AC%EB%9D%BC&sort=date"

func TeslaNews(w http.ResponseWriter, r *http.Request) {
	req, _ := http.NewRequest("GET", newsAPI, nil)

	req.Header.Add("X-Naver-Client-Id", os.Getenv("X-Naver-Client-Id"))
	req.Header.Add("X-Naver-Client-Secret", os.Getenv("X-Naver-Client-Secret"))

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	fmt.Fprint(w, string(body))
}
