;*********** WINDLX EXP.2: GENERATE PRIME NUMBER TABLE  *************
;*********** (C) 1991 GÜNTHER RAIDL		                *************
;*********** MODIFIED 1992 MAZIAR KHOSRAVIPOUR	        *************

;-------------------------------------------------------------------
; PROGRAM BEGINS AT SYMBOL MAIN
; GENERATES A TABLE WITH THE FIRST 'COUNT' PRIME NUMBERS FROM 'TABLE'
;-------------------------------------------------------------------

		    .DATA

		    ;*** SIZE OF TABLE
		    .GLOBAL		COUNT
COUNT:		.WORD		10
		    .GLOBAL		TABLE
TABLE:		.SPACE		COUNT*4


		.TEXT
		.GLOBAL	MAIN

		;*** INITIALIZATION
MAIN:
		ADDI		R1, R0, #0		    ;INDEX IN TABLE
		ADDI		R2, R0, #2 	        ;CURRENT VALUE
		ADDI		R16, R0, #16
		ADDI 		R18, R0, #8
		;*** DETERMINE, IF R2 CAN BE DIVIDED BY A VALUE IN TABLE

NEXTVALUE:
        ADDI		R3, R0, #0 	;HELPINDEX IN TABLE

LOOP:
        SEQ	        R4, R1, R3	;END OF TABLE?
		BNEZ		R4, ISPRIM	;R2 IS A PRIME NUMBER
		LW		    R5, TABLE(R3)
		DIVU		R6, R2, R5
		MULTU		R7, R6, R5
		SUBU		R8, R2, R7
		BEQZ		R8, ISNOPRIM
		ADDI		R3, R3, #4
		DIVU		R20, R16, R18
		DIVU 		R22, R16, R18
		J		    LOOP


;*** WRITE VALUE INTO TABLE AND INCREMENT INDEX
ISPRIM:
		SW		    TABLE(R1), R2
		ADDI		R1, R1, #4

		;*** 'COUNT' REACHED?
		LW		    R9, COUNT
		SRLI	    R10, R1, #2
		SGE		    R11, R10, R9
		BNEZ		R11, FINISH


;*** CHECK NEXT VALUE
ISNOPRIM:
		ADDI		R2, R2, #1 	;INCREMENT R2
		J		    NEXTVALUE


;*** END
FINISH:
		TRAP		0