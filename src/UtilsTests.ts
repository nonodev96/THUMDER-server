import { Socket } from "socket.io-client";
import { TypeSimulationStep } from "./Types";

export namespace UtilsTests {
  export function findByTagAndReplace(array: any[],
                                      keyToFind: string, valueToFind: string,
                                      keyToReplace: string, valueToReplace: string) {
    array.forEach((element, index) => {
      if (element[keyToFind] === valueToFind) {
        // eslint-disable-next-line no-param-reassign
        array[index][keyToReplace] = valueToReplace;
      }
    })
  }

  export async function SimulationNextStepRequest(client: Socket, data: any): Promise<TypeSimulationStep> {
    return new Promise((resolve, reject) => {
      client.emit("SimulationNextStepRequest", JSON.stringify(data), async (response: string) => {
        try {
          resolve(JSON.parse(response) as TypeSimulationStep);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
