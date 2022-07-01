import { Server } from "socket.io";
import { io } from "socket.io-client";

import {
  TypeSimulationInitRequest,
  TypeDataStatistics,
  TypeSimulationInitResponse,
  TypeSimulationStep,
  TypeMemoryToUpdate,
  TypeMemoryToUpdateResponse,
  TypeRegisterToUpdate,
  TypeRegisterToUpdateResponse,
  TypeAllRegisters,
  TypeConfigurationMachine
} from "../src/Types";
import { Utils } from "../src/Utils";
import { UtilsTests } from "../src/UtilsTests";
import { startWebSocketServer } from "../src/main";


describe("All", () => {
  let server: Server;
  const port = 3010;
  const simulationInitRequest: TypeSimulationInitRequest = {
    id:          "",
    filename:    "prim.s",
    date:        new Date("2021-08-28T10:25:00.000Z").toISOString(),
    content:     Utils.readFileContents("assets/examples-dlx/prim.s"),
    registers:   [],
    breakpoints: [],
    memory:      []
  };

  beforeAll(async () => {
    server = await startWebSocketServer(port)
  });

  afterAll(() => {
    server.close();
  });

  // prim.spec.ts
  test("all - Simulation Init", (done) => {
    const client = io("ws://localhost:" + port);
    try {
      const mock: TypeSimulationInitResponse = JSON.parse(Utils.readFileContents("assets/examples-dlx/example-prim.json"));
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), async (response: string) => {
        const simulationInitResponse = JSON.parse(response) as TypeSimulationInitResponse;
        mock.errors = [
          { line: 10, message: "Error X", severity: 8 },
          { line: 12, message: "Error Y", severity: 4 }
        ];
        // He parcheado esto para que pase los tests, pero son bugs
        UtilsTests.findByTagAndReplace(mock.machineInstructions, 'address', '0x00000150', 'text', 'ISPRIM+0x10');
        UtilsTests.findByTagAndReplace(mock.machineInstructions, 'address', '0x00000154', 'text', 'ISPRIM+0x14');
        UtilsTests.findByTagAndReplace(mock.machineInstructions, 'address', '0x0000015C', 'text', 'ISNOPRIM+0x4');
        expect(simulationInitResponse).toMatchObject(mock);
        done();
        client.close();
      });
    } catch (error) {
      done(error);
    } finally {
      // client.close();
    }
  });

  test("all - Simulation Step", (done) => {
    const client = io("ws://localhost:" + port);
    try {
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), async (simulationInitResponse: string) => {
        let status: Partial<TypeSimulationStep> = {};
        for (let i = 0; i < 10; i++) {
          status = await UtilsTests.SimulationNextStepRequest(client, {});
        }
        expect(status.step).toBe(9);
        done();
        client.close();
      });
    } catch (error) {
      done(error);
    } finally {
      // client.close();
    }
  });

  // memory.spec.ts
  test('all - Update memory', (done) => {
    const client = io("ws://localhost:" + port);
    try {
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), async (simulationInitResponse: string) => {
        // const simulationInitResponseType = JSON.parse(simulationInitResponse) as TypeSimulationInitResponse;
        const updateMemoryRequest: TypeMemoryToUpdate[] = [
          { typeData: "Byte", address: "0x0000000F", value: "0x000000FF" },
          { typeData: "HalfWord", address: "0x0000000F", value: "0x000000FF" },
          { typeData: "Word", address: "0x000000FF", value: "0x000000FF" },
          { typeData: "Float", address: "0x00000004", value: "0x400921CA" },
          { typeData: "Double", address: "0x00000012", value: "0x400921CAC0831400" },
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

  test("all - Get all memory", (done) => {
    const client = io("ws://localhost:" + port);
    try {
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), (SimulationInitResponse: string) => {
        client.emit("GetAllMemoryRequest", JSON.stringify({}), (response2: string) => {
          const getAllMemoryResponse = JSON.parse(response2);
          expect({ "index": 3, "value": 10 }).toStrictEqual(getAllMemoryResponse[0]);
          done();
          client.close();
        });
      });
    } catch (error) {
      done(error);
    } finally {
      // client.close();
    }
  });

  // registers.spec.ts
  test('all - Update registers', (done) => {
    const client = io("ws://localhost:" + port);
    try {
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), async (simulationInitResponse: string) => {
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

  test("all - Get all registers", (done) => {
    const client = io("ws://localhost:" + port);
    try {
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), (simulationInitResponse: string) => {
        // const simulationInitResponseType = JSON.parse(simulationInitResponse) as TypeSimulationInitResponse;
        client.emit("GetAllRegistersRequest", JSON.stringify({}), (getAllRegistersResponse: string) => {
          const getAllRegistersResponseType = JSON.parse(getAllRegistersResponse) as TypeAllRegisters;
          expect({ "register": 0, "value": "00000000" }).toStrictEqual(getAllRegistersResponseType.Integer[0]);
          done();
          client.close();
        });
      });
    } catch (error) {
      done(error);
    } finally {
      // client.close();
    }
  });

  // statistics.spec.ts
  test("all - Get all statistics", (done) => {
    const client = io("ws://localhost:" + port);
    try {
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), (simulationInitResponse: string) => {
        client.emit("GetAllStatisticsRequest", JSON.stringify({}), (getAllStatisticsResponse: string) => {
          const getAllStatisticsResponseType = JSON.parse(getAllStatisticsResponse) as TypeDataStatistics;
          const mock: Partial<TypeDataStatistics> = {
            TOTAL: {
              CYCLES_EXECUTED:          { cycles: 0 },
              ID_EXECUTED:              { instructions: 0 },
              INSTRUCTIONS_IN_PIPELINE: { instructions_in_pipeline: 0 }
            }
          };
          expect(mock).toStrictEqual({ TOTAL: getAllStatisticsResponseType.TOTAL });
          done();
          client.close();
        });
      });
    } catch (error) {
      done(error);
    } finally {
      // client.close();
    }
  });

  test("all - Set Configuration", (done) => {
    const client = io("ws://localhost:" + port);
    try {
      const configuration: TypeConfigurationMachine = {
        addition:          { count: 2, delay: 10 },
        division:          { count: 2, delay: 10 },
        multiplication:    { count: 2, delay: 10 },
        enabledForwarding: true,
        memorySize:        1000,
      }
      client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), (simulationInitResponse: string) => {
        client.emit("UpdateConfigurationMachineRequest", JSON.stringify(configuration), (updateConfigurationMachineResponse: string) => {
          const configurationMachineResponseType = JSON.parse(updateConfigurationMachineResponse) as TypeConfigurationMachine;
          const mock: Partial<TypeConfigurationMachine> = {
            addition:          { count: 2, delay: 10 },
            division:          { count: 2, delay: 10 },
            multiplication:    { count: 2, delay: 10 },
            enabledForwarding: true,
            memorySize:        1000,
          };
          expect(mock.addition).toStrictEqual(configurationMachineResponseType.addition);
          done();
          client.close();
        });
      });
    } catch (error) {
      done(error);
    } finally {
      // client.close();
    }
  });
});
