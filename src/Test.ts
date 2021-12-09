import { Utils } from "./Utils";

const instruction = Utils.convertHexCodeToMachineInstruction_DLX('0x00232028');
console.log(instruction);

const hexCodeDLX = Utils.convertMachineInstructionToHexCode_DLX("SEQ R4, R1, R3");
console.log("0x00232028", hexCodeDLX);

const hexCodeDLX2 = Utils.convertMachineInstructionToHexCode_DLX("ADDI R1, R1, #4");
console.log("0x20210004", hexCodeDLX2);
