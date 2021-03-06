import { Float32, Int32 } from "./TypeData";
import { TypeRegisterControl, TypeRegisterToUpdate } from "../Types";
import { Utils } from "../Utils";

export default class ManagerRegisters {
  PC: Int32;
  IMAR: Int32;
  IR: Int32;
  A: Int32;
  AHI: Int32;
  B: Int32;
  BHI: Int32;
  BTA: Int32;
  ALU: Int32;
  ALUHI: Int32;
  FPSR: Int32;
  DMAR: Int32;
  SDR: Int32;
  SDRHI: Int32;
  LDR: Int32;
  LDRHI: Int32;

  R: Int32[];
  F: Float32[];

  // $TEXT+0x00 - $TEXT+0xfc
  // 0x00000200 - 0x00007ffc
  // code = Array<Int32>(32764)
  // memory = Array<Int32>(32736)
  constructor() {
    this.PC = new Int32();
    this.IMAR = new Int32();
    this.IR = new Int32();
    this.A = new Int32();
    this.AHI = new Int32();
    this.B = new Int32();
    this.BHI = new Int32();
    this.BTA = new Int32();
    this.ALU = new Int32();
    this.ALUHI = new Int32();
    this.FPSR = new Int32();
    this.DMAR = new Int32();
    this.SDR = new Int32();
    this.SDRHI = new Int32();
    this.LDR = new Int32();
    this.LDRHI = new Int32();

    this.R = Array<Int32>(32);
    this.F = Array<Float32>(32);
    for (let i = 0; i < 32; i++) {
      this.R[i] = new Int32();
      this.F[i] = new Float32();
    }
  }

  setControl(key: TypeRegisterControl, binary: string) {
    this[key] = new Int32();
    this[key].binary = binary;
  }

  getRegister(registerControl: TypeRegisterControl): Int32 {
    return this[registerControl];
  }

  reset() {
    const registerControl = ["PC",
      "IMAR",
      "IR",
      "A",
      "AHI",
      "B",
      "BHI",
      "BTA",
      "ALU",
      "ALUHI",
      "FPSR",
      "DMAR",
      "SDR",
      "SDRHI",
      "LDR",
      "LDRHI"];
    for (const register of registerControl) {
      const r = register as TypeRegisterControl;
      this[r] = new Int32();
    }
    for (let i = 0; i < 32; i++) {
      this.R[i] = new Int32();
      this.F[i] = new Float32();
    }
  }

  processResponse(registers: TypeRegisterToUpdate[]): void {
    for (const registerToUpdate of registers) {
      const { typeRegister, register, hexadecimalValue } = registerToUpdate;

      switch (typeRegister) {
        case "Control": {
          const binary = Utils.hexadecimalToBinary(hexadecimalValue);
          this[register as TypeRegisterControl] = new Int32();
          this[register as TypeRegisterControl].binary = binary;
          break;
        }
        case "Integer": {
          const binary = Utils.hexadecimalToBinary(hexadecimalValue);
          const index = Utils.getRegisterNumber(register);
          this.R[index] = new Int32();
          this.R[index].binary = binary;
          break;
        }
        case "Float": {
          const binary = Utils.hexadecimalToBinary(hexadecimalValue);
          const index = Utils.getRegisterNumber(register);
          this.F[index] = new Float32();
          this.F[index].binary = binary;
          break;
        }
        case "Double": {
          const binary = Utils.hexadecimalToBinary(hexadecimalValue);
          const index = Utils.getRegisterNumber(register);
          this.F[index] = new Float32();
          this.F[index + 1] = new Float32();
          this.F[index].binary = binary.substr(0, 32);
          this.F[index + 1].binary = binary.substr(32, 32);
          break;
        }
        default: {
          console.warn("Can't process register %s, %s, %s", typeRegister, register, hexadecimalValue);
          break;
        }
      }
    }
  }
}
