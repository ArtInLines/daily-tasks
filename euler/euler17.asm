    global  _main
    extern  _printf

    section .data
; Store the length of the words "Zero", "One", ... in a table
; From 0 to 9
onesTable     dd 4,3,3,5,4,4,3,5,5,4
; From 10 to 19
teensTable    dd 3,6,6,8,8,7,7,9,8,8
; All ten-based words starting at 20 (e.g. 20-30-40-...-90)
tensTable     dd 6,6,5,5,5,7,6,6
; Length of word "and"
andLen        dd 3
; Length for words "hundred", "thousand", "million", "billion"
tenPowerTable dd 7,8,7,7


    section .text

; sum_ones(int upper) -> int (stored in eax)
_sum_ones:
    push    ebp
    mov     ebp, esp
    mov     ecx, dword [ebp + 8]    ; ecx = upper
    mov     eax, 0                  ; eax = output (initiliazed to 0)
.loop:
    cmp     ecx, 0
    je      .end
    add     eax, dword [onesTable + ecx*4]
    dec     ecx
    jmp     .loop
.end:
    pop     ebp
    ret


; sum_tens(int upper) -> int (stored in eax)
_sum_tens:
    ; Local Variables
    ; [ebp + 8]  = upper
    ; [ebp - 4]  = output
    ; [ebp - 8]  = upper/10
    ; [ebp - 12] = upper % 10
    ; [ebp - 16] = input for subprocedures
    push    ebp
    mov     ebp, esp
    sub     esp, 16
    mov     eax, dword [ebp + 8]            ; eax       = upper
    ; Call sum_ones instead if input is less than 10
    cmp     eax, 10
    jge     .sum_tens
    mov     dword [ebp - 16], eax
    call    _sum_ones
    mov     dword [ebp - 4], eax
    jmp     .end
.sum_tens:
    mov     ebx, 10                         ; ebx       = 10
    cdq                                     ; Zero out edx:eax before division (see https://stackoverflow.com/questions/38416593/why-should-edx-be-0-before-using-the-div-instruction)
    idiv    ebx                             ; eax       = upper/10
    mov     edx, eax                        ; edx       = upper/10
    mov     dword [ebp - 8], edx            ; [ebp-8]   = upper/10
    mov     ecx, dword [ebp + 8]            ; ecx       = upper
    imul    eax, ebx                        ; eax       = 10*(upper/10)
    sub     ecx, eax                        ; ecx       = upper - 10*(upper/10) = upper % 10
    mov     dword [ebp - 12], ecx           ; [ebp-12]  = upper % 10

    mov     dword [ebp - 16], 9             ; [ebp-16]  = 9
    call    _sum_ones                       ; eax       = sum_ones(9)
    mov     ebx, dword [ebp - 8]            ; ebx       = upper/10
    cmp     ebx, 1
    je      .next
    dec     ebx                             ; ebx       = upper/10 - 1
.next:
    imul    ebx                             ; eax       = sum_ones(9) * (upper/10 - (0 or 1))
    mov     dword [ebp - 4], eax            ; [ebp-4]   = sum_ones(9)*(upper/10 - (0 or 1))

    cmp     dword [ebp - 8], 2              ; if (upper/10 < 2) goto .below_twenty
    jl      .below_twenty

    mov     ecx, dword [ebp - 12]           ; ecx       = upper % 10
    mov     dword [ebp - 16], ecx           ; [ebp-16]  = upper % 10
    call    _sum_ones                       ; eax       = sum_ones(upper % 10)
    add     dword [ebp - 4], eax            ; [ebp-4]   = sum_ones(upper % 10) + sum_ones(9)*(upper/10 - (0 or 1))

    mov     ebx, dword [ebp - 8]            ; ebx       = upper/10
    sub     ebx, 2                          ; ebx       = upper/10 - 2
    mov     eax, dword [tensTable + ebx*4]  ; eax       = str_len(upper/10)
    mov     ebx, dword [ebp - 12]           ; ebx       = upper % 10
    inc     ebx                             ; ebx       = (upper % 10) + 1
    imul    ebx                             ; eax       = str_len(upper/10) * ((upper % 10) + 1)
    add     dword [ebp - 4], eax            ; [ebp-4]   = sum_ones(upper % 10) + sum_ones(9)*(upper/10 - (0 or 1)) + str_len(upper/10)*((upper % 10) + 1)

    mov     ecx, dword [ebp - 8]            ; ecx       = upper/10
    cmp     ecx, 3
    jl      .loop_end
    sub     ecx, 3                          ; ecx       = upper/10 - 3
    mov     ebx, 10                         ; ebx       = 10
.loop:
    cmp     ecx, 0
    jl      .loop_end
    mov     eax, dword [tensTable + ecx*4]  ; eax       = str_len(10*(ecx + 2))
    imul    ebx                             ; eax       = 10*str_len(10*(ecx + 2))
    add     [ebp - 4], eax                  ; [ebp-4]   = sum_ones(upper % 10) + sum_ones(9)*(upper/10 - 1) + str_len(upper/10)*((upper % 10) + 1) + 10*str_len(10*(ecx + 2))
    dec     ecx
    jmp     .loop
.loop_end:
    mov     dword [ebp - 12], 9             ; [ebp - 8] = 9 = 19 % 10 (to make sure the assumption for .below_twenty is correct)
.below_twenty:                              ; Assumes 20 > upper >= 10 and [ebp-8] = upper % 10
    mov     ecx, dword [ebp - 12]           ; ecx = upper % 10
.below_twenty_loop:
    mov     edx, dword [teensTable + ecx*4]
    add     dword [ebp - 4], edx            ; add to total sum
    cmp     ecx, 0
    je      .end
    dec     ecx
    jmp     .below_twenty_loop
.end:
    mov     eax, dword [ebp - 4]
    add     esp, 16
    pop     ebp
    ret


; sum_ten_powers(int upper) -> int (stored in eax)
_sum_hundreds:
    ; Local Variables
    ; [ebp + 8]  = upper
    ; [ebp - 4]  = output
    ; [ebp - 8]  = upper / 100
    ; [ebp - 12] = upper % 100
    ; [ebp - 16] = input for subprocedures
    push    ebp
    mov     ebp, esp
    sub     esp, 16
    mov     eax, dword [ebp + 8]            ; eax       = upper
    ; Call sum_tens instead if input is less than 100
    cmp     eax, 100
    jge     .sum_hundreds
    mov     dword [ebp - 16], eax
    call    _sum_tens
    mov     dword [ebp - 4], eax
    jmp     .end
.sum_hundreds:
    mov     ebx, 100                        ; ebx       = 100
    cdq                                     ; Zero out edx:eax before division (see https://stackoverflow.com/questions/38416593/why-should-edx-be-0-before-using-the-div-instruction)
    idiv    ebx                             ; eax       = upper/100
    mov     edx, eax                        ; edx       = upper/100
    mov     dword [ebp - 8], edx            ; [ebp-8]   = upper/100
    mov     ecx, dword [ebp + 8]            ; ecx       = upper
    imul    eax, ebx                        ; eax       = 100*(upper/100)
    sub     ecx, eax                        ; ecx       = upper - 100*(upper/100) = upper % 100
    mov     dword [ebp - 12], ecx           ; [ebp-12]  = upper % 100
    ; sum(upper % 100)
    mov     dword [ebp - 16], ecx
    call    _sum_tens
    mov     dword [ebp - 4], eax
    ; "hundred" * (upper - 99)
    mov     ebx, dword [ebp + 8]
    sub     ebx, 99
    mov     eax, ebx
    imul    dword [tenPowerTable]
    add     dword [ebp - 4], eax
    ; "and" * (upper - 99 - (upper/100))
    mov     eax, dword [andLen]
    sub     ebx, dword [ebp - 8]
    imul    ebx
    add     dword [ebp - 4], eax
    ; sum_tens(99) * upper/100
    mov     dword [ebp - 16], 99
    call    _sum_tens
    imul    dword [ebp - 8]
    add     dword [ebp - 4], eax
    ; e.g. upper = 653 then we need to add "six"*54, "five"*100, "four"*100, ...
    mov     ecx, dword [ebp - 8]
    mov     ebx, dword [ebp - 12]
    inc     ebx
.loop:
    cmp     ecx, 0
    je      .end
    mov     eax, dword [onesTable + ecx*4]
    imul    ebx
    add     dword [ebp - 4], eax
    mov     ebx, 100
    dec     ecx
    jmp     .loop
.end:
    mov     eax, dword [ebp - 4]
    add     esp, 16
    pop     ebp
    ret


; sum(int upper) -> int (stored in eax)
; @Note: The sum always starts counting at "one"
_sum:
_sum_thousands:
    push    ebp
    mov     ebp, esp
    mov     ecx, dword [ebp + 8]    ; ecx = upper
    ; Call sum_hundreds instead if input is less than 1000
    cmp     eax, 1000
    jge     .sum_thousands
    push    ecx
    call    _sum_hundreds
    pop     ecx
    jmp     .end
.sum_thousands:
    ; @Note: We only support 1000 as the highest input right now
    dec     ecx
    push    ecx
    call    _sum_hundreds
    pop     ecx
    add     eax, dword [tenPowerTable + 4]
    add     eax, dword [onesTable     + 4]
.end:
    pop     ebp
    ret

; atoi(char *str) -> int
; @Note: The string has to be null-terminated
; @Note: The output is stored in eax
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
    mov		eax, edx
    ; Leaving Function
    pop		ebp
    ret

; main(int argc, char **argv) -> int
_main:
    ; Entering Function
    push    ebp
    mov     ebp, esp
    mov     ecx, dword [ebp + 8]	; Store argc in ecx (+4 for ebp and +4 for beginning of argc)
    mov     eax, dword [ebp + 12]	; Store argv in eax
    ; Calling printf
    push	dword [eax + 4]			; Push argv[1]
    call	_atoi
    add		esp, 4

    push 	eax						; Push result of atoi
    call    _sum
    add     esp, 4

    push    eax                     ; Push result of sum
    push	_printf_msg
    call    _printf
    add		esp, 8					; Move stack pointer back (after pushes for printf)
    ; Leaving function
    mov     eax, 0					; Set 0 for return value
    pop     ebp
    ret

_printf_msg:
    db	'%d',10,0