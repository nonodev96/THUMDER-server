import * as fs from 'fs';
import path from 'path';
import InterpreterDLX from './InterpreterDLX';
import {
  TypeAllMemory,
  TypeAllRegisters,
  TypeCode,
  TypeFloatingPointConfiguration,
  TypeMemoryToUpdate,
  TypeRegister,
  TypeRegisterControl,
  TypeRegisterToUpdate,
  TypeSimulationInitRequest,
  TypeSimulationInitResponse,
  TypeSimulationStep,
} from './Types';
import ManagerMemory from './DLX/ManagerMemory';
import ManagerRegisters from './DLX/ManagerRegisters';
import { Utils } from './Utils';
import { Float32, Int32 } from './DLX/TypeData';
import { RegexRegisterControl, RegexRegisterDouble, RegexRegisterFloat, RegexRegisterInteger, REGISTERS_OF_CONTROL } from './CONSTANTS';

export default class Machine {
  private content: string;

  private configuration: TypeFloatingPointConfiguration;

  private memory: ManagerMemory;

  private registers: ManagerRegisters;

  public code: Map<string, TypeCode>;

  private privateStep: number;

  private privateLine: number;

  constructor() {
    this.content = '';
    this.code = new Map();
    this.privateStep = 0;
    this.privateLine = 0;
    this.configuration = {
      addition: {
        count: 1,
        delay: 1,
      },
      multiplication: {
        count: 1,
        delay: 1,
      },
      division: {
        count: 1,
        delay: 1,
      },
    };
    this.registers = new ManagerRegisters();
    this.memory = new ManagerMemory(100);
  }

  public setContent(content: string) {
    this.content = content;
  }

  public getMachineCode() {
    const interpreter = new InterpreterDLX();
    interpreter.setContent(this.content);
    interpreter.analyze();
    return interpreter.getCode();
  }

  public SimulationInit(simulationInitRequest: TypeSimulationInitRequest): TypeSimulationInitResponse {
    const { content, filename, id } = simulationInitRequest;
    this.setContent(content);
    const machineCode = this.getMachineCode();

    for (const ins of machineCode) {
      const { address, code } = ins;
      const binary32 = Utils.hexadecimalToBinary(code);
      this.memory.setMemoryWordBinaryByAddress(address, binary32);
      this.code.set(address, ins);
    }

    return {
      filename: filename,
      id: id,
      date: new Date().toLocaleDateString(),
      steps: 8,
      lines: 68,
      code: machineCode,
      runner: [],
    } as TypeSimulationInitResponse;
  }

  public simulationNextStep(): TypeSimulationStep {
    const response = fs.readFileSync(path.resolve(__dirname, '../assets/examples-dlx/prime.s/run_' + this.privateStep + '.json'), 'utf-8');
    const status = JSON.parse(response) as TypeSimulationStep;
    status.codeInstruction = '0x00000000';
    if (status.instruction !== '') {
      status.codeInstruction = Utils.convertMachineInstructionToHexCode_DLX(status.instruction);
    }

    this.privateStep++;
    return status;
  }

  public updateConfigurationMachine(configuration: TypeFloatingPointConfiguration): boolean {
    this.configuration = configuration;
    return true;
  }

  public updateMemory(memoryToUpdates: TypeMemoryToUpdate[]): boolean {
    for (const memory_value of memoryToUpdates) {
      const { typeData, address, value } = memory_value;
      switch (typeData) {
        case 'Byte': {
          const binary = Utils.hexadecimalToBinary(value, {
            maxLength: 8,
            fillString: '0',
          });
          this.memory.setMemoryByteBinaryByAddress(address, binary);
          break;
        }
        case 'HalfWord': {
          const binary = Utils.hexadecimalToBinary(value, {
            maxLength: 16,
            fillString: '0',
          });
          this.memory.setMemoryHalfWordBinaryByAddress(address, binary);
          break;
        }
        case 'Word': {
          const binary = Utils.hexadecimalToBinary(value, {
            maxLength: 32,
            fillString: '0',
          });
          this.memory.setMemoryWordBinaryByAddress(address, binary);
          break;
        }
        case 'Float': {
          const binary = Utils.hexadecimalToBinary(value, {
            maxLength: 32,
            fillString: '0',
          });
          this.memory.setMemoryFloatBinaryByAddress(address, binary);
          break;
        }
        case 'Double': {
          const binary = Utils.hexadecimalToBinary(value, {
            maxLength: 64,
            fillString: '0',
          });
          this.memory.setMemoryDoubleBinaryByAddress(address, binary);
          break;
        }
        default: {
          console.log('Default memory', typeData, address, value);
          break;
        }
      }
    }
    return true;
  }

  public updateRegisters(registerToUpdates: TypeRegisterToUpdate[]): TypeRegisterToUpdate[] {
    for (const register_value of registerToUpdates) {
      const { register, typeRegister, hexadecimalValue } = register_value;
      switch (typeRegister) {
        case 'Control': {
          const binary = Utils.hexadecimalToBinary(register_value.hexadecimalValue);
          this.registers.setControl(register as TypeRegisterControl, binary);
          return [
            {
              typeRegister: 'Control',
              register: register,
              hexadecimalValue: hexadecimalValue,
            },
          ];
        }
        case 'Integer': {
          const r: number = Machine.getRegisterNumber(register);
          this.registers.R[r] = new Int32();
          this.registers.R[r].binary = Utils.hexadecimalToBinary(hexadecimalValue);
          return [
            {
              typeRegister: 'Integer',
              register: register,
              hexadecimalValue: Utils.binaryToHexadecimal(this.registers.R[r].binary),
            },
          ];
        }
        case 'Float': {
          const f: number = Machine.getRegisterNumber(register);
          this.registers.F[f] = new Float32();
          this.registers.F[f].binary = Utils.hexadecimalToBinary(hexadecimalValue);
          return [
            {
              typeRegister: 'Float',
              register: register,
              hexadecimalValue: Utils.binaryToHexadecimal(this.registers.F[f].binary),
            },
          ];
        }
        case 'Double': {
          const d: number = Machine.getRegisterNumber(register);
          const binary = Utils.hexadecimalToBinary(hexadecimalValue, {
            maxLength: 64,
            fillString: '0',
          });
          this.registers.F[d] = new Float32();
          this.registers.F[d].binary = binary.substr(0, 32);
          this.registers.F[d + 1].binary = binary.substr(32, 32);
          return [
            {
              typeRegister: 'Double',
              register: 'F' + d,
              hexadecimalValue: Utils.binaryToHexadecimal(this.registers.F[d].binary),
            },
            {
              typeRegister: 'Double',
              register: 'F' + (d + 1),
              hexadecimalValue: Utils.binaryToHexadecimal(this.registers.F[d + 1].binary),
            },
          ];
        }
        default: {
          console.log('Default register', typeRegister, register, hexadecimalValue);
          break;
        }
      }
    }
    throw new Error("Can't update a register");
  }

  public getAllRegisters(): TypeAllRegisters {
    const controlArray: { register: TypeRegisterControl; value: string }[] = [];
    for (const registerOfControl of REGISTERS_OF_CONTROL) {
      const value = this.registers.getRegister(registerOfControl);
      controlArray.push({
        register: registerOfControl,
        value: Utils.binaryToHexadecimal(value.binary),
      });
    }
    const integerArray = this.registers.R.map((v, index) => {
      return {
        register: index,
        value: Utils.binaryToHexadecimal(v.binary),
      };
    });
    const floatArray = this.registers.F.map((v, index) => {
      return {
        register: index,
        value: Utils.binaryToHexadecimal(v.binary),
      };
    });
    return {
      Control: controlArray,
      Integer: integerArray,
      Float: floatArray,
    };
  }

  public getAllMemory(): TypeAllMemory {
    return this.memory.getAllMemory();
  }

  private static getRegisterNumber(str: string): number {
    return parseInt(str.replace(/\D/g, ''), 10);
  }

  private static getTypeRegister(register: string): TypeRegister {
    if (RegexRegisterControl.test(register)) {
      return 'Control';
    }
    if (RegexRegisterInteger.test(register)) {
      return 'Integer';
    }
    if (RegexRegisterFloat.test(register)) {
      return 'Float';
    }
    if (RegexRegisterDouble.test(register)) {
      return 'Double';
    }
    return 'Control';
  }
}
