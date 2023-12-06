    global  _main
    extern  _printf

	section .text

; get_digits(char *str)
; eax: char* (input and output)
; ebx: *(eax)
; cl: first digit
; dl: second digit
; output number: edx
_get_digits_of_line:
    ; Entering Function
    push	ebp
    mov		ebp, esp
    xor     ebx, ebx
    xor     ecx, ecx
    xor     edx, edx
.loop:
    mov     bl, byte [eax]
    cmp     bl, 0
    je      .end
    cmp     bl, '9'
    jg      .inner_end
    cmp     bl, '0'
    jl      .inner_end
    cmp     ecx, 0
    jg      .set_second_digit
    mov     cl, bl
.set_second_digit:
    mov     dl, bl
.inner_end:
    inc     eax
	jmp		.loop
.new_line:
    inc     eax
.end:
    sub     ecx, '0'
    imul    ecx, 10
    sub     edx, '0'
    add     edx, ecx
    ; Leaving Function
    pop		ebp
    ret


; main(int argc, char **argv) -> int
_main:
    push    ebp
    mov     ebp, esp
	; Local Variables
    ; [ebp + 12] = argv
    ; [ebp - 8]  = argc
    ; [ebp - 4]  = argv index
    ; [ebp - 8]  = sum
	sub		esp, 8
	mov		dword [ebp - 4], 0		; Initialize index to 0
    mov     dword [ebp - 8], 0      ; Initialize sum to 0
    mov     eax, dword [ebp + 8]    ; Store argc in eax
    imul    eax, 4                  ; eax *= 4
    mov     dword [ebp + 8], eax    ; Store argc*4 back in ebp+8
                                    ; @Note: argc*4 gives us the maximum index for ending the loop
.loop:
	mov		eax, dword [ebp + 12]	; Store argv in eax
    add     dword [ebp - 4], 4      ; Add 4 for next index
    mov     edx, dword [ebp - 4]    ; Store index in edx
    mov     ebx, dword [ebp + 8]    ; Store argc*4 in ebx
    cmp     ebx, edx                ; End loop when index == argc*4
    je      .end
    add     eax, dword [ebp - 4]
    mov     eax, dword [eax]        ; Store argv[1] in eax
	call	_get_digits_of_line
    mov     ecx, dword [ebp - 8]
    add     ecx, edx
    mov     dword [ebp - 8], ecx
	jmp		.loop
.end:
	; Print result
	; @Note: Don't need to push sum, as it is already last element on the stack
    push    ecx
	push	_printf_digit
	call	_printf
	add		esp, 8					; Cleanup stack counter
; Return 0 for success
    add     esp, 8
    mov     eax, 0
    pop     ebp
    ret

_printf_digit:
    db	'%d',10,0