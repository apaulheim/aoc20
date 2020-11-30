package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)
// Page Input for form template
type Page struct {
	DayNr  string
	Input   string
	Silver string
	Gold string
	Path string
	Go bool
	Py bool
	Js bool
}

// InputIndex Input for index html
type InputIndex struct {
	Go [24]int
	Py [24]int
	Js [24]int
}

// StarResult Each day two results need to be calculated
type StarResult struct {
	Silver string
	Gold string
}

//                   1 2 3 4 5 6 7 8 9 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2
//                                     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4
var goImpl = [24]int{1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}
var pyImpl = [24]int{1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}
var jsImpl = [24]int{1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}

var gofunc = [24](func(string)StarResult){Day1,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil}



func viewHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	day, err := strconv.Atoi(daynr)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	day--;
	renderTemplate(w, "form", &Page{DayNr: daynr, Input: "", Silver: "", Gold: "", Path: "../", Go: goImpl[day]==1, Py: pyImpl[day]==1, Js: jsImpl[day]==1})
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
	p := &Page{DayNr: daynr, Input: body, Silver: result.Silver, Gold: result.Gold, Path: "../../", Go: goImpl[day]==1, Py: pyImpl[day]==1, Js: jsImpl[day]==1}
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
	resp, err := http.Post("https://happyaoc20" + urlLang + ".azurewebsites.net/api/Day" + daynr, "application/json", strings.NewReader("{\"input\": \"" +input +"\"}"))
	if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
	defer resp.Body.Close()
	
	// read response body to string
	bodyStr, err := ioutil.ReadAll(resp.Body)
	// parse json
	result := StarResult{}
	err = json.Unmarshal([]byte(bodyStr), &result)
	if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }

	day--
	p := &Page{DayNr: daynr, Input: input, Silver: result.Silver, Gold: result.Gold, Path: "../../", Go: goImpl[day]==1, Py: pyImpl[day]==1, Js: jsImpl[day]==1}
	renderTemplate(w, "form", p)
}

func resultPyHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	azureFuncHandler(w, r, daynr, "py")
}

func resultJsHandler(w http.ResponseWriter, r *http.Request, daynr string) {
	azureFuncHandler(w, r, daynr, "js")
}

var funcMap = template.FuncMap{
	// The name "inc" is what the function will be called in the template text.
	"inc": func(i int) int {
		return i + 1
	},
}
var templates = template.Must(template.New("index.html").Funcs(funcMap).ParseFiles("static/form.html", "static/index.html"))

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

func indexHandler(w http.ResponseWriter, r *http.Request) {
	p := &InputIndex{Go: goImpl, Py: pyImpl, Js: jsImpl}
	err := templates.ExecuteTemplate(w, "index.html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	fmt.Println("Serving")
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./static/img"))))
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/day/", makeHandler(viewHandler))
	http.HandleFunc("/result/go/", makeHandler(resultGoHandler))
	http.HandleFunc("/result/py/", makeHandler(resultPyHandler))
	http.HandleFunc("/result/js/", makeHandler(resultJsHandler))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
