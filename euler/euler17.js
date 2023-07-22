const ones = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'].map((x) => x.length);
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'].map((x) => x.length);
const tens = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'].map((x) => x.length);
const powers = ['hundred', 'thousand'].map((x) => x.length);
const and = 'and'.length;

function sumOnes(n) {
	let out = 0;
	for (let i = 0; i < n; i++) {
		out += ones[i];
	}
	return out;
}

function sumTens(n) {
	let out = 0;
	let x = Math.floor(n / 10);
	let ones = sumOnes(9);
	out += ones;
	if (x > 2) {
		for (let i = 0; i < x - 2; i++) {
			out += 10 * tens[i];
			out += ones;
		}
	}

	let teenMod = n % 10;
	if (x > 1) {
		out += (teenMod + 1) * tens[x - 2];
		out += sumOnes(teenMod);
		teenMod = 9;
	}
	for (let i = 0; i <= teenMod; i++) {
		out += teens[i];
	}

	return out;
}

function sumHundreds(n) {
	let out = 0;
	let ninetyNine = sumTens(99);
	for (let i = 0; i < Math.floor(n / 100); i++) {
		out += ninetyNine;
		if (i > 0) {
			out += 99 * and;
			out += 100 * powers[0];
			out += 100 * ones[i - 1];
		}
	}

	let mod = n % 100;
	out += sumTens(mod);
	out += mod * and;
	out += (mod + 1) * powers[0];
	out += (mod + 1) * ones[Math.floor(n / 100) - 1];

	return out;
}

function sumNumberLetters(n) {
	if (n < 10) return sumOnes(n);
	else if (n < 100) return sumTens(n);
	else if (n < 1000) return sumHundreds(n);
	else return powers[1] + ones[0] + sumHundreds(999);
}

const { argv, exit } = require('process');
if (argv.length != 3) {
	console.log('Invalid amount of input arguments. Expects exactly one argument to be provided.');
	exit(1);
}
console.log(sumNumberLetters(Number(argv[2])));
