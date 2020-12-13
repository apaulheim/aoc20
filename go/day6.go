package main
import (
	"strconv"
	"strings"
)

// Day6 Compute result for Day6
func Day6(data string) StarResult {
	silver := 0
	gold := 0
	groups := strings.Split(data, ";;")
	for _,group := range groups {
		groupSet := NewSet()
		persons := strings.Split(group, ";")

		goldAnswers := NewSet()
		for i := 0; i < len(persons[0]); i++ {
			goldAnswers.Add(string(persons[0][i]))
		}

		for _,answers := range persons {
			// silver part
			for i := 0; i < len(answers); i++ {
				groupSet.Add(string(answers[i]))
			}
			// gold part
			commonAnswers := NewSet()
			goldAnsArray := goldAnswers.ToArray()
			for _,goldAnswer := range goldAnsArray {
				if strings.Contains(answers, goldAnswer) {
					commonAnswers.Add(goldAnswer)
				}
			}
			goldAnswers = commonAnswers
		}
		silver += groupSet.Length()
		gold += goldAnswers.Length()
	}
	return StarResult{Silver: strconv.Itoa(silver), Gold: strconv.Itoa(gold)}
}