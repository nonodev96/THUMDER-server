import { Server } from "socket.io";
import { io } from "socket.io-client";

import {
  TypeSimulationInitRequest,
  TypeRegisterToUpdate,
  TypeRegisterToUpdateResponse, TypeAllRegisters
} from "../src/Types";
import { Utils } from "../src/Utils";
import { startWebSocketServer } from "../src/main";

describe("Registers", () => {
  let server: Server;

  beforeAll(async () => {
    server = await startWebSocketServer(3003);
  });

  afterAll(() => {
    server.close();
  });

  test('Update registers', (done) => {
    const client = io("ws://localhost:3003");
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
        const updateRegisterRequest: TypeRegisterToUpdate[] = [{
          typeRegister:     "Control",
          register:         "R1",
          hexadecimalValue: "0xFF"
        }];
        client.emit("UpdateRegisterRequest", JSON.stringify(updateRegisterRequest), async (updateRegisterResponse: string) => {
          const registerToUpdateResponseType = JSON.parse(updateRegisterResponse) as TypeRegisterToUpdateResponse;
          console.log("UpdateRegisterResponse", registerToUpdateResponseType);
          if (registerToUpdateResponseType.allOK === true) {
            done();
          } else {
            done("Update register error.");
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

  test("Get all registers", (done) => {
    const client = io("ws://localhost:3003");
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
        client.emit("GetAllRegistersRequest", JSON.stringify({}), (getAllRegistersResponse: string) => {
          const getAllRegistersResponseType = JSON.parse(getAllRegistersResponse) as TypeAllRegisters;
          expect({ "register": 0, "value": "00000000" }).toStrictEqual(getAllRegistersResponseType.Integer[0]);

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
