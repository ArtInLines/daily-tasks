    global  _main
    extern  _printf

	section .bss
; Strings a, b
a resb 256
b resb 256
c resb 256

	section .text

; atoi(char *str) -> int
; @Note: The string has to be null-terminated
; @Note: The output is stored in edx
_atoi:
    ; Entering Function
    push	ebp
    mov		ebp, esp
    mov		ecx, dword [ebp + 8]	; ecx = str
    ; Setting up local variables
    mov		edx, 0					; edx = output (initiliazed to 0)
    mov		ebx, 0					; ebx = current character as an int
    mov		eax, 10					; eax = number base
    ; @Safety: We do not check that the string is valid in any way, shape or form
    ; @Note:   We currently do not support negative numbers
.loop:
    mov		bl, byte [ecx]
    cmp		bl, 0
    je		.end
    sub		ebx, '0'				; Subtract ascii code for 0 to get the integer it represents
    imul	edx, eax				; Multiply current result by number base
    add		edx, ebx				; Add integer of current character to current result
    add		ecx, 1					; Increment pointer to str
    jmp 	.loop
.end:
    ; Leaving Function
    pop		ebp
    ret

; itoa(int n, char *s) -> int
; @Note: Writes result into s in LSB order
; @Note: Returns length of string - stored in ecx
_itoa:
	; Entering Function
    push	ebp
    mov		ebp, esp
	sub		esp, 8
    mov		eax, dword [ebp + 8]	; eax = n
	mov		edx, dword [ebp + 12]
	mov		ecx, 0					; ecx = counter (return value)
	mov		ebx, 10					; ebx = base
.loop:
	cmp		eax, 0
	je		.end
	mov		dword [ebp - 4], eax
	xor		edx, edx
	div		ebx						; eax = n / base
	mov		dword [ebp - 8], eax
	mul		ebx						; eax = n - n%base
	mov		edx, dword [ebp - 4]	; edx = n
	sub		edx, eax				; edx = n%base
	add		edx, '0'
	mov		eax, dword [ebp + 12]
	mov		byte [eax + ecx], dl
	mov		eax, dword [ebp - 8]	; eax = n/base
	inc		ecx
	jmp		.loop
.end:
	; Add terminating 0 to string
	mov		dl, 0
	mov		eax, dword [ebp + 12]
	mov		byte [eax + ecx], dl
	add		esp, 8
    pop		ebp
    ret

; reverse_str(int len, char *s) -> void
_reverse_str:
	push	ebp
	mov		ebp, esp
	mov		eax, dword [ebp + 8]  ; eax = len
	mov		ecx, 2
	xor		edx, edx
	div		ecx					  ; eax = len/2
	mov		edx, dword [ebp + 8]  ; edx = len
	mov		ebp, dword [ebp + 12] ; ebp = s
	dec		edx					  ; edx = len-1 (can't index at s[len])
	xor		ecx, ecx			  ; ecx = counter = 0
	xor		ebx, ebx
.loop:
	cmp		ecx, eax
	je		.end
	mov		bl, byte [ebp + ecx]
	mov		bh, byte [ebp + edx]
	mov		byte [ebp + ecx], bh
	mov		byte [ebp + edx], bl
	dec		edx
	inc		ecx
	jmp		.loop
.end:
	pop		ebp
	ret

; str_len(char *s) -> int
; @Note: Stores output in ecx
_str_len:
	push	ebp
	mov		ebp, esp
	mov		eax, dword [ebp + 8]
	xor		ebx, ebx
	xor		ecx, ecx
.loop:
	mov		bl, byte [eax + ecx]
	cmp		bl, 0
	je		.end
	inc		ecx
	jmp		.loop
.end:
	pop		ebp
	ret

; mul(char *a, char *b, char *c) -> void
; @Note: Multiplies a, b and writes result into c
; @Note: Expects the strings to be in LSB order
; @Note: c needs to be zero-initialized
_mul:
	; [ebp +  8] = a
	; [ebp + 12] = b
	; [ebp + 16] = c
	; [ebp -  1] = carry
	; [ebp -  2] = a[i] - '0'
	; cl = i
	; ch = j
	push	ebp
	mov		ebp, esp
	sub		esp, 4
	mov		byte [ebp - 1], 0
	xor		ecx, ecx
.loop:
	mov		ebx, dword [ebp +  8]
	add		bl, cl
	adc		ebx, 0
	xor		edx, edx
	mov		bl,  byte  [ebx]

	cmp		bl, 0
	je		.end
	sub		bl, '0'
	mov		byte [ebp - 2], bl
	xor		ch, ch
.inner:
	mov		edx, dword [ebp + 12]
	add		dl, ch
	adc		edx, 0
	mov		dl,  byte  [edx]
	cmp		dl, 0
	je		.inner_end
	sub		dl, '0'
	xor		eax, eax				; eax = 0
	mov		al, dl					; eax = [b + ch]
	xor		edx, edx				; edx = 0
	mov		dl, byte [ebp - 2]		; edx = [a + cl]
	mul		dl						; eax = a[i]*b[j]
	; Calculating carry via iterated subtraction, cause division is annoying as hell in assembly
	xor		edx, edx				; edx = 0
	add		al, byte [ebp - 1]		; eax = a[i]*b[j] + carry
	mov		byte [ebp - 1], 0		; carry = 0
.carry:
	cmp		al, 10					; while eax > 10
	jl		.no_carry
.carry_no_check:
	sub		al, 10					; eax -= 10
	inc		dl						; edx++  (edx represents carry)
	jmp		.carry
.no_carry:
	mov		byte [ebp - 1], dl		; [ebp - 1] = carry
	mov		edx, dword [ebp + 16]	; edx = c
	xor		ebx, ebx				; ebx = 0
	add		dl, cl					; edx = c + cl
	adc		edx, 0
	add		dl, ch					; edx = c + cl + ch
	adc		edx, 0
	mov		bl, byte [edx]			; ebx = [c + cl + ch]
	add		al, bl					; eax = a[i]*b[j] + carry + [c + cl + ch]
	cmp		al, 10					; while eax > 10
	jl		.carry_done
	mov		byte [edx], 0			; [c + cl + ch] = 0
	xor		edx, edx				; edx = 0
	mov		dl, byte [ebp - 1]		; edx = carry
	jmp		.carry_no_check
.carry_done:
	mov		byte [edx], al			; [c + cl + ch] = eax
	inc		ch
	jmp		.inner
.inner_end:
	inc		cl
	jmp		.loop
.end:
	mov		edx, dword [ebp + 16]
	xor		eax, eax
	xor		ebx, ebx
	mov		bl, ch
	mov		ch, 0
	add		ecx, ebx
.nums_to_ascii_loop:
	cmp		ecx, 1
	je		.nums_to_ascii_end
	mov		al, byte [edx]
	add		al, '0'
	mov		byte [edx], al
	inc		edx
	dec		ecx
	jmp		.nums_to_ascii_loop
.nums_to_ascii_end:
	mov		bl, byte [ebp - 1]
	cmp		bl, 0
	je		.zero_termination
	add		bl, '0'
	mov		byte [edx], bl
	inc		edx
.zero_termination:
	mov		byte [edx], 0
	add		esp, 4
	pop     ebp
    ret

; fact_digit_sum(int n) -> int
; @Note: Return value stored in eax
_fact_digit_sum:
	; [ebp +  8] = n
	; [ebp -  4] = a
	; [ebp -  8] = b
	; [ebp - 12] = c
	; [ebp - 16] = i (counting from n to 0)
	push	ebp
	mov		ebp, esp
	sub		esp, 16
; Prepare variables
	mov		dword [ebp -  4], a
	mov		dword [ebp -  8], b
	mov		dword [ebp - 12], c
	mov		byte [c], '1'	; c and b are switched here, cause they get switched back at the beginning of the loop
	mov		byte [c + 1], 0
	mov		byte [b], '0'
	mov		byte [b + 1], 0
	mov		edx, dword [ebp + 8]
	mov		dword [ebp - 16], edx
; Loop through all numbers up to and including n to multiply together
.fact_loop:
	mov		ecx, dword [ebp - 16]
	cmp		ecx, 0
	je		.fact_end
	mov		edx, ecx
	dec		edx
	mov		dword [ebp - 16], edx
; Convert number to string and store it in a
	push	dword [ebp - 4]
	push	ecx
	call	_itoa
	add		esp, 8
; Switch pointers b<->c
	mov		ebx, dword [ebp -  8]
	mov		edx, dword [ebp - 12]
	mov		dword [ebp -  8], edx
	mov		dword [ebp - 12], ebx
; Zero-initializing output string (c)
	mov		edx, dword [ebp - 12]
	xor		ecx, ecx
.zero_init_loop:
	cmp		ecx, 256
	je		.zero_init_end
	mov		byte [edx + ecx], 0
	inc		ecx
	jmp		.zero_init_loop
.zero_init_end:
	mov		dword [ebp - 12], edx
; Multiply a*b and store result in c
	push	dword [ebp - 12]
	push	dword [ebp -  8]
	push	dword [ebp -  4]
	call	_mul
	add		esp, 12
; Repeat loop (decreasing counter is unnecessary, as that was already done at beginning of loop)
	jmp		.fact_loop
.fact_end:
	mov		edx, dword [ebp - 12]
	xor		ebx, ebx
	xor		eax, eax
.sum_loop:
	mov		bl, byte [edx]
	cmp		bl, 0
	je		.sum_end
	sub		bl, '0'
	add		eax, ebx
	inc		edx
	jmp		.sum_loop
.sum_end:
; @nocheckin
	push	eax
	push	dword [ebp - 12]
	call	_str_len
	add		esp, 4
	push	dword [ebp - 12]
	push	ecx
	call	_reverse_str
	add		esp, 8
	push	dword [ebp - 12]
	call	_printf
	push	_newline
	call	_printf
	add		esp, 8
	pop		eax

	add		esp, 16
	pop		ebp
	ret


; main(int argc, char **argv) -> int
_main:
    push    ebp
    mov     ebp, esp
; Parse argv[1] as int and calculate digit sum of factorial of argv[1]
    mov     eax, dword [ebp + 12]	; Store argv in eax
    push	dword [eax + 4]			; Push argv[1]
    call	_atoi					; atoi(argv[1]) stored in edx
    add		esp, 4
	push	edx
	call	_fact_digit_sum			; fact_digit_sum(atoi(argv[1])) stored in eax
	add		esp, 4
; Print result
	push	eax
	push	_printf_digit
	call	_printf
	add		esp, 8
; Return 0 for success
    mov     eax, 0
    pop     ebp
    ret

_printf_digit:
    db	'%d',10,0

_printf_hex:
	db '%#010x',10,0

_newline:
	db 10,0