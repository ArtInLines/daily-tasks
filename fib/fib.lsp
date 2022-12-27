(defun fib (n)
	(cond ((< n 2) n)
		  (t (+ (fib (- n 2)) (fib (- n 1))))))