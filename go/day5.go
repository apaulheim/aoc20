package main
import (
	"strconv"
	"strings"
)

// Day5FindRow find row helper function
func Day5FindRow(lower int, upper int, dir string) [2]int {
	newlower := lower
	newupper := upper
	half := (upper + 1 - lower) / 2
	if dir == "F" || dir == "L" {
		newupper = upper - half
	} else if dir == "B" || dir == "R" {
		newlower = lower + half
	}
	return [2]int{newlower, newupper}
}

// Day5 Compute result for Day4
func Day5(data string) StarResult {
	silver := 0
	gold := 0
	directionsStr := strings.Split(data, ",")
	var allSeats [1024]bool
	for i := 0; i < 1024; i++ {
		allSeats[i] = true
	}
	for _,directions := range directionsStr {
		rowDirections := directions[0:7]
		columnDirections := directions[7:10]
		lower := 0
		upper := 127
		for j := 0; j < len(rowDirections); j++ {
			results := Day5FindRow(lower, upper, string(rowDirections[j]))
			lower = results[0]
			upper = results[1]
		}
		left := 0
		right := 7
		for j := 0; j < len(columnDirections); j++ {
			results := Day5FindRow(left, right, string(columnDirections[j]))
			left = results[0]
			right = results[1]
		}
		res := lower * 8 + left
		allSeats[res] = false
		if res > silver {
			silver = res
		}
		j := 0
		for allSeats[j] && j < len(allSeats) {
			j++
		}
		for !allSeats[j] && j < len(allSeats) {
			j++
		}
		gold = j
	}
	return StarResult{Silver: strconv.Itoa(silver), Gold: strconv.Itoa(gold)}
}