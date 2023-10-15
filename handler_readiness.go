package main

import "net/http"

func hanlderReadiness(w http.ResponseWriter, r *http.Request) {
	respondWithJson(w, 200, struct{}{})
}
