(defun sliding-window (l n f)
	(dotimes (i (+ (- (length l) n) 1))
		(funcall f (subseq l i (+ i n)))))

(defun digits-to-ints (str)
	(if (= (length str) 0)
		nil
		(cons (parse-integer (subseq str 0 1)) (digits-to-ints (subseq str 1)))))

(defun largest-product (n digits)
	(let* ((res 0))
		(sliding-window digits n (lambda (str)
			(let* ((x (apply #'* (digits-to-ints str))))
				(if (> x res)
					(setq res x)
					nil)
			)))
		res))

(defun cli-args ()
	(or
		#+CLISP *args*
		#+SBCL *posix-argv*
		#+LISPWORKS system:*line-arguments-list*
		#+CMU extensions:*command-line-words*
		nil))

(format T "~d" (largest-product (parse-integer (cadr (cli-args))) (string (caddr (cli-args)))))