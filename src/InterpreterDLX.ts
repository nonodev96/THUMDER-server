import { Utils } from "./Utils";
import { TypeCode } from "./Types";

export default class InterpreterDLX {
  private content: string;

  private readonly code: TypeCode[];

  constructor() {
    this.content = "content";
    this.code = [];
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public analyze(): TypeCode[] {
    const lines: string[] = this.content.split("\n");
    let address = "00000100";
    let addressNum = parseInt(address, 16);
    for (const line of lines) {
      const instructionString = Utils.getInstructionFromLine(line);
      const codeHex = Utils.getCodeHexFromInstruction(instructionString);
      this.code.push({
        address: `0x${address}`,
        instruction: instructionString,
        text: "$TEXT",
        code: `0x${codeHex}`,
      });
      addressNum += 4;
      address = addressNum.toString(16).padStart(8, "0");
    }
    return this.code;
  }

  public getCode(): TypeCode[] {
    return this.code;
  }
}
