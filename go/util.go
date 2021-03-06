package main

// Set from https://www.davidkaya.com/sets-in-golang/
var exists = struct{}{}

type set struct {
    m map[string]struct{}
}

// NewSet go set implementation
func NewSet() *set {
    s := &set{}
    s.m = make(map[string]struct{})
    return s
}

func (s *set) Add(value string) {
    s.m[value] = exists
}

func (s *set) Remove(value string) {
    delete(s.m, value)
}

func (s *set) Contains(value string) bool {
    _, c := s.m[value]
    return c
}

func (s *set) Length() int {
	return len(s.m)
}

func (s *set) ToArray() []string {
    arr := []string{}
    for k := range s.m { 
        arr = append(arr, k)
    }
    return arr
}