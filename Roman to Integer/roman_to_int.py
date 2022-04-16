RtI = {
	"I": 1,
	"V": 5,
	"X": 10,
	"L": 50,
	"C": 100,
	"D": 500,
	"M": 1000,
}

def roman_to_int(s: str) -> int:
	s = list(s)
	x = 0
	l = len(s)
	for i in range(l):
		if i < l-1 and RtI[s[i+1]] > RtI[s[i]]:
			x -= RtI[s[i]]
		else:
			x += RtI[s[i]]
	return x
