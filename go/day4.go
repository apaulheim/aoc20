package main
import (
	"regexp"
	"strconv"
	"strings"
)
// Day4 Compute result for Day4
func Day4(data string) StarResult {
	passportStr := strings.Split(data, ",,")
	silver := 0
	gold := 0
	for _, passport := range passportStr {
		if strings.Contains(passport, "byr:") && strings.Contains(passport, "iyr:") && strings.Contains(passport, "eyr:") && strings.Contains(passport, "hgt:") && strings.Contains(passport, "hcl:") && strings.Contains(passport, "ecl:") && strings.Contains(passport, "pid:") {
			silver++

			pass := make(map[string]string)
			lines := strings.Split(passport, ",")
			for _, line := range lines {
				pairs := strings.Split(line, " ")
				for _, data := range pairs {
					tuple := strings.Split(data, ":")
					pass[tuple[0]] = tuple[1]
				}
			}

			validEntries := 0
			for key, value := range pass {
				if key == "byr" {
					val, err := strconv.Atoi(value)
					if err != nil {
						panic(err)
					}
					if val >= 1920 && val <= 2002 {
						validEntries++
					}
				} else if key == "iyr" {
					val, err := strconv.Atoi(value)
					if err != nil {
						panic(err)
					}
					if val >= 2010 && val <= 2020 {
						validEntries++
					}
				} else if key == "eyr" {
					val, err := strconv.Atoi(value)
					if err != nil {
						panic(err)
					}
					if val >= 2020 && val <= 2030 {
						validEntries++
					}
				} else if key == "hgt" {
					re := regexp.MustCompile(`^([0-9]+)(cm|in)$`)
					matches := re.FindStringSubmatch(pass[key])
					if (matches != nil) {
						hgt, err := strconv.Atoi(matches[1])
						if err != nil {
							panic(err)
						}
						if (matches[2] == "cm" && hgt >= 150 && hgt <= 193) || (matches[2] == "in" && hgt >= 59 && hgt <= 76) {
							validEntries++
						}
					}	
				} else if key == "hcl" {
					re := regexp.MustCompile(`^#([0-9]|[a-f]){6}$`)
					matches := re.FindStringSubmatch(pass[key])
					if matches != nil {
						validEntries++
					}
				} else if key == "ecl" {
					re := regexp.MustCompile(`^(amb|blu|brn|gry|grn|hzl|oth)$`)
					matches := re.FindStringSubmatch(pass[key])
					if matches != nil {
						validEntries++
					}
				} else if key == "pid" {
					re := regexp.MustCompile(`^([0-9]){9}$`)
					matches := re.FindStringSubmatch(pass[key])
					if matches != nil {
						validEntries++
					}
				}
			}
			if validEntries == 7 {
				gold++
			}
		}
	}
	return StarResult{Silver: strconv.Itoa(silver), Gold: strconv.Itoa(gold)}
}