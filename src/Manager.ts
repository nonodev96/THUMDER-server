import Machine from "./Machine";
import { Utils } from "./Utils";

export default class Manager {
  private machines: Map<string, Machine>;

  constructor() {
    this.machines = new Map<string, Machine>();
  }

  public static checkArgs(args: string) {
    if (!Utils.isJSON(args)) {
      throw new Error("Not is a JSON");
    }
  }

  public getMachine(id: string): Machine {
    const machine = this.machines.get(id);
    if (machine === undefined) {
      throw new Error("Machine undefined");
    }
    return machine;
  }

  public setMachine(id: string): Machine {
    this.machines.set(id, new Machine());
    const machine = this.machines.get(id);
    if (machine === undefined) {
      throw new Error("Machine undefined");
    }
    return machine;
  }

  public deleteMachine(id: string): boolean {
    return this.machines.delete(id);
  }
}
