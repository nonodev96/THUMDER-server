# THUMDER-server

Este es un proyecto de una API de pruebas que genera el código máquina de una arquitectura DLX, para ello se utilizan
distintas tecnologías, este proyecto está hecho en typescript para ser ejecutado sobre node, montando un servidor,
utiliza tecnologías Websocket para la comunicación con la librería "socket.io", Jest para los UnitTests y
"socket.io-client" para los tests de unidad, este simula una conexión y un pedido que es que genere el código binario
del los ficheros con mocks.

Para ello usamos nodemon un programa que permite relanzar programas en caso de fallo o de actualización de los ficheros

Para desplegar el servidor en fase de pruebas

```bash
npm run dev
```

Para ejecutar los tests en el servidor de pruebas

```bash
npm run test
```

## SERVER

```
Connection new Socket GmdJkXHZzC2eCxn0AAAZ
SimulationInitRequest Args

┌──────────┬───────┬───────────┬───────┬─────────────────────────────────────┐
│ address  │ label │ directive │ data  │ text                                │
├──────────┼───────┼───────────┼───────┼─────────────────────────────────────┤
│ 00000000 │       │ GLOBAL    │ COUNT │ .GLOBAL        COUNT                │
│ 00000004 │ COUNT │ WORD      │ 10    │ COUNT:        .WORD        10       │
│ 00000008 │       │ GLOBAL    │ TABLE │ .GLOBAL        TABLE                │
│ 0000000C │ TABLE │ SPACE     │ 4     │ TABLE:        .SPACE        COUNT*4 │
│ 00000010 │       │ TEXT      │       │ .TEXT                               │
│ 00000100 │       │ GLOBAL    │ MAIN  │ .GLOBAL    MAIN                     │
└──────────┴───────┴───────────┴───────┴─────────────────────────────────────┘
┌────────────┬──────────────┬────────────┬─────────────────────────────┬───────────┐
│ address    │         text │ code       │ instruction                 │     label │
├────────────┼──────────────┼────────────┼─────────────────────────────┼───────────┤
│ 0x00000100 │        $TEXT │ 0x20010000 │ ADDI R1, R0, 0x0            │      MAIN │
│ 0x00000104 │     MAIN+0x4 │ 0x20020002 │ ADDI R2, R0, 0x2            │           │
│ 0x00000108 │     MAIN+0x8 │ 0x20100010 │ ADDI R16, R0, 0x10          │           │
│ 0x0000010C │     MAIN+0xC │ 0x20120008 │ ADDI R18, R0, 0x8           │           │
│ 0x00000110 │    NEXTVALUE │ 0x20030000 │ ADDI R3, R0, 0x0            │ NEXTVALUE │
│ 0x00000114 │         LOOP │ 0x00232028 │ SEQ R4, R1, R3              │      LOOP │
│ 0x00000118 │     LOOP+0x4 │ 0x14800024 │ BNEZ R4, ISPRIM             │           │
│ 0x0000011C │     LOOP+0x8 │ 0x0000008C │ Instruction error OPCode #0 │           │
│ 0x00000120 │     LOOP+0xC │ 0x0045301B │ DIVU R6, R2, R5             │           │
│ 0x00000124 │    LOOP+0x10 │ 0x00C53819 │ MULTU R7, R6, R5            │           │
│ 0x00000128 │    LOOP+0x14 │ 0x00474023 │ SUBU R8, R2, R7             │           │
│ 0x0000012C │    LOOP+0x18 │ 0x11000028 │ BEQZ R8, ISNOPRIM           │           │
│ 0x00000130 │    LOOP+0x1C │ 0x20630004 │ ADDI R3, R3, 0x4            │           │
│ 0x00000134 │    LOOP+0x20 │ 0x0212A01B │ DIVU R20, R16, R18          │           │
│ 0x00000138 │    LOOP+0x24 │ 0x0212B01B │ DIVU R22, R16, R18          │           │
│ 0x0000013C │    LOOP+0x28 │ 0x0BFFFFD4 │ J LOOP                      │           │
│ 0x00000140 │       ISPRIM │ 0xAC000000 │ SW #0(R0), R0               │    ISPRIM │
│ 0x00000144 │   ISPRIM+0x4 │ 0x20210004 │ ADDI R1, R1, 0x4            │           │
│ 0x00000148 │   ISPRIM+0x8 │ 0x0000008C │ Instruction error OPCode #0 │           │
│ 0x0000014C │   ISPRIM+0xC │ 0x00205082 │ SRLI R10, R1, 0x2           │           │
│ 0x00000150 │  ISPRIM+0x10 │ 0x0149582D │ SGE R11, R10, R9            │           │
│ 0x00000154 │  ISPRIM+0x14 │ 0x15600008 │ BNEZ R11, FINISH            │           │
│ 0x00000158 │     ISNOPRIM │ 0x20420001 │ ADDI R2, R2, 0x1            │  ISNOPRIM │
│ 0x0000015C │ ISNOPRIM+0x4 │ 0x0BFFFFB0 │ J NEXTVALUE                 │           │
│ 0x00000160 │       FINISH │ 0x44000000 │ TRAP 0x0                    │    FINISH │
└────────────┴──────────────┴────────────┴─────────────────────────────┴───────────┘
┌──────────┬───────┬────────┬────────┬────────┬────────┬────────────┬────────────┬────────────┬──────────────────────────────────┐
│ address  │ index │ byte_0 │ byte_1 │ byte_2 │ byte_3 │ halfword_0 │ halfword_1 │ word       │ binary32                         │
├──────────┼───────┼────────┼────────┼────────┼────────┼────────────┼────────────┼────────────┼──────────────────────────────────┤
│ 00000004 │ 4     │ 0      │ 0      │ 0      │ 10     │ 0          │ 0          │ 10         │ 00000000000000000000000000001010 │
│ 00000100 │ 256   │ 32     │ 1      │ 0      │ 0      │ 8193       │ 0          │ 536936448  │ 00100000000000010000000000000000 │
│ 00000104 │ 260   │ 32     │ 2      │ 0      │ 2      │ 8194       │ 0          │ 537001986  │ 00100000000000100000000000000010 │
│ 00000108 │ 264   │ 32     │ 16     │ 0      │ 16     │ 8208       │ 0          │ 537919504  │ 00100000000100000000000000010000 │
│ 0000010C │ 268   │ 32     │ 18     │ 0      │ 8      │ 8210       │ 0          │ 538050568  │ 00100000000100100000000000001000 │
│ 00000110 │ 272   │ 32     │ 3      │ 0      │ 0      │ 8195       │ 0          │ 537067520  │ 00100000000000110000000000000000 │
│ 00000114 │ 276   │ 0      │ 35     │ 32     │ 40     │ 35         │ 32         │ 2301992    │ 00000000001000110010000000101000 │
│ 00000118 │ 280   │ 20     │ 128    │ 0      │ 36     │ 5248       │ 0          │ 343932964  │ 00010100100000000000000000100100 │
│ 0000011C │ 284   │ 0      │ 0      │ 0      │ 140    │ 0          │ 0          │ 140        │ 00000000000000000000000010001100 │
│ 00000120 │ 288   │ 0      │ 69     │ 48     │ 27     │ 69         │ 48         │ 4534299    │ 00000000010001010011000000011011 │
│ 00000124 │ 292   │ 0      │ 197    │ 56     │ 25     │ 197        │ 56         │ 12924953   │ 00000000110001010011100000011001 │
│ 00000128 │ 296   │ 0      │ 71     │ 64     │ 35     │ 71         │ 64         │ 4669475    │ 00000000010001110100000000100011 │
│ 0000012C │ 300   │ 17     │ 0      │ 0      │ 40     │ 4352       │ 0          │ 285212712  │ 00010001000000000000000000101000 │
│ 00000130 │ 304   │ 32     │ 99     │ 0      │ 4      │ 8291       │ 0          │ 543358980  │ 00100000011000110000000000000100 │
│ 00000134 │ 308   │ 2      │ 18     │ 160    │ 27     │ 530        │ 160        │ 34775067   │ 00000010000100101010000000011011 │
│ 00000138 │ 312   │ 2      │ 18     │ 176    │ 27     │ 530        │ 176        │ 34779163   │ 00000010000100101011000000011011 │
│ 0000013C │ 316   │ 11     │ 255    │ 255    │ 212    │ 3071       │ 255        │ 201326548  │ 00001011111111111111111111010100 │
│ 00000140 │ 320   │ 172    │ 0      │ 0      │ 0      │ 44032      │ 0          │ 2885681152 │ 10101100000000000000000000000000 │
│ 00000144 │ 324   │ 32     │ 33     │ 0      │ 4      │ 8225       │ 0          │ 539033604  │ 00100000001000010000000000000100 │
│ 00000148 │ 328   │ 0      │ 0      │ 0      │ 140    │ 0          │ 0          │ 140        │ 00000000000000000000000010001100 │
│ 0000014C │ 332   │ 0      │ 32     │ 80     │ 130    │ 32         │ 80         │ 2117762    │ 00000000001000000101000010000010 │
│ 00000150 │ 336   │ 1      │ 73     │ 88     │ 45     │ 329        │ 88         │ 21583917   │ 00000001010010010101100000101101 │
│ 00000154 │ 340   │ 21     │ 96     │ 0      │ 8      │ 5472       │ 0          │ 358613000  │ 00010101011000000000000000001000 │
│ 00000158 │ 344   │ 32     │ 66     │ 0      │ 1      │ 8258       │ 0          │ 541196289  │ 00100000010000100000000000000001 │
│ 0000015C │ 348   │ 11     │ 255    │ 255    │ 176    │ 3071       │ 255        │ 201326512  │ 00001011111111111111111110110000 │
│ 00000160 │ 352   │ 68     │ 0      │ 0      │ 0      │ 17408      │ 0          │ 1140850688 │ 01000100000000000000000000000000 │
└──────────┴───────┴────────┴────────┴────────┴────────┴────────────┴────────────┴────────────┴──────────────────────────────────┘
```

### TODO - FIX

Hay varios errores en el proyecto, ya que este no es un proyecto definitivo, sino un servidor de pruebas para realizar
simulaciones muy simples.

Algunos de estos errores están descritos en el tests que se adjunta debajo así como en la memoria y código generado,
aunque la mayoría de las instrucciones están bien generadas algunas presentan fallos, esto es debido a que utilizan las
referencias / labels / tags y en nuestro servidor de pruebas este código presenta fallos cuando utilizamos algunas tags.
Algunos de estos fallos se muestran con el texto de instrucción "Instruction error OPCode #0".

Para arreglar estos fallos debemos hacer algunos cambios en las estructuras de datos que usamos en el InterpreterDLX.ts
así como en la clase Utils y UtilsEEDD.

Fallos detectados:
 * En el interprete de las directivas no se realizan las operaciones. 
   * Ejemplo: "TABLE: .SPACE COUNT * 4" no se realiza la operación COUNT * 4 que debería dar 40
 * Este error es menor y no supone ningún cambio, WinDLX no genera algunos tags ya que detecta que se realiza un salto y por tanto le pone de nombre la dirección de memoria donde se almacena, en nuestro caso esto no es así y le ponemos de nombre el que le corresponde por dirección de memoria y por posición. 
   * Ejemplo: "instruction": "BNEZ R11, FINISH" | "text": "0x00000154" => "text": "ISPRIM+0x14"

### FIXED

* Se cambia en el interprete las labels.
   * Ejemplo: "TABLE" y "COUNT"
   * Se calcula correctamente la instrucción "SW TABLE(R1), R2" en la dirección "0x00000140" por el fallo mencionado anteriormente


## TEST prim.s

```test
Error: expect(received).toBe(expected) // Object.is equality

- Expected  - 9
+ Received  + 9

@@ -43,12 +43,12 @@
        "instruction": "BNEZ R4, ISPRIM",
        "text": "LOOP+0x4",
      },
      Object {
        "address": "0x0000011C",
-       "code": "0x8C651004",
-       "instruction": "LW R5, TABLE(R3)",
+       "code": "0x0000008C",
+       "instruction": "Instruction error OPCode #0",
        "text": "LOOP+0x8",
      },
      Object {
        "address": "0x00000120",
        "code": "0x0045301B",
@@ -97,24 +97,24 @@
        "instruction": "J LOOP",
        "text": "LOOP+0x28",
      },
      Object {
        "address": "0x00000140",
-       "code": "OxAC221004",
-       "instruction": "SW TABLE(R1), R2",
+       "code": "0xAC000000",
+       "instruction": "SW #0(R0), R0",
        "text": "ISPRIM",
      },
      Object {
        "address": "0x00000144",
        "code": "0x20210004",
        "instruction": "ADDI R1, R1, 0x4",
        "text": "ISPRIM+0x4",
      },
      Object {
        "address": "0x00000148",
-       "code": "0x8C091000",
-       "instruction": "SW R9, $DATA(R0)",
+       "code": "0x0000008C",
+       "instruction": "Instruction error OPCode #0",
        "text": "ISPRIM+0x8",
      },
      Object {
        "address": "0x0000014C",
        "code": "0x00205082",
@@ -123,17 +123,17 @@
      },
      Object {
        "address": "0x00000150",
        "code": "0x0149582D",
        "instruction": "SGE R11, R10, R9",
-       "text": "0x00000150",
+       "text": "ISPRIM+0x10",
      },
      Object {
        "address": "0x00000154",
        "code": "0x15600008",
        "instruction": "BNEZ R11, FINISH",
-       "text": "0x00000154",
+       "text": "ISPRIM+0x14",
      },
      Object {
        "address": "0x00000158",
        "code": "0x20420001",
        "instruction": "ADDI R2, R2, 0x1",
@@ -141,11 +141,11 @@
      },
      Object {
        "address": "0x0000015C",
        "code": "0x0BFFFFB0",
        "instruction": "J NEXTVALUE",
-       "text": "0x0000015C",
+       "text": "ISNOPRIM+0x4",
      },

```

