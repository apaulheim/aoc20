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
// Input for form template
type Page struct {
	DayNr  string
	Input   string
	Result string
	Path string
	Go bool
	Py bool
	Js bool
}

var goImpl = [24]int{1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}
var pyImpl = [24]int{1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}
var jsImpl = [24]int{1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}

var gofunc = [24](func(string)string){Day1,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil}



func viewHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	day, err := strconv.Atoi(daynr)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	day--;
	renderTemplate(w, "form", &Page{DayNr: daynr, Input: "", Result: "", Path: "../", Go: goImpl[day]==1, Py: pyImpl[day]==1, Js: jsImpl[day]==1})
}

func resultGoHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	day, err := strconv.Atoi(daynr)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	day--
	body := r.FormValue("body")
	dayImpl := gofunc[day];
	result := dayImpl(body)
	p := &Page{DayNr: daynr, Input: body, Result: result, Path: "../../", Go: goImpl[day]==1, Py: pyImpl[day]==1, Js: jsImpl[day]==1}
	renderTemplate(w, "form", p)
}

func azureFuncHandler(w http.ResponseWriter, r *http.Request, daynr string, lang string) {
	urlLang := ""
	if(lang == "py") {
		urlLang = "py"
	}
	day, err := strconv.Atoi(daynr)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
	input := r.FormValue("body")
	resp, err := http.Post("https://happyaoc20" + urlLang + ".azurewebsites.net/api/Day" + daynr, "application/json", strings.NewReader("{\"name\": \"" +input +"\"}"))
	if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	
	p := &Page{DayNr: daynr, Input: input, Result: string(body), Path: "../../", Go: goImpl[day]==1, Py: pyImpl[day]==1, Js: jsImpl[day]==1}
	renderTemplate(w, "form", p)
}

func resultPyHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	azureFuncHandler(w, r, daynr, "py")
}

func resultJsHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	azureFuncHandler(w, r, daynr, "js")
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
