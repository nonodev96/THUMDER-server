import { Server } from "socket.io";
import { io } from "socket.io-client";

import {
  TypeSimulationInitRequest,
  TypeDataStatistics
} from "../dist/Types";
import { Utils } from "../dist/Utils";
import { startWebSocketServer } from "../dist/main";

describe("Statistics", () => {
  let server: Server;

  beforeAll(async () => {
    server = await startWebSocketServer(3004)
  });

  afterAll(() => {
    server.close();
  });

  test("Get all statistics", (done) => {
    const client = io("ws://localhost:3004");
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
        //  END
      });
    } catch (error) {
      done(error);
    } finally {
      // client.close();
    }
  });
});
