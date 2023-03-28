let controller = new AbortController();

const promise1 = new Promise((resolve, reject) => {
	setTimeout(resolve, 5000, 'one');
});

const promise2 = new Promise((resolve, reject) => {
	setTimeout(reject, 100, 'two');
});

const promises = [promise1, promise2];

Promise.race(promises)
	.then((value) => {
		console.log('succeeded with value:', value);
		promises.forEach((x) => Promise.resolve(x));
	})
	.catch((reason) => {
		// Only promise1 is fulfilled, but promise2 is faster
		console.error('failed with reason:', reason);
	});
// failed with reason: two
