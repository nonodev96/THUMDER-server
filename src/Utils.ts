import fs from "fs";
import {
  TypeAddress,
  TypeAddressDirectiveLabel,
  TypeAddressDirectiveLabelData,
  TypeAddressDirectiveNameData,
  TypeAddressLabel,
  TypeDirective,
  TypeTagLabel
} from "./Types";
import { REGEX_TYPE_DIRECTIVE, REGEX_TYPE_DIRECTIVE_VECTOR, REGEX_TYPE_LOAD_PARSER } from "./CONSTANTS";

/* @formatter:off */
// (bit0-2)(bit3-5)
const OPCODES_TYPE_I_J = [
  // { bits: '000000', name: '(RR ALU)'  },
  { opcode: "001000", name: "ADDI" },
  { opcode: "010000", name: "RFE" },
  { opcode: "011000", name: "SEQI" },
  { opcode: "100000", name: "LB" },
  { opcode: "101000", name: "SB" },

  // { opcode: '000001', name: '(FLOAT)'   },
  { opcode: "001001", name: "ADDUI" },
  { opcode: "010001", name: "TRAP" },
  { opcode: "011001", name: "SNEI" },
  { opcode: "100001", name: "LH" },
  { opcode: "101001", name: "SH" },

  { opcode: "000010", name: "J" },
  { opcode: "000011", name: "JAL" },
  { opcode: "001010", name: "SUBI" },
  { opcode: "010010", name: "JR" },

  { opcode: "011010", name: "SLTI" },
  { opcode: "001011", name: "SUBUI" },
  { opcode: "010011", name: "JALR" },
  { opcode: "011011", name: "SGTI" },
  { opcode: "100011", name: "LW" },
  { opcode: "101011", name: "SW" },

  { opcode: "000100", name: "BEQZ" },
  { opcode: "001100", name: "ANDI" },
  { opcode: "010100", name: "SLLI" },
  { opcode: "011100", name: "SLEI" },
  { opcode: "100100", name: "LBU" },

  { opcode: "000101", name: "BNEZ" },
  { opcode: "001101", name: "ORI" },
  { opcode: "011101", name: "SGEI" },
  { opcode: "100101", name: "LHU" },

  { opcode: "000110", name: "BFPT" },
  { opcode: "001110", name: "XORI" },
  // { opcode: '010110', name: 'SRLI' },
  { opcode: "100110", name: "LF" },
  { opcode: "101110", name: "SF" },

  { opcode: "000111", name: "BFPF" },
  { opcode: "001111", name: "LHI" },
  // { opcode: '010111', name: 'SRAI' },
  { opcode: "100111", name: "LD" },
  { opcode: "101111", name: "SD" }
];
// DLX R-R ALU instructions (opcode = 0):
// only the least-significant 6 bits in the function field are used.
// (bit26-28)(bit29-31)
const OPCODES_TYPE_R_OPCODE_0 = [
  { operation: "000010", name: "SRLI" },
  { operation: "000011", name: "SRAI" },
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
  { operation: "011011", name: "DIVU" }
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
  { operation: "011101", name: "GED" }
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
    fillString: "0"
  }): string {
    return parseInt(binary, 2).toString(16).toUpperCase().padStart(args.maxLength, args.fillString);
  }

  export function hexadecimalToBinary(hexadecimal: string, args = {
    maxLength:  32,
    fillString: "0"
  }): string {
    const decimal = hexadecimalToDecimal(hexadecimal);
    return (decimal).toString(2).padStart(args.maxLength, args.fillString);
  }

  export function transform_directive_DataToHexValue(data?: number[] | string[]): string {
    // const sToTransform: string[] = data?.toString().split(",");

    return "0x00000000";
  }

  export function readFileContents(path: string): string {
    return fs.readFileSync(path, "utf8");
  }

  export function getTagLabelFromLine(line: string) {
    return line.replace(":", "");
  }

  export function getLinesDirectivesAndTags(content: string) {
    let lines = content.split("\n");
    lines = lines.map((line) => line.trim());
    lines = lines.map((line) => {
      let auxLine = line;
      const match = auxLine.match(/;.*/);
      if (match) {
        auxLine = auxLine.slice(0, match.index);
      }
      return auxLine.trim().split("\t").join("    ").trim();
    });
    lines = lines.filter((line) => line !== "");
    lines = lines.filter((line) => Utils.checkIfLineContainDirectives(line));
    return lines;
  }

  export function getLinesInstructionsAndTags(content: string): string[] {
    let lines = content.split("\n");
    lines = lines.map((line) => line.trim());
    lines = lines.map((line) => {
      let auxLine = line;
      const match = auxLine.match(/;.*/);
      if (match) {
        auxLine = auxLine.slice(0, match.index);
      }
      return auxLine.trim().split("\t").join("    ");
    });
    lines = lines.filter((line) => line !== "");
    lines = lines.filter((line) => !Utils.checkIfLineContainDirectives(line));
    return lines;
  }


  export function typeLineDLX(line: string): "instruction" | "tag" {
    if ((/\w+:/).test(line)) {
      return "tag";
    }
    return "instruction";
  }

  export function getTypeDataFromDirective(lineDirectivesAndTag: string): TypeAddressDirectiveNameData {
    if (/\w+:/.test(lineDirectivesAndTag)) {
      // console.debug("- tag: ", lineDirectivesAndTag);
    }
    const match = lineDirectivesAndTag.match(REGEX_TYPE_DIRECTIVE_VECTOR);
    if (match === null) {
      throw new Error("Type data directive is not valid");
    }
    const typeDirective = match[0].slice(1).toUpperCase() as unknown as TypeDirective;
    const data = lineDirectivesAndTag.match(/([0-9]+\.?'?[0-9]{0,2})+/igm) as RegExpMatchArray;
    // const data = match.slice(1);
    return { directive: typeDirective, data: data };
  }

  // Directives
  export function checkIfLineContainDirectives(line: string): boolean {
    return (REGEX_TYPE_DIRECTIVE).test(line);
  }

  export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  export function convertMachineInstructionToHexCode_DLX(_instruction: string,
                                                         addressPC: string,
                                                         addressLabel: Map<TypeAddress, TypeAddressLabel>,
                                                         addressDirectiveLabelData: Map<TypeAddress, TypeAddressDirectiveLabelData>): string {
    const instruction = _instruction.toUpperCase();
    const textParser = instruction.match(/[\w#]+/gm);
    if (!textParser) {
      console.warn("_instruction", _instruction);
      console.warn("textParser", textParser);
      throw new Error("Can't parser");
    }
    try {
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
      // console.log("Type Instruction: ", instruction, isTypeR_OPCODE_0, isTypeR_OPCODE_1, isTypeIorJ);

      if (isTypeR_OPCODE_0 || isTypeR_OPCODE_1) {
        const opcode_6b = isTypeR_OPCODE_0 ? "000000" : "000001";
        const first = parseInt(textParser[2].slice(1), 10).toString(2).padStart(5, "0");
        const second = parseInt(textParser[3].slice(1), 10).toString(2).padStart(5, "0");
        const third = parseInt(textParser[1].slice(1), 10).toString(2).padStart(5, "0");
        const binaryNull = "".padStart(5, "0");
        const code = (isTypeR_OPCODE_0 ? OPCODES_TYPE_R_OPCODE_0 : OPCODES_TYPE_R_OPCODE_1)
          .filter((v) => {
            return v.name === nameInstruction;
          })[0];


        if (nameInstruction === "SRLI") {
          // console.debug(binary, `0x${resultHex}`, textParser, `${code.opcode} |  ${binaryNull}`);
          const binary_RX = parseInt(textParser[1].slice(1), 10).toString(2).padStart(5, "0");
          const binary_RY = parseInt(textParser[2].slice(1), 10).toString(2).padStart(5, "0");
          const binary_Z = parseInt(textParser[3].slice(1), 10).toString(2).padStart(5, "0");
          const binaryNull5 = "".padStart(5, "0");
          const binary = `${opcode_6b}${binary_RY}${binaryNull5}${binary_RX}${binary_Z}${code.operation}`;
          const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
          // console.debug(binary, `0x${resultHex}`, textParser, `${binaryNull5}${binary_RY}${binaryNull5}${binary_RX}${binary_Z}${code.operation}`);
          return resultHex;
        }

        const binary = `${opcode_6b}${first}${second}${third}${binaryNull}${code.operation}`;
        return parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
      }

      if (isTypeIorJ) {
        const code = OPCODES_TYPE_I_J.filter((v) => {
          return v.name === nameInstruction;
        })[0];
        const binaryAddressTagLabel = "".padStart(26, "0");
        // Type J
        if (Array.from(addressLabel.values()).some((v) => v.label === textParser[1])) {
          const { addressTagLabel } = [...addressLabel.values()].filter(v => v.label === textParser[1])[0];
          if (["J",
            "JAL"].includes(code.name)) {
            const p0 = parseInt(addressTagLabel, 16);
            const p1 = parseInt(addressPC, 16);
            const countAddressJump = ((p0 - p1) - 4);
            const binaryJump = Utils.twosComplement(countAddressJump, 26) as string;
            const binary = `${code.opcode}${binaryJump}`;
            const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
            // console.debug(binary, `0x${resultHex}`, textParser, `${code.opcode} |  ${binaryJump}`);
            return resultHex;
          }
          if (["BFPT",
            "BFPF"].includes(code.name)) {
            const binary = `${code.opcode}${binaryAddressTagLabel}`;
            const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
            // console.debug(binary, `0x${resultHex}`, textParser, `${code.opcode} |  ${binaryAddressTagLabel}`);
            return resultHex;
          }
          return "HexCodeError # {J, JAL}";
        }
        if (Array.from(addressLabel.values()).some((v) => v.label === textParser[2])) {
          // Ex: beqz r1,label
          if (["BEQZ",
            "BNEZ"].includes(code.name)) {
            const binaryRNum = parseInt(textParser[1].slice(1), 10).toString(2).padStart(5, "0");
            const binaryNull5 = "".padStart(5, "0");
            const o = Array.from(addressLabel.values()).filter((v) => {
              return v.label === textParser[2];
            })[0];
            const d_tagAddress = parseInt(o.addressTagLabel, 16);
            const complement = Utils.twosComplement(d_tagAddress, 16);
            const d_complement = parseInt(complement, 2);
            const d_addressPC = parseInt(addressPC, 16);
            const binary16bJump = ((d_complement - d_addressPC) - 4).toString(2).padStart(16, "0");
            const binary = `${code.opcode}${binaryRNum}${binaryNull5}${binary16bJump}`.padStart(32, "0");
            const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
            // console.debug(binary, `0x${resultHex}`, textParser, `${code.opcode} | ${binaryRNum} | ${binaryNull5} | ${binary16bJump}`);
            return resultHex;
          }
          return "HexCodeError # {BEQZ, BNEZ}";
        }
        if (["LB",
          "LH",
          "LW",
          "LBU",
          "LHU",
          "LF",
          "LD"].includes(nameInstruction)) {
          const { groups } = _instruction.match(REGEX_TYPE_LOAD_PARSER) as RegExpMatchArray;
          const _groups = groups as { [text: string]: string };
          // const typeLoad = _groups.TypeLoad;
          // const registerDest = _groups.RegisterDest;
          // const registerDestLabel = _groups.RegisterDestLabel;
          // const register0Type = _groups.Register0Type_ || _groups.Register0Type;
          // const register1Type = _groups.Register1Type || _groups.Register1Type_;
          const register0Index = _groups.Register0Index_ || _groups.Register0Index;
          const register1Index = _groups.Register1Index || _groups.Register1Index_;
          // const label0 = _groups.Label0;
          const label1 = _groups.Label1;

          // console.debug(_instruction, 100, typeLoad, registerDest, register0Type, register0Index, registerDestLabel, label0, register1Type, register1Index, label1);
          const binaryRS1_5b = parseInt(register1Index ?? "0", 10).toString(2).padStart(5, "0");
          const binaryRD_5b = parseInt(register0Index ?? "0", 10).toString(2).padStart(5, "0");
          const _directive = [...addressDirectiveLabelData.values()].filter((v) => v.label === label1);
          const binaryConst_16b = parseInt(_directive[0]?.address ?? "0", 16).toString(2).padStart(16, "0");
          const binary = `${code.opcode}${binaryRS1_5b}${binaryRD_5b}${binaryConst_16b}`;
          const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
          // console.debug(binary, resultHex);
          return resultHex;
        }
        if (["SW",
          "SF",
          "SD"].includes(nameInstruction)) {
          const { groups } = _instruction.match(REGEX_TYPE_LOAD_PARSER) as RegExpMatchArray;
          const _groups = groups as { [text: string]: string };
          const register0Index = _groups.Register0Index_ || _groups.Register0Index;
          const register1Index = _groups.Register1Index || _groups.Register1Index_;
          const label0 = _groups.Label0;
          // const label1 = _groups.Label1;

          // console.debug(_instruction, 100, typeLoad, registerDest, register0Type, register0Index, registerDestLabel, label0, register1Type, register1Index, label1);
          const binaryRS1_5b = parseInt(register0Index ?? "0", 10).toString(2).padStart(5, "0");
          const binaryRD_5b = parseInt(register1Index ?? "0", 10).toString(2).padStart(5, "0");
          const _directive = [...addressDirectiveLabelData.values()].filter((v) => v.label === label0);
          const binaryConst_16b = parseInt(_directive[0]?.address ?? "0", 16).toString(2).padStart(16, "0");
          const binary = `${code.opcode}${binaryRS1_5b}${binaryRD_5b}${binaryConst_16b}`;
          const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
          // console.debug(binary, `0x${resultHex}`, textParser, `${code.opcode} | ${binaryRNum} | ${binaryNull5} | ${binary16bJump}`);
          return resultHex;
        }
        if (nameInstruction === "RFE") {
          const binaryNull = "".padStart(26, "0");
          const binary = `${code.opcode}${binaryNull}`;
          const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
          // console.debug(binary, `0x${resultHex}`, textParser, `${code.opcode} |  ${binaryNull}`);
          return resultHex;
        }
        if (nameInstruction === "TRAP") {
          const binaryNull = "".padStart(26, "0");
          const binary = `${code.opcode}${binaryNull}`;
          const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
          // console.debug(binary, `0x${resultHex}`, textParser, `${code.opcode} |  ${binaryNull}`);
          return resultHex;
        }
        // TODO

        // Type I
        // const first = parseInt(textParser[1].slice(1), 10).toString(2).padStart(5, "0");
        // const second = parseInt(textParser[2].slice(1), 10).toString(2).padStart(5, "0");
        // const num = parseInt(textParser[3], 10).toString(2).padStart(16, "0");
        // console.log(textParser, tags.entries());

        const firstTerm = textParser[1].slice(1);
        const secondTerm = textParser[2].slice(1);

        let thirdTerm = "0";
        const isThirdTermRegister = (/[RF]/.test(textParser[3])) ? "Register" : false;
        if (isThirdTermRegister === "Register") {
          thirdTerm = textParser[3].slice(1) as string;
        }
        const isThirdTermValue = (/[#]/.test(textParser[3])) ? "Value" : false;
        if (isThirdTermValue === "Value") {
          thirdTerm = textParser[3].slice(1) as string;
        }
        const first = parseInt(secondTerm ?? "0", 10).toString(2).padStart(5, "0");
        const second = parseInt(firstTerm ?? "0", 10).toString(2).padStart(5, "0");
        const num = parseInt(thirdTerm ?? "0", 10).toString(2).padStart(16, "0");

        const binary = `${code.opcode}${first}${second}${num}`;
        const resultHex = parseInt(binary, 2).toString(16).padStart(8, "0").toUpperCase();
        // console.debug(binary, `0x${resultHex}`, textParser, `${code.opcode} |  ${first} | ${second} | ${num}`);
        return resultHex;
      }
    } catch (error) {
      console.error("Error: _instruction ", _instruction);
      console.error(error);
    }
    return "FFFFFFFF";
  }

  export function convertHexCodeToMachineInstruction_DLX(hexCode: string,
                                                         h_addressPC: string,
                                                         addressLabel: Map<TypeAddress, TypeAddressLabel>,
                                                         addressDirectiveLabelData: Map<TypeAddress, TypeAddressDirectiveLabelData>): string {
    try {
      const binary = parseInt(hexCode, 16).toString(2).padStart(32, "0");
      const opcode = binary.substr(0, 6);
      const func_field = binary.substr(21, 11);
      const func_field_6_last_bits = func_field.substr(-6);

      const rs1 = parseInt(binary.substr(6, 5), 2);
      const rs2 = parseInt(binary.substr(11, 5), 2);
      const rd0 = parseInt(binary.substr(16, 5), 2);

      const rs1F = parseInt(binary.substr(6, 5), 2);
      const rs2F = parseInt(binary.substr(11, 5), 2);

      const rd0F = parseInt(binary.substr(16, 5), 2);

      const rs1I = parseInt(binary.substr(6, 5), 2);
      const rd0I = parseInt(binary.substr(11, 5), 2);
      const d_data_16b = parseInt(binary.substr(16, 16), 2);
      const d_data_26b = parseInt(binary.substr(6, 26), 2);

      const rX = parseInt(binary.substr(16, 5), 2);
      const rY = parseInt(binary.substr(6, 5), 2);
      const rZ = parseInt(binary.substr(21, 5), 2);

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
          if (["SLLI",
            "SRLI",
            "SRAI",
            "SEQI",
            "SNEI",
            "SLTI",
            "SGTI",
            "SLEI",
            "SGEI"].includes(instruction_name)) {
            return `${instruction_name} R${rX}, R${rY}, ${"0x" + rZ.toString(16).toUpperCase()}`;
          }
          return `${instruction_name} R${rd0}, R${rs1}, R${rs2}`;
        }
        return "Instruction error OPCode #0";
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
        return "Instruction error OPCode #1";
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
            "XORI"].includes(instruction_name);
          if (isTypeIorJ) {
            return `${instruction_name} R${rd0I}, R${rs1I}, ${"0x" + d_data_16b.toString(16).toUpperCase()}`;
          }
          if (instruction_name === "LHI") {
            return `${instruction_name} R${rd0I}, ${"0x" + d_data_16b.toString(16).toUpperCase()}`;
          }

          // Type J
          if (["J",
            "JAL"].includes(instruction_name)) {
            const b_complement = Utils.twosComplement(-d_data_26b, 26);
            const d_complement = parseInt(b_complement, 2);
            const d_tagAddress = parseInt(h_addressPC, 16);
            const h_addressToJump = ((d_tagAddress - d_complement) + 4).toString(16).padStart(8, "0");
            const objectTag = addressLabel.get(`0x${h_addressToJump}`);
            const tagLabel = objectTag !== undefined ? objectTag.label : "_ERROR_";
            return `${instruction_name} ${tagLabel}`;
          }
          if (["BEQZ",
            "BNEZ"].includes(instruction_name)) {
            const d_index_AddressToJump = d_data_16b;
            const d_index_AddressPC = parseInt(`0x${h_addressPC}`, 16);
            const h_addressToJump = ((d_index_AddressPC + d_index_AddressToJump + 4)).toString(16).padStart(8, "0").toUpperCase();
            const objectTag = addressLabel.get(`0x${h_addressToJump}`);
            const tagLabel = objectTag !== undefined ? objectTag.label : "_ERROR_";
            return `${instruction_name} R${rs1I}, ${tagLabel}`;
          }
          if (["BFPT",
            "BFPF"].includes(instruction_name)) {
            return `${instruction_name} ${"0x" + d_data_16b}`;
          }
          if (instruction_name === "RFE") {
            return instruction_name;
          }
          if (instruction_name === "TRAP") {
            return `${instruction_name} ${"0x" + d_data_26b.toString(16).toUpperCase()}`;
          }

          // No se de que tipo son :3 supongamos que de tipo I
          if (["JR",
            "JALR"].includes(instruction_name)) {
            return `${instruction_name} R${rs1I}`;
          }

          if (["LB",
            "LH",
            "LW",
            "LBU",
            "LHU"].includes(instruction_name)) {
            const _addressLabel = `0x${d_data_16b.toString(16).padStart(8, "0").toUpperCase()}`;
            const _directive = [...addressDirectiveLabelData.values()].filter((v) => v.address === _addressLabel);
            const _label = _directive[0].label ?? "";
            return `${instruction_name} R${rd0I}, ${_label}(R${rs1I})`;
          }
          if (["LF",
            "LD"].includes(instruction_name)) {
            const _addressLabel = `0x${d_data_16b.toString(16).padStart(8, "0").toUpperCase()}`;
            const _directive = [...addressDirectiveLabelData.values()].filter((v) => v.address === _addressLabel);
            const _label = _directive[0].label ?? "";
            return `${instruction_name} F${rd0I}, ${_label}(R${rs1I})`;
          }

          if (["SW",
            "SB",
            "SH"].includes(instruction_name)) {
            const _addressLabel = `0x${d_data_16b.toString(16).padStart(8, "0").toUpperCase()}`;
            const _directive = [...addressDirectiveLabelData.values()].filter((v) => v.address === _addressLabel);
            return `${instruction_name} ${_directive[0]?.label ?? ""}(R${rs1I}), R${rd0I}`;
          }
          if (["SF",
            "SD"].includes(instruction_name)) {
            return `${instruction_name} #${d_data_16b}(R${rs1I}), F${rd0I}`;
          }
        }
        return "Instruction error #1";
      }
    } catch (e) {
      console.error("Error: _instruction", hexCode, h_addressPC, addressLabel, addressDirectiveLabelData);
      console.error(e);
    }
    return "Instruction error #-1";
  }

  export function padAndChop(str: string, padChar: string, length: number): string {
    return (Array(length).fill(padChar).join("") + str).slice(length * -1);
  }

  export function twosComplement(value: number, bitCount: number): string {
    let binaryStr;
    if (value >= 0) {
      const twosComp = value.toString(2);
      binaryStr = padAndChop(twosComp, "0", (bitCount || twosComp.length));
    } else {
      binaryStr = ((2 ** bitCount) + value).toString(2);
      if (Number(binaryStr) < 0) {
        throw new Error("Number(binaryStr) < 0");
      }
    }
    return `${binaryStr}`;
  }


  export function getInstructionFromLine(line: string): string {
    return line.toUpperCase();
  }

  export function isJSON(content: string): boolean {
    try {
      const object = JSON.parse(content);
      if (typeof object === "object") return true;
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  export function convertIEEE754_Number_To_Binary32Bits(float32: number): string {
    let str = "";
    const c = new Uint8Array(new Float32Array([float32]).buffer, 0, 4);
    for (const element of Array.from(c).reverse()) {
      str += element.toString(2).padStart(8, "0");
    }
    return str;
  }

  export function convertIEEE754_Number_To_Binary64Bits(double64: number): string {
    let str = "";
    const c = new Uint8Array(new Float64Array([double64]).buffer, 0, 8);
    for (const element of Array.from(c).reverse()) {
      str += element.toString(2).padStart(8, "0");
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

  export function getRegisterNumber(str: string | number): number {
    const num = str.toString();
    return parseInt(num.replace(/\D/g, ""), 10);
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
