package main
import (
	"regexp"
	"strconv"
	"strings"
)

// Day2 Compute result for Day2
func Day2(data string) StarResult {
	lines := strings.Split(data, ";")
	
	silver := 0
	gold := 0
	for _, line := range lines {
		re := regexp.MustCompile(`([0-9]+)-([0-9]+) ([a-z]): ([a-z]*)`)
		matches := re.FindStringSubmatch(line)	
		if (matches != nil) {
			lower, err := strconv.Atoi(matches[1])
			if err != nil {
				panic(err)
			}
			upper, err := strconv.Atoi(matches[2])
			if err != nil {
				panic(err)
			}
			letter := matches[3]
			pw := matches[4]
			re2 := regexp.MustCompile(letter)
			matches2 := re2.FindAll([]byte(pw), -1)
			if (matches2 != nil && len(matches2) > 0 && len(matches2) >= lower && len(matches2) <= upper) {
				silver++
			}

			pos1 := string(pw[lower-1]) == letter
			pos2 := string(pw[upper-1]) == letter
			if (pos1 != pos2) {
				gold++
			}
		}	
    }
	return StarResult{Silver: strconv.Itoa(silver), Gold: strconv.Itoa(gold)}
}
