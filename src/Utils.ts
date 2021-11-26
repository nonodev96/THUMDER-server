export namespace Utils {
  export function dev(): void {
    console.log("dev");
  }

  export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  export function getCodeHexFromInstruction(instructionString: string): string {
    return getRandomInt(0, 10000).toString(16).padStart(8, "0").toUpperCase();
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
}
