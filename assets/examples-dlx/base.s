.data 0
.double 16,13,18,10,12,15,17,18,15,12,11,18
.global const
const:  .double 14
        .text 256

ld      f0,const
add     r1,r0,r0; Puntero
addi    r2,r0,12; Contador decremental para bucle
add     r5,r0,r0; Contador de los d�as en los que la temperatura es mayor a 14 grados

bucle:	ld f2,0(r1)
	gtd f2,f0
	bfpt incremento

sigue:	addi r1,r1,8
	subi r2,r2,1
	bnez r2, bucle
	trap #0

incremento:
	addi r5,r5,1
	j sigue