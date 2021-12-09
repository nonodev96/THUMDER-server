import { Utils } from './Utils';
import { TypeCode } from './Types';

export default class InterpreterDLX {
  private content: string;

  private readonly code: TypeCode[];

  constructor() {
    this.content = 'content';
    this.code = [];
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public analyze(): TypeCode[] {
    const lines: string[] = Utils.clearFile(this.content);
    const defaultTEXT = '$TEXT';
    let TEXT = '';

    let address = '00000100';
    let addressNum = parseInt(address, 16);

    let addressTag = '0';
    let addressTagNum = parseInt(addressTag, 16);

    let instructionString = '';
    let codeHex = '';
    for (const line of lines) {
      const typeLine = Utils.typeLineDLX(line);
      switch (typeLine) {
        case 'tag': {
          TEXT = Utils.getTagFromLine(line);
          addressTagNum = 0;
          break;
        }
        case 'instruction': {
          instructionString = Utils.getInstructionFromLine(line);
          codeHex = Utils.convertMachineInstructionToHexCode_DLX(instructionString);

          addressTag = addressTagNum.toString(16);
          address = addressNum.toString(16).padStart(8, '0');

          this.code.push({
            address: `0x${address.toUpperCase()}`,
            instruction: instructionString.toUpperCase(),
            text: (`${TEXT}+0x${addressTag}` ?? defaultTEXT).toUpperCase(),
            code: `0x${codeHex.toUpperCase()}`,
          });
          addressTagNum += 4;
          addressNum += 4;
          break;
        }
        default: {
          break;
        }
      }
    }
    return this.code;
  }

  public getCode(): TypeCode[] {
    return this.code;
  }
}
