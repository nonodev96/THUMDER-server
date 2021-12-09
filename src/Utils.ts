/* @formatter:off */
const OPCODES_TYPE_I_J = [
  // { bits: '000000', name: '(RR ALU)'  },
  { opcode: '001000', name: 'ADDI' },
  { opcode: '010000', name: 'RFE' },
  { opcode: '011000', name: 'SEQI' },
  { opcode: '100000', name: 'LB' },
  { opcode: '101000', name: 'SB' },

  // { opcode: '000001', name: '(FLOAT)'   },
  { opcode: '001001', name: 'ADDUI' },
  { opcode: '010001', name: 'TRAP' },
  { opcode: '011001', name: 'SNEI' },
  { opcode: '100001', name: 'LH' },
  { opcode: '101001', name: 'SH' },

  { opcode: '000010', name: 'J' },
  { opcode: '000011', name: 'JAL' },
  { opcode: '001010', name: 'SUBI' },
  { opcode: '010010', name: 'JR' },

  { opcode: '011010', name: 'SLTI' },
  { opcode: '001011', name: 'SUBUI' },
  { opcode: '010011', name: 'JALR' },
  { opcode: '011011', name: 'SGTI' },
  { opcode: '100011', name: 'LW' },
  { opcode: '101011', name: 'SW' },

  { opcode: '000100', name: 'BEQZ' },
  { opcode: '001100', name: 'ANDI' },
  { opcode: '010100', name: 'SLLI' },
  { opcode: '011100', name: 'SLEI' },
  { opcode: '100100', name: 'LBU' },

  { opcode: '000101', name: 'BNEZ' },
  { opcode: '001101', name: 'ORI' },
  { opcode: '011101', name: 'SGEI' },
  { opcode: '100101', name: 'LHU' },

  { opcode: '000110', name: 'BFPT' },
  { opcode: '001110', name: 'XORI' },
  { opcode: '010110', name: 'SRLI' },
  { opcode: '100110', name: 'LF' },
  { opcode: '101110', name: 'SF' },

  { opcode: '000111', name: 'BFPF' },
  { opcode: '001111', name: 'LHI' },
  { opcode: '010111', name: 'SRAI' },
  { opcode: '100111', name: 'LD' },
  { opcode: '101111', name: 'SD' },
];
// DLX R-R ALU instructions (opcode = 0):
// only the least-significant 6 bits in the function field are used.
const OPCODES_TYPE_R_OPCODE_0 = [
  { operation: "000100", name: "SLL" },
  { operation: "000110", name: "SRL" },
  { operation: "000111", name: "SRA" },

  { operation: "100000", name: "ADD" },
  { operation: "100001", name: "ADDU" },
  { operation: "100010", name: "SUB" },
  { operation: "100011", name: "SUBU" },
  { operation: "100100", name: "AND" },
  { operation: "100101", name: "OR" },
  { operation: "100110", name: "XOR" },

  { operation: "101000", name: "SEQ" },
  { operation: "101001", name: "SNE" },
  { operation: "101010", name: "SLT" },
  { operation: "101011", name: "SGT" },
  { operation: "101100", name: "SLE" },
  { operation: "101101", name: "SGE" },

  { operation: "110000", name: "MOVI2S" },
  { operation: "110001", name: "MOVS2I" },
  { operation: "110010", name: "MOVF" },
  { operation: "110011", name: "MOVD" },
  { operation: "110100", name: "MOVFP2I" },
  { operation: "110101", name: "MOVI2FP" },

  { operation: "011000", name: "MULT" },
  { operation: "011001", name: "MULTU" },
  { operation: "011010", name: "DIV" },
  { operation: "011011", name: "DIVU" },
];
// DLX floating-poing instructions (opcode = 1):
// only the least-significant 6 bits in the function field are used.
const OPCODES_TYPE_R_OPCODE_1 = [
  { operation: "000000", name: "ADDF" },
  { operation: "000001", name: "SUBF" },
  { operation: "000010", name: "MULTF" },
  { operation: "000011", name: "DIVF" },
  { operation: "000100", name: "ADDD" },
  { operation: "000101", name: "SUBD" },
  { operation: "000110", name: "MULTD" },
  { operation: "000111", name: "DIVD" },

  { operation: "001000", name: "CVTF2D" },
  { operation: "001001", name: "CVTF2I" },
  { operation: "001010", name: "CVTD2F" },
  { operation: "001011", name: "CVTD2I" },
  { operation: "001100", name: "CVTI2F" },
  { operation: "001101", name: "CVTI2D" },

  { operation: "010000", name: "EQF" },
  { operation: "010001", name: "NEF" },
  { operation: "010010", name: "LTF" },
  { operation: "010011", name: "GTF" },
  { operation: "010100", name: "LEF" },
  { operation: "010101", name: "GEF" },

  { operation: "011000", name: "EQD" },
  { operation: "011001", name: "NED" },
  { operation: "011010", name: "LTD" },
  { operation: "011011", name: "GTD" },
  { operation: "011100", name: "LED" },
  { operation: "011101", name: "GED" },
];
/* @formatter:on */

export namespace Utils {
  export function dev(): void {
    console.log("dev");
  }

  export function hexadecimalToDecimal(hex: string): number {
    return parseInt(hex, 16);
  }

  export function binaryToHexadecimal(binary: string, args = {
    maxLength:  8,
    fillString: '0'
  }): string {
    return parseInt(binary, 2).toString(16).toUpperCase().padStart(args.maxLength, args.fillString);
  }

  export function hexadecimalToBinary(hexadecimal: string, args = {
    maxLength:  32,
    fillString: '0'
  }): string {
    const decimal = hexadecimalToDecimal(hexadecimal);
    return (decimal).toString(2).padStart(args.maxLength, args.fillString);
  }

  export function getTagFromLine(line: string) {
    return line.replace(":", "");
  }

  export function clearFile(content: string): string[] {
    let lines = content.split("\n");
    lines = lines.map((v) => v.trim());
    lines = lines.map((v) => {
      return v.split("\t").join("    ");
    });
    lines = lines.filter((v) => v[0] !== ";");
    lines = lines.filter((v) => v[0] !== ".");
    lines = lines.filter((v) => v !== "");
    return lines;
  }

  export function typeLineDLX(line: string): "instruction" | "tag" {
    if (line.includes(":")) {
      return "tag";
    }
    return "instruction";
  }

  export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  export function convertHexCodeToMachineInstruction_DLX(hexCode: string): string {
    const binary = parseInt(hexCode, 16).toString(2).padStart(32, "0");
    const opcode = binary.substr(0, 6);
    const func_field = binary.substr(21, 11);
    const func_field_6_last_bits = func_field.substr(-6);

    const rs1 = parseInt(binary.substr(6, 5), 2);
    const rs2 = parseInt(binary.substr(6 + 5, 5), 2);
    const rd0 = parseInt(binary.substr(6 + 5 + 5, 5), 2);

    const rs1F = parseInt(binary.substr(6, 5), 2);
    const rs2F = parseInt(binary.substr(6 + 5, 5), 2);
    const rd0F = parseInt(binary.substr(6 + 5 + 5, 5), 2);

    const rs1I = parseInt(binary.substr(6, 5), 2);
    const rd0I = parseInt(binary.substr(6 + 5, 5), 2);
    const data = parseInt(binary.substr(6 + 5 + 5, 16), 2);
    const data_26 = parseInt(binary.substr(6, 26), 2);

    if (binary === "".padStart(32, "0")) {
      return "NOP";
    }

    const is_OPCODE_0 = opcode === "000000";
    if (is_OPCODE_0) {
      const instructionTypeR_opcode_0 = OPCODES_TYPE_R_OPCODE_0.find((value) => {
        return value.operation === func_field_6_last_bits;
      });
      if (instructionTypeR_opcode_0) {
        const instruction_name = instructionTypeR_opcode_0.name;
        // Type R with opcode = 0
        return `${instruction_name} R${rd0}, R${rs1}, R${rs2}`;
      }
      return "Instruction error #0";
    }

    const is_OPCODE_1 = opcode === "000001";
    if (is_OPCODE_1) {
      const instructionTypeR_opcode_1 = OPCODES_TYPE_R_OPCODE_1.find((value) => {
        return value.operation === func_field_6_last_bits;
      });
      if (instructionTypeR_opcode_1) {
        const instruction_name = instructionTypeR_opcode_1.name;
        // Type R with opcode = 1
        return `${instruction_name} F${rd0F}, F${rs1F}, F${rs2F}`;
      }
      return "Instruction error #1";
    }

    // Others OPCODES
    const is_OPCODE_TYPE_I_or_J = OPCODES_TYPE_I_J.some((value) => {
      return value.opcode === opcode;
    });
    if (is_OPCODE_TYPE_I_or_J) {
      const obj_instruction_type_i_or_j = OPCODES_TYPE_I_J.find((value) => {
        return value.opcode === opcode;
      });

      if (obj_instruction_type_i_or_j) {
        const instruction_name = obj_instruction_type_i_or_j.name;
        // Type I or type J
        const isTypeIorJ = [
          "ADDI",
          "ADDUI",
          "SUBI",
          "SUBUI",
          "ANDI",
          "ORI",
          "XORI",
        ].includes(instruction_name);
        if (isTypeIorJ) {
          return `${instruction_name} R${rd0I}, R${rs1I}, #${data}`;
        }
        if (instruction_name === "LHI") {
          return `${instruction_name} R${rd0I}#${data}`;
        }

        // Type J
        if (["J", "JAL"].includes(instruction_name)) {
          return `${instruction_name} #${data}`;
        }
        if (["BEQZ", "BNEZ"].includes(instruction_name)) {
          return `${instruction_name} R${rs1I} #${data}`;
        }
        if (["BFPT", "BFPF"].includes(instruction_name)) {
          return `${instruction_name} #${data}`;
        }
        if (instruction_name === "RFE") {
          return instruction_name;
        }
        if (instruction_name === "TRAP") {
          return `${instruction_name} #${data_26}`;
        }

        // No se de que tipo son :3 supongamos que de tipo I
        if (["JR", "JALR"].includes(instruction_name)) {
          return `${instruction_name} R${rs1I}`;
        }

        if (
          [
            "SLLI",
            "SRLI",
            "SRAI",
            "SEQI",
            "SNEI",
            "SLTI",
            "SGTI",
            "SLEI",
            "SGEI",
          ].includes(instruction_name)
        ) {
          return `${instruction_name} R${rd0I}, R${rs1I}, #${data}`;
        }

        if (["LB", "LH", "LW", "LBU", "LHU"].includes(instruction_name)) {
          return `${instruction_name} R${rd0I}, ##${data}(R${rs1I})`;
        }
        if (["LF", "LD"].includes(instruction_name)) {
          return `${instruction_name} F${rd0I}, ##${data}(R${rs1I})`;
        }

        if (["SB", "SH", "SW"].includes(instruction_name)) {
          return `${instruction_name} ##${data}(R${rs1I}), R${rd0I}`;
        }
        if (["SF", "SD"].includes(instruction_name)) {
          return `${instruction_name} ##${data}(R${rs1I}), F${rd0I}`;
        }
      }
      return "Instruction error #1";
    }

    return "Instruction error #-1";
  }

  export function convertMachineInstructionToHexCode_DLX(_instruction: string): string {
    const instruction = _instruction.toUpperCase();
    const textParser = instruction.match(/[\w]+/gm);
    if (!textParser) {
      console.log("_instruction", _instruction);
      console.log("textParser", textParser);
      throw new Error("Can't parser");
    }
    // console.log("textParser: ", textParser);
    const nameInstruction = textParser[0];

    const isTypeR_OPCODE_0 = OPCODES_TYPE_R_OPCODE_0.some((v) => {
      return v.name === nameInstruction;
    });
    const isTypeR_OPCODE_1 = OPCODES_TYPE_R_OPCODE_1.some((v) => {
      return v.name === nameInstruction;
    });
    const isTypeIorJ = OPCODES_TYPE_I_J.some((v) => {
      return v.name === nameInstruction;
    });

    if (isTypeR_OPCODE_0 || isTypeR_OPCODE_1) {
      const opcode = isTypeR_OPCODE_0 ? '000000' : '000001';
      const firstNum = textParser[2].slice(1);
      const secondNum = textParser[3].slice(1);
      const thirdNum = textParser[1].slice(1);
      const code = (isTypeR_OPCODE_0 ? OPCODES_TYPE_R_OPCODE_0 : OPCODES_TYPE_R_OPCODE_1)
        .filter((v) => {
          return v.name === nameInstruction;
        })[0];
      const first = parseInt(firstNum, 10).toString(2).padStart(5, '0');
      const second = parseInt(secondNum, 10).toString(2).padStart(5, '0');
      const third = parseInt(thirdNum, 10).toString(2).padStart(5, '0');
      const binaryNull = "".padStart(5, '0');

      const binary = `${opcode}${first}${second}${third}${binaryNull}${code.operation}`;
      return parseInt(binary, 2).toString(16).padStart(8, '0');
      // return "HexCodeError #-1";
    }
    if (isTypeIorJ) {
      const code = OPCODES_TYPE_I_J.filter((v) => {
        return v.name === nameInstruction;
      })[0];

      // Type J
      if (["J", "JAL"].includes(code.name)) {
        const num = getRandomInt(1, 100).toString(2).padStart(26, '0');
        return parseInt(code.opcode + num, 2).toString(16).padStart(8, '0');
      }
      if (["BEQZ", "BNEZ"].includes(code.name)) {
        const binaryNull = getRandomInt(1, 100).toString(2).padStart(26, '0');
        return parseInt(code.opcode + binaryNull, 2).toString(16).padStart(8, '0');
      }
      if (["BFPT", "BFPF"].includes(code.name)) {
        const binaryNull = getRandomInt(1, 100).toString(2).padStart(26, '0');
        return parseInt(code.opcode + binaryNull, 2).toString(16).padStart(8, '0');
      }
      if (nameInstruction === "RFE") {
        const binaryNull = "".padStart(26, '0');
        return parseInt(code.opcode + binaryNull, 2).toString(16).padStart(8, '0');
      }
      if (nameInstruction === "TRAP") {
        const binaryNull = "".padStart(26, '0');
        return parseInt(code.opcode + binaryNull, 2).toString(16).padStart(8, '0');
      }

      // Type I
      const first = parseInt(textParser[1].slice(1), 10).toString(2).padStart(5, '0');
      const second = parseInt(textParser[2].slice(1), 10).toString(2).padStart(5, '0');
      const num = parseInt(textParser[3], 10).toString(2).padStart(16, '0');

      return parseInt(code.opcode + first + second + num, 2).toString(16).padStart(8, '0');
      // return "HexCodeError #-3";
    }
    return "HexCodeError #0";
  }

  export function getInstructionFromLine(line: string): string {
    return line.toUpperCase();
  }

  export function isJSON(content: string): boolean {
    try {
      const object = JSON.parse(content);
      if (typeof object === "object") return true;
    } catch (e) {
      console.log();
    }
    return false;
  }

  export function convertIEEE754_Number_To_Binary32Bits(float32: number): string {
    let str = "";
    const c = new Uint8Array(new Float32Array([float32]).buffer, 0, 4);
    for (const element of Array.from(c).reverse()) {
      str += element.toString(2).padStart(8, '0');
    }
    return str;
  }

  export function convertIEEE754_Number_To_Binary64Bits(double64: number): string {
    let str = "";
    const c = new Uint8Array(new Float64Array([double64]).buffer, 0, 8);
    for (const element of Array.from(c).reverse()) {
      str += element.toString(2).padStart(8, '0');
    }
    return str;
  }

  export function convertIEEE754_Binary32Bits_To_Number(str: string): number {
    if (str.length !== 32) throw new Error("Binary cannot be converted because the length is not 32.");
    const arr = [];
    for (let i = 0; i < str.length; i += 8) {
      const inner = str.slice(i, i + 8);
      arr.push(parseInt(inner, 2));
    }
    const c = new Uint8Array(arr);
    return new DataView(c.buffer, 0, 4).getFloat32(0);
  }

  export function convertIEEE754_Binary64Bits_To_Number(str: string): number {
    if (str.length !== 64) throw new Error("Binary cannot be converted because the length is not 64.");
    const arr = [];
    for (let i = 0; i < str.length; i += 8) {
      const inner = str.slice(i, i + 8);
      arr.push(parseInt(inner, 2));
    }
    const c = new Uint8Array(arr);
    return new DataView(c.buffer, 0, 8).getFloat64(0);
  }

  export function LOG() {
    /*
    const status = {
      step: this.privateStep,
      line: this.privateLine,
      instruction: "",
      codeInstruction: "",
      isComplete: false,
      // stage: TypeStage;

      IF: 1,
      IF_stall: 0,
      ID: 1,
      ID_stall: 0,
      intEX: 1,
      intEX_stall: 0,
      MEM: 1,
      MEM_stall: 0,
      WB: 1,
      WB_stall: 0,

      pipeline: {
        IF: (this.privateLine + 1).toString(),
        ID: (this.privateLine + 2).toString(),
        intEX: (this.privateLine + 3).toString(),
        MEM: (this.privateLine + 4).toString(),
        WB: (this.privateLine + 5).toString(),
        faddEX: [
          {
            unit: 1,
            address: "",
          },
        ],
        fmultEX: [
          {
            unit: 1,
            address: "",
          },
        ],
        fdivEX: [
          {
            unit: 1,
            address: "",
          },
        ],
      } as TypePipeline,
      registers: [],
      memory: [],
    } as TypeSimulationStep;
    */
  }
}
