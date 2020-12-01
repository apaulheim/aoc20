package main
import (
	"strconv"
	"strings"
)

// Day1 Compute result for Day1
func Day1(data string) StarResult {
	numbersStr := strings.Split(data, ",")
    var numbers = []int{}

    for _, i := range numbersStr {
        j, err := strconv.Atoi(i)
        if err != nil {
            panic(err)
        }
        numbers = append(numbers, j)
	}
	
	silver := 0
	gold := 0
	for _, i := range numbers {
		for _, j := range numbers {
			if (i + j == 2020) {
				silver = i * j
			}
			for _, k := range numbers {
				if (i + j + k == 2020) {
					gold = i * j * k
				}
			}
		}
   }
	return StarResult{Silver: strconv.Itoa(silver), Gold: strconv.Itoa(gold)}
}
