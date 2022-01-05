import { TypeRegisterControl, TypeSimulationStep } from "./Types";

export const RegexRegisterInteger =
  /\b(R0|R1|R2|R3|R4|R5|R6|R7|R8|R9|R10|R11|R12|R13|R14|R15|R16|R17|R18|R19|R20|R21|R22|R23|R24|R25|R26|R27|R28|R29|R30|R31)\b/i;
export const RegexRegisterFloat =
  /\b(F0|F1|F2|F3|F4|F5|F6|F7|F8|F9|F10|F11|F12|F13|F14|F15|F16|F17|F18|F19|F20|F21|F22|F23|F24|F25|F26|F27|F28|F29|F30|F31)\b/i;
export const RegexRegisterDouble =
  /\b(D0|D2|D4|D6|D8|D10|D12|D14|D16|D18|D20|D22|D24|D26|D28|D30)\b/i;
export const RegexRegisterControl =
  /(pc|imar|ir|a|ahi|b|bhi|bta|alu|aluhi|fpsr|dmar|sdr|sdrhi|ldr|ldrhi|PC|IMAR|IR|A|AHI|B|BHI|BTA|ALU|ALUHI|FPSR|DMAR|SDR|SDRHI|LDR|LDRHI)/;

export const REGISTERS_OF_CONTROL: TypeRegisterControl[] = [
  "PC",
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
  "LDRHI",
];
export const REGEX_TYPE_DIRECTIVE = (/(.(GLOBAL|TEXT|SPACE|DATA|ALIGN|ASCII|ASCIIZ|BYTE|FLOAT|DOUBLE|WORD))/i);
export const REGEX_TYPE_DIRECTIVE_VECTOR = (/(.(GLOBAL|TEXT|SPACE|DATA|ALIGN|ASCII|ASCIIZ|BYTE|FLOAT|DOUBLE|WORD)|\d+)/igm);
export const REGEX_TYPE_LOAD_PARSER = /(?<TypeLoad>LB|LH|LW|LBU|LHU|LF|LD|SW|SF|SD)\s+((?<RegisterDest>(?<Register0Type_>(R|F|D))(?<Register0Index_>\d+))|(?<RegisterDestLabel>(?<Label0>\w+)?\(?(?<Register0Type>(R|F|D))?(?<Register0Index>(\d+))?\)?))\s*,?\s*((?<Register1Type>R|F|D)(?<Register1Index>\d+)|(?<Label1>\w+)?\(?(?<Register1Type_>R|F|D)?(?<Register1Index_>\d+)?\)?)/i;
export const REGEX_TAG_LABEL = /\w+:/im;
export const REGEX_GLOBAL_DIRECTIVE = /(.GLOBAL\s*)(\w+)/im;

export const DEFAULT_SIMULATION_STEP_VOID: TypeSimulationStep = {
  isNewInstruction: false,
  step:             0,
  line:             0,
  pipeline:         {
    IF:        {
      address:    "",
      addressRow: 0,
      draw:       false,
    },
    ID:        {
      address:    "",
      addressRow: 0,
      draw:       false,
    },
    intEX:     {
      address:    "",
      addressRow: 0,
      draw:       false,
    },
    MEM:       {
      address:    "",
      addressRow: 0,
      draw:       false,
    },
    WB:        {
      address:    "",
      addressRow: 0,
      draw:       false,
    },
    "arrows":  [],
    "faddEX":  [],
    "fdivEX":  [],
    "fmultEX": [],
  },
  memory:           [],
  registers:        [],
  statistics:       {},

};
