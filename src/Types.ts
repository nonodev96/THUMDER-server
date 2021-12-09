export type File = {
  content: string;
};
export type TypeRegisterControl =
  | 'PC'
  | 'IMAR'
  | 'IR'
  | 'A'
  | 'AHI'
  | 'B'
  | 'BHI'
  | 'BTA'
  | 'ALU'
  | 'ALUHI'
  | 'FPSR'
  | 'DMAR'
  | 'SDR'
  | 'SDRHI'
  | 'LDR'
  | 'LDRHI';

export type TypeStage =
  | ''
  | 'IF'
  | 'ID'
  | 'intEX'
  | 'MEM'
  | 'WB'
  | 'trap'
  | 'other'
  | 'faddEX_0'
  | 'faddEX_1'
  | 'faddEX_2'
  | 'faddEX_3'
  | 'faddEX_4'
  | 'faddEX_5'
  | 'faddEX_6'
  | 'faddEX_7'
  | 'fdivEX_0'
  | 'fdivEX_1'
  | 'fdivEX_2'
  | 'fdivEX_3'
  | 'fdivEX_4'
  | 'fdivEX_5'
  | 'fdivEX_6'
  | 'fdivEX_7'
  | 'fmultEX_0'
  | 'fmultEX_1'
  | 'fmultEX_2'
  | 'fmultEX_3'
  | 'fmultEX_4'
  | 'fmultEX_5'
  | 'fmultEX_6'
  | 'fmultEX_7';

export type TypeData = 'Byte' | 'HalfWord' | 'Word' | 'Float' | 'Double' | 'ASCII';

export type TypeRegister = 'Control' | 'Integer' | 'Float' | 'Double';

export type uint8 =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63
  | 64
  | 65
  | 66
  | 67
  | 68
  | 69
  | 70
  | 71
  | 72
  | 73
  | 74
  | 75
  | 76
  | 77
  | 78
  | 79
  | 80
  | 81
  | 82
  | 83
  | 84
  | 85
  | 86
  | 87
  | 88
  | 89
  | 90
  | 91
  | 92
  | 93
  | 94
  | 95
  | 96
  | 97
  | 98
  | 99
  | 100
  | 101
  | 102
  | 103
  | 104
  | 105
  | 106
  | 107
  | 108
  | 109
  | 110
  | 111
  | 112
  | 113
  | 114
  | 115
  | 116
  | 117
  | 118
  | 119
  | 120
  | 121
  | 122
  | 123
  | 124
  | 125
  | 126
  | 127
  | 128
  | 129
  | 130
  | 131
  | 132
  | 133
  | 134
  | 135
  | 136
  | 137
  | 138
  | 139
  | 140
  | 141
  | 142
  | 143
  | 144
  | 145
  | 146
  | 147
  | 148
  | 149
  | 150
  | 151
  | 152
  | 153
  | 154
  | 155
  | 156
  | 157
  | 158
  | 159
  | 160
  | 161
  | 162
  | 163
  | 164
  | 165
  | 166
  | 167
  | 168
  | 169
  | 170
  | 171
  | 172
  | 173
  | 174
  | 175
  | 176
  | 177
  | 178
  | 179
  | 180
  | 181
  | 182
  | 183
  | 184
  | 185
  | 186
  | 187
  | 188
  | 189
  | 190
  | 191
  | 192
  | 193
  | 194
  | 195
  | 196
  | 197
  | 198
  | 199
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 209
  | 210
  | 211
  | 212
  | 213
  | 214
  | 215
  | 216
  | 217
  | 218
  | 219
  | 220
  | 221
  | 222
  | 223
  | 224
  | 225
  | 226
  | 227
  | 228
  | 229
  | 230
  | 231
  | 232
  | 233
  | 234
  | 235
  | 236
  | 237
  | 238
  | 239
  | 240
  | 241
  | 242
  | 243
  | 244
  | 245
  | 246
  | 247
  | 248
  | 249
  | 250
  | 251
  | 252
  | 253
  | 254;

export type TypeMemoryIndexValue = {
  index: number;
  value: uint8;
};

export type TypeAllMemory = TypeMemoryIndexValue[];

export type TypeAllRegisters = {
  Control: {
    register: TypeRegisterControl;
    value: string; // 0x 00000000
  }[];
  Integer: {
    register: number;
    value: string; // 0x 00000000
  }[];
  Float: {
    register: number;
    value: string; // 0x 00000000
  }[];
};

export type TypeCode = {
  text?: string;
  address: string; // 0x00000000
  instruction: string; // 0x00000000
  code: string; // 0x00000000
};

export type TypeTableCode = TypeCode & {
  stage?: TypeStage;
  index?: number;
};

export type TypeRegisterToUpdate = {
  typeRegister: TypeRegister;
  register: string; // TypeRegisterControl & number [0-31]
  hexadecimalValue: string; // hexadecimal 0x00000000
};

export type TypeMemoryToUpdate = {
  typeData: TypeData;
  address: string;
  value: string;
};

export type TypePipeline = {
  // Address
  IF: string;
  ID: string;
  intEX: string;
  faddEX: { unit: number; address: string }[];
  fmultEX: { unit: number; address: string }[];
  fdivEX: { unit: number; address: string }[];
  MEM: string;
  WB: string;
};

export type TypeSimulationStep = {
  step: number;
  line: number;
  instruction: string;
  codeInstruction: string;
  isComplete?: boolean;
  // stage: TypeStage;

  IF: number;
  IF_stall: number;
  ID: number;
  ID_stall: number;
  intEX: number;
  intEX_stall: number;
  MEM: number;
  MEM_stall: number;
  WB: number;
  WB_stall: number;

  pipeline: TypePipeline;
  registers: TypeRegisterToUpdate[];
  memory: TypeMemoryToUpdate[];
};

export type TypeFloatingPointConfiguration = {
  addition: {
    count: number;
    delay: number;
  };
  multiplication: {
    count: number;
    delay: number;
  };
  division: {
    count: number;
    delay: number;
  };
};

export type TypeSimulationInitRequest = {
  filename: string;
  id: string;
  date: string;
  content: string;

  registers: TypeRegisterToUpdate[];
  memory: TypeMemoryToUpdate[];
};

export type TypeSimulationInitResponse = {
  filename: string;
  id: string;
  date: string;
  steps: number;
  lines: number;

  code: TypeCode[];
  runner: TypeSimulationStep[];
};
