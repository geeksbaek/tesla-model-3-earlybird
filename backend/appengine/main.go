package main

// [START import]
import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)

func main() {
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.GET("/TeslaNews", TeslaNewsHandler)
	router.GET("/DiffCheck/:region", DiffCheckHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	log.Printf("Listening on port %s", port)
	handler := cors.Default().Handler(router)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), handler))
}

func indexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Fprint(w, "Hello, World!")
}
