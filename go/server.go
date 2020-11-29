package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

type Page struct {
	DayNr  string
	Input   string
	Result string
	Path string
	Go bool
	Py string
	Js string
}
var goImpl = new([24]bool)
var pyURLs = new([24]string)
var jsURLs = new([24]string)

func viewHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	day, err := strconv.Atoi(daynr)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
	renderTemplate(w, "form", &Page{DayNr: daynr, Input: "", Result: "", Path: "../", Go: goImpl[day], Py: pyURLs[day], Js: jsURLs[day]})
}

func resultGoHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	day, err := strconv.Atoi(daynr)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
	body := r.FormValue("body")
	result := Day1(body)
	p := &Page{DayNr: daynr, Input: body, Result: result, Path: "../../", Go: goImpl[day], Py: pyURLs[day], Js: jsURLs[day]}
	renderTemplate(w, "form", p)
}

func resultPyHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	day, err := strconv.Atoi(daynr)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
	body := r.FormValue("body")
	result := Day1(body)
	p := &Page{DayNr: daynr, Input: body, Result: result, Path: "../../", Go: goImpl[day], Py: pyURLs[day], Js: jsURLs[day]}
	renderTemplate(w, "form", p)
}

func resultJsHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	day, err := strconv.Atoi(daynr)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
	input := r.FormValue("body")
	resp, err := http.Post("https://happyaoc20.azurewebsites.net/api/Day1", "application/json", strings.NewReader("{\"name\": \"" +input +"\"}"))
	if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	
	p := &Page{DayNr: daynr, Input: input, Result: string(body), Path: "../../", Go: goImpl[day], Py: pyURLs[day], Js: jsURLs[day]}
	renderTemplate(w, "form", p)
}

var templates = template.Must(template.ParseFiles("static/form.html"))

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	err := templates.ExecuteTemplate(w, tmpl+".html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

var validPath = regexp.MustCompile("^/(day|result/go|result/py|result/js)/([0-9]+)$")

func makeHandler(fn func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		m := validPath.FindStringSubmatch(r.URL.Path)
		if m == nil {
			http.NotFound(w, r)
			return
		}
		fn(w, r, m[2])
	}
}

func main() {
	fmt.Println("Serving")
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/day/", makeHandler(viewHandler))
	http.HandleFunc("/result/go/", makeHandler(resultGoHandler))
	http.HandleFunc("/result/py/", makeHandler(resultPyHandler))
	http.HandleFunc("/result/js/", makeHandler(resultJsHandler))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
