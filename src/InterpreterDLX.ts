import { Table } from "console-table-printer";
import { Utils } from "./Utils";
import {
  TypeAddress,
  TypeAddressDirectiveLabel,
  TypeCode,
  TypeDirective,
  TypeAddressLabel,
  TypeTagLabel, TypeAddressDirectiveLabelData, TypeAllMemoryAddressBinary
} from "./Types";
import { REGEX_GLOBAL_DIRECTIVE, REGEX_TAG_LABEL } from "./CONSTANTS";
import ManagerMemory from "./DLX/ManagerMemory";

export default class InterpreterDLX {
  private content: string;

  private readonly addressDirectiveLabelData: Map<TypeAddress, TypeAddressDirectiveLabelData & { text: string }>;
  private code: Map<TypeAddress, TypeCode>;
  private readonly addressLabel: Map<TypeAddress, TypeAddressLabel>;
  private directives: Map<TypeAddress, TypeAddressDirectiveLabel>;
  private memory: ManagerMemory;

  constructor() {
    this.content = "content";
    this.addressDirectiveLabelData = new Map<TypeAddress, TypeAddressDirectiveLabelData & { text: string }>();
    this.addressLabel = new Map<TypeAddress, TypeAddressLabel>();
    this.directives = new Map<TypeAddress, TypeAddressDirectiveLabel>();
    this.code = new Map<TypeAddress, TypeCode>();
    this.memory = new ManagerMemory(512);
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public analyze(): void {
    const linesDirectivesAndTags: string[] = Utils.getLinesDirectivesAndTags(this.content);
    this.interpreterDirectives(linesDirectivesAndTags);
    this.printDirectives();

    const linesInstructionsAndTags: string[] = Utils.getLinesInstructionsAndTags(this.content);
    this.interpreterInstructions(linesInstructionsAndTags);
    this.printInstructions();

    for (const [_address, _addressDirectiveLabelData] of this.addressDirectiveLabelData.entries()) {

    }

    for (const [_address, _code] of this.code.entries()) {
      this.memory.setMemoryWordBinaryByAddress(_address, parseInt(_code.code, 16).toString(2).padStart(32, '0'));
    }

    const allMemory = this.memory.getAllMemoryAddressBinary();
    const memoryTable = new Map<TypeAddress, TypeAllMemoryAddressBinary>();
    for (const memory of allMemory) {
      memoryTable.set(memory.address, memory);
    }
    const table_Memory = new Table({
      columns: [
        { name: "address", alignment: "left", color: "blue" },
        { name: "index", alignment: "left", color: "blue" },
        { name: "byte_0", alignment: "left", color: "green" },
        { name: "byte_1", alignment: "left", color: "green" },
        { name: "byte_2", alignment: "left", color: "green" },
        { name: "byte_3", alignment: "left", color: "green" },
        { name: "halfword_0", alignment: "left", color: "green" },
        { name: "halfword_1", alignment: "left", color: "green" },
        { name: "word", alignment: "left", color: "green" },
        { name: "binary32", alignment: "left", color: "magenta" },
      ],
    });
    table_Memory.addRows(memoryTable);
    table_Memory.printTable();
  }

  private interpreterDirectives(linesDirectivesAndTags: string[]) {
    let addressPC = "00000000";
    let addressPCNum = parseInt(addressPC, 16);
    let tagLabel = "";
    let tagLabelTest = false;
    let match: RegExpMatchArray | null;
    for (const lineDirectivesAndTag of linesDirectivesAndTags) {
      addressPC = addressPCNum.toString(16).padStart(8, "0").toUpperCase();
      const { directive, data } = Utils.getTypeDataFromDirective(lineDirectivesAndTag);
      tagLabelTest = REGEX_TAG_LABEL.test(lineDirectivesAndTag);
      if (tagLabelTest) {
        match = lineDirectivesAndTag.match(REGEX_TAG_LABEL);
        if (match) {
          [tagLabel] = match;
          tagLabel = tagLabel.slice(0, -1);
        }
      }

      // console.debug(".DIRECTIVE", lineDirectivesAndTag);
      /**
       (\w+:|[^\S\r\n]+)*(\.(WORD|FLOAT|GLOBAL|SPACE|DATA|TEXT))[^\S\r\n]*(\w+)*(([^\S\r\n]*|(\+|\*)*|\d*))+
       (\w+:|[^\S\r\n]+)*(\.(WORD|FLOAT|GLOBAL|SPACE|DATA|TEXT))[^\S\r\n]*\w+([^\S\r\n]*(\+|\*)*\d*)
       [^\S\r\n]+
       (?=\w*[a-z])(?=\w*[0-9])\w+
       */
      const objDirective: TypeAddressDirectiveLabelData & { text: string } = {
        address:   "",
        data:      data,
        directive: directive,
        label:     tagLabel,
        text:      lineDirectivesAndTag
      };

      let _addressPCNum = addressPCNum;
      // https://www.uv.es/varnau/Manual_Simulador_DLX.pdf
      switch (directive) {
        case "DATA": {
          // .data [address]
          _addressPCNum = 0x0;
          break;
        }
        case "TEXT": {
          // .text [address]
          _addressPCNum = 0x100;
          break;
        }
        case "SPACE": {
          _addressPCNum += parseInt(data[0], 10) as number;
          objDirective.address = _addressPCNum.toString(16).padStart(8, "0").toUpperCase();
          this.addressDirectiveLabelData.set(objDirective.address, objDirective);
          break;
        }
        case "GLOBAL": {
          const [_input, _p_directive, _label] = lineDirectivesAndTag.match(REGEX_GLOBAL_DIRECTIVE) as RegExpMatchArray;
          // console.log("GLOBAL", _input, _p_directive, _label);
          objDirective.data = [_label];
          _addressPCNum += 4;
          break;
        }
        case "BYTE": {
          _addressPCNum += data.length;
          break;
        }
        case "WORD": {
          for (const num of data) {
            const address = _addressPCNum.toString(16).padStart(8, "0").toUpperCase();
            const num_binary = parseInt(num, 10).toString(2).padStart(32, "0");
            this.memory.setMemoryWordBinaryByAddress(address, num_binary);
            _addressPCNum += 4;
          }
          break;
        }
        case "FLOAT": {
          for (const num of data) {
            objDirective.address = _addressPCNum.toString(16).padStart(8, "0").toUpperCase();
            const num_ieee754_32 = Utils.convertIEEE754_Number_To_Binary32Bits(parseFloat(num));
            this.memory.setMemoryFloatBinaryByAddress(objDirective.address, num_ieee754_32);
            _addressPCNum += 4;
          }
          break;
        }
        case "DOUBLE": {
          for (const num of data) {
            objDirective.address = _addressPCNum.toString(16).padStart(8, "0").toUpperCase();
            const num_ieee754_64 = Utils.convertIEEE754_Number_To_Binary64Bits(parseFloat(num));
            this.memory.setMemoryDoubleBinaryByAddress(objDirective.address, num_ieee754_64);
            _addressPCNum += 8;
          }
          break;
        }
        case "ALIGN": {
          break;
        }
        case "ASCII": {
          break;
        }
        case "ASCIIZ": {
          break;
        }
        default: {
          console.log("Error, type data not valid", lineDirectivesAndTag);
          break;
        }
      }

      objDirective.address = addressPCNum.toString(16).padStart(8, "0").toUpperCase();
      this.addressDirectiveLabelData.set(objDirective.address, objDirective);
      addressPCNum = _addressPCNum;
      tagLabel = "";
    }
  }

  private interpreterInstructions(linesInstructionsAndTags: string[]): void {
    const defaultTEXT = "$TEXT";
    let TAG_label = "";
    let addressPC = "00000100";
    let addressNum = parseInt(addressPC, 16);
    let addressTag = "0";
    let addressTagNum = parseInt(addressTag, 16);

    // For address tags
    for (const line of linesInstructionsAndTags) {
      const typeLine = Utils.typeLineDLX(line);
      addressPC = addressNum.toString(16).padStart(8, "0").toUpperCase();
      addressTag = addressTagNum.toString(16);

      switch (typeLine) {
        case "tag": {
          addressTagNum = 0;
          TAG_label = Utils.getTagLabelFromLine(line);
          this.addressLabel.set(`0x${addressPC}`, { addressTagLabel: `0x${addressPC}`, label: TAG_label });
          break;
        }
        case "instruction": {
          addressNum += 4;
          addressTagNum += 4;
          break;
        }
        default: {
          break;
        }
      }
    }
    // console.table(this.tags.entries());
    addressPC = "00000100";
    addressNum = parseInt(addressPC, 16);
    addressTag = "0";
    addressTagNum = parseInt(addressTag, 16);

    let instructionLineString = "";
    let instructionString = "";
    let codeHex = "";
    // For code instructions
    for (const line of linesInstructionsAndTags) {
      const typeLine = Utils.typeLineDLX(line);
      addressPC = addressNum.toString(16).padStart(8, "0").toUpperCase();
      addressTag = addressTagNum.toString(16).toUpperCase();

      switch (typeLine) {
        case "tag": {
          addressTagNum = 0;
          TAG_label = Utils.getTagLabelFromLine(line);
          this.addressLabel.set(`0x${addressPC}`, { addressTagLabel: `0x${addressPC}`, label: TAG_label });
          break;
        }
        case "instruction": {
          instructionLineString = Utils.getInstructionFromLine(line);
          codeHex = Utils.convertMachineInstructionToHexCode_DLX(instructionLineString, this.addressLabel, addressPC);
          instructionString = Utils.convertHexCodeToMachineInstruction_DLX(codeHex, this.addressLabel, addressPC);
          let text = "";
          text = addressTagNum === 0 ? `${TAG_label}` : `${TAG_label}+0x${addressTag}`;
          text = addressPC === "00000100" ? `${defaultTEXT}` : text;
          const instruction = {
            address:     `0x${addressPC}`,
            instruction: instructionString,
            text:        text,
            code:        `0x${codeHex}`,
          };
          this.code.set(`0x${addressPC}`, instruction);
          addressTagNum += 4;
          addressNum += 4;
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  public getCode(): TypeCode[] {
    return Array.from(this.code.values());
  }

  public getTags(): TypeAddressLabel[] {
    return Array.from(this.addressLabel.values());
  }

  private printDirectives() {
    const mergeDirectives = new Map<TypeAddress, any>();
    const directives = this.addressDirectiveLabelData.entries();
    const DIRECTIVES = [...directives].sort(([address_a], [address_b]) => {
      const num_a = parseInt(address_a, 16);
      const num_b = parseInt(address_b, 16);
      return num_a - num_b;
    });
    for (const [_address, _directive_value] of DIRECTIVES) {
      if (this.addressDirectiveLabelData.has(_address)) {
        const { label } = this.addressDirectiveLabelData.get(_address) as TypeAddressDirectiveLabelData;
        mergeDirectives.set(_address, _directive_value);
      } else {
        mergeDirectives.set(_address, {} as TypeAddressDirectiveLabelData);
      }
    }
    const table_directives = new Table({
      columns: [
        { name: "address", alignment: "left", color: "blue" },
        { name: "label", alignment: "left", color: "magenta" },
        { name: "directive", alignment: "left", color: "green" },
        { name: "data", alignment: "left", color: "yellow" },
        { name: "text", alignment: "left", color: "magenta" },
      ],
    });
    table_directives.addRows(mergeDirectives);
    table_directives.printTable();
  }

  private printInstructions() {
    const merge = new Map<TypeAddress, any>();
    const code = this.code.entries();
    const CODE = [...code].sort(([address_a], [address_b]) => {
      const num_a = parseInt(address_a, 16);
      const num_b = parseInt(address_b, 16);
      return num_a - num_b;
    });
    for (const [_address, _code_value] of CODE) {
      if (this.addressLabel.has(_address)) {
        const _tag_label = this.addressLabel.get(_address) as TypeAddressLabel;
        merge.set(_address, { ..._code_value, label: _tag_label.label });
      } else {
        merge.set(_address, _code_value);
      }
    }
    const table_tags = new Table({
      columns: [
        { name: "address", alignment: "left", color: "blue" },
        { name: "text", alignment: "right", color: "magenta" },
        { name: "code", alignment: "left", color: "green" },
        { name: "instruction", alignment: "left", color: "yellow" },
        { name: "label", alignment: "right", color: "magenta" },
      ],
    });
    table_tags.addRows(merge);
    table_tags.printTable();
  }
}
