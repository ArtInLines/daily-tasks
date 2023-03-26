(defun fib (n)
	(cond ((< n 2) n)
		  (t (+ (fib (- n 2)) (fib (- n 1))))))

(defun cli-args ()
	(or
		#+CLISP *args*
		#+SBCL *posix-argv*
		#+LISPWORKS system:*line-arguments-list*
		#+CMU extensions:*command-line-words*
		nil))

(format T "~d" (fib (parse-integer (cadr (cli-args)))))