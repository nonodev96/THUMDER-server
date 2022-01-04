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

});