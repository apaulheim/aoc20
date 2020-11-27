package main

import (
	"html/template"
	"log"
	"net/http"
	"regexp"
)

type Page struct {
	Title  string
	Body   string
	Result string
}

func viewHandler(w http.ResponseWriter, r *http.Request, title string) {
	renderTemplate(w, "form", &Page{title, "", ""})
}

func resultHandler(w http.ResponseWriter, r *http.Request, title string) {
	body := r.FormValue("body")
	result := Day1(body)
	p := &Page{Title: title, Body: body, Result: result}
	renderTemplate(w, "form", p)
}

var templates = template.Must(template.ParseFiles("static/form.html", "static/index.html"))

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	err := templates.ExecuteTemplate(w, tmpl+".html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

var validPath = regexp.MustCompile("^/(day|result)/([a-zA-Z0-9]+)$")

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
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/day/", makeHandler(viewHandler))
	http.HandleFunc("/result/", makeHandler(resultHandler))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
