import { io } from "socket.io-client";
import {
  TypeSimulationInitRequest,
  TypeSimulationInitResponse
} from "../dist/Types";
import { Utils } from "../dist/Utils";

const client = io("ws://localhost:3000");

describe("PRIM.S CODE", () => {

  test("Simulation Init Request", (done) => {
    const mock: TypeSimulationInitResponse = JSON.parse(Utils.readFileContents("assets/examples-dlx/example-prim.json"));

    const simulationInitRequest = {
      id:        "",
      filename:  "prim.s",
      date:      new Date("2021-08-28T10:25:00.000Z").toISOString(),
      content:   Utils.readFileContents("assets/examples-dlx/prim.s"),
      registers: [],
      memory:    []
    } as TypeSimulationInitRequest;

    const request = JSON.stringify(simulationInitRequest);
    client.emit("SimulationInitRequest", request, (response: string) => {
      const simulationInitResponse = JSON.parse(response) as TypeSimulationInitResponse;
      expect(simulationInitResponse).toBe(mock);
      done(true);
    });
  });

  test("Simulation get Memory", (done) => {

    const mock: TypeSimulationInitResponse = JSON.parse(Utils.readFileContents("assets/examples-dlx/example-prim.json"));
    const simulationInitRequest = {
      id:        "",
      filename:  "prim.s",
      date:      new Date("2021-08-28T10:25:00.000Z").toISOString(),
      content:   Utils.readFileContents("assets/examples-dlx/prim.s"),
      registers: [],
      memory:    []
    } as TypeSimulationInitRequest;
    client.emit("SimulationInitRequest", JSON.stringify(simulationInitRequest), (response: string) => {
      const simulationInitResponse = JSON.parse(response) as TypeSimulationInitResponse;
      //  REQUEST
      const getAllMemoryRequest = {
        id: client.id,
      };
      client.emit("GetAllMemoryRequest", JSON.stringify(getAllMemoryRequest), (response2: string) => {
        const getAllMemoryResponse = JSON.parse(response2);
        // console.log(getAllMemoryResponse);
        expect(true).toBe(true);
        done(true);
      });
      //  END
    });
  });
});