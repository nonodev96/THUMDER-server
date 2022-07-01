import { Server } from "socket.io";
import { io } from "socket.io-client";

import {
  TypeMemoryToUpdateResponse,
  TypeMemoryToUpdate,
  TypeSimulationInitRequest
} from "../dist/Types";
import { Utils } from "../dist/Utils";
import { startWebSocketServer } from "../dist/main";

describe("Memory", () => {
  let server: Server;

  beforeAll(async () => {
    server = await startWebSocketServer(3002)
  });

  afterAll(() => {
    server.close();
  });

  test('Update memory', (done) => {
    const client = io("ws://localhost:3002");
    try {
      const simulationInitRequest: TypeSimulationInitRequest = {
        id:          "",
        filename:    "prim.s",
        date:        new Date("2021-08-28T10:25:00.000Z").toISOString(),
        content:     Utils.readFileContents("assets/examples-dlx/prim.s"),
        registers:   [],
        breakpoints: [],
        memory:      []
      };
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), async (simulationInitResponse: string) => {
        // const simulationInitResponseType = JSON.parse(simulationInitResponse) as TypeSimulationInitResponse;
        const updateMemoryRequest: TypeMemoryToUpdate[] = [
          {
            typeData: "Byte",
            address:  "0x0000000F",
            value:    "0x000000FF"
          },
          {
            typeData: "HalfWord",
            address:  "0x0000000F",
            value:    "0x000000FF"
          },
          {
            typeData: "Word",
            address:  "0x000000FF",
            value:    "0x000000FF"
          },
        ];
        client.emit("UpdateMemoryRequest", JSON.stringify(updateMemoryRequest), async (updateMemoryResponse: string) => {
          const memoryToUpdateResponseType = JSON.parse(updateMemoryResponse) as TypeMemoryToUpdateResponse;
          console.log("UpdateMemoryResponse", memoryToUpdateResponseType);

          if (memoryToUpdateResponseType.allOK === true) {
            done();
          } else {
            done("Update memory error.");
          }
          client.close()
        });
      });

    } catch (e) {
      done(e);
    } finally {
      // client.close();
    }
  });

  test("Get all memory", (done) => {
    const client = io("ws://localhost:3002");
    try {
      const simulationInitRequest: TypeSimulationInitRequest = {
        id:          "",
        filename:    "prim.s",
        date:        new Date("2021-08-28T10:25:00.000Z").toISOString(),
        content:     Utils.readFileContents("assets/examples-dlx/prim.s"),
        breakpoints: [],
        registers:   [],
        memory:      []
      };

      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), (SimulationInitResponse: string) => {
        // const simulationInitResponseType = JSON.parse(SimulationInitResponse) as TypeSimulationInitResponse;
        client.emit("GetAllMemoryRequest", JSON.stringify({}), (response2: string) => {
          const getAllMemoryResponse = JSON.parse(response2);
          expect({ "index": 3, "value": 10 }).toStrictEqual(getAllMemoryResponse[0]);
          done();
          client.close();

        });
        //  END
      });
    } catch (error) {
      done(error);
    } finally {
      // client.close();
    }
  });
});
