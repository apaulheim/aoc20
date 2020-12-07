package main
import (
	"strconv"
	"strings"
)

// Day3Calc helper function
func Day3Calc(lines []string, right int, down int) (int) {
	x := 0
    y := 0
    trees := 0

    for (y < (len(lines) - down)) {
        x += right
        y += down
        if (lines[y][x % len(lines[y])] == byte('#')) {
			trees++
		}
	}
    return trees
}

// Day3 Compute result for Day3
func Day3(data string) StarResult {
	lines := strings.Split(data, ";")
	silver := Day3Calc(lines, 3, 1)
	gold := 1
	xVals := [...]int{1, 3, 5, 7, 1}
	yVals := [...]int{1, 1, 1, 1, 2}

    for i := range xVals {
		gold *= Day3Calc(lines, xVals[i], yVals[i])
	}

	return StarResult{Silver: strconv.Itoa(silver), Gold: strconv.Itoa(gold)}
}
