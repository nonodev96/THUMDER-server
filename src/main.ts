import { createServer } from "http";
import { Server } from "socket.io";
import { File, TypeSimulationInitRequest } from "./Types";
import Manager from "./Manager";
import InterpreterDLX from "./InterpreterDLX";

export const httpServer = createServer();
export const server = new Server(httpServer, {});

const manager = new Manager();

server.on("connection", (socket) => {
  socket.on("disconnect", () => {
    const isDeleted = manager.deleteMachine(socket.id);
    console.log("Disconnect, machine remove", isDeleted);
  });
  console.debug("Connection new Socket %s", socket.id);

  // Machine:
  socket.on("SimulationInitRequest", (args, callback) => {
    console.log("SimulationInitRequest Args");
    Manager.checkArgs(args);
    const simulationInitRequest = JSON.parse(args) as TypeSimulationInitRequest;
    const machine = manager.setMachine(socket.id);
    const response = machine.SimulationInit(simulationInitRequest);
    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("SimulationInitResponse", JSON.stringify(response));
  });

  socket.on("SimulationNextStepRequest", (args, callback) => {
    console.log("SimulationNextStepRequest Args");
    Manager.checkArgs(args);
    const machine = manager.getMachine(socket.id);
    const response = machine.simulationNextStep();

    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("SimulationNextStepResponse", JSON.stringify(response));
  });

  socket.on("CodeRequest", (args, callback) => {
    console.log("CodeRequest Args");
    Manager.checkArgs(args);
    const file: File = JSON.parse(args) as File;
    const interpreter = new InterpreterDLX(file.content);
    interpreter.analyze();
    const response = interpreter.getCode();

    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("CodeResponse", JSON.stringify(response));
  });

  socket.on("UpdateConfigurationMachineRequest", (args, callback) => {
    console.log("UpdateConfigurationMachineRequest Args", args);
    Manager.checkArgs(args);
    const machine = manager.getMachine(socket.id);
    const data = JSON.parse(args);
    const response = machine.updateConfigurationMachine(data);

    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("UpdateConfigurationMachineResponse", JSON.stringify({}));
  });

  socket.on("UpdateRegisterRequest", (args, callback) => {
    console.log("UpdateRegisterRequest Args", args);
    Manager.checkArgs(args);
    const machine = manager.getMachine(socket.id);
    const data = JSON.parse(args);
    const response = machine.updateRegisters(data);

    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("UpdateRegisterResponse", JSON.stringify({ response }));
  });

  socket.on("UpdateMemoryRequest", (args, callback) => {
    console.log("UpdateMemoryRequest Args", args);
    Manager.checkArgs(args);
    const machine = manager.getMachine(socket.id);
    const data = JSON.parse(args);
    const response = machine.updateMemory(data);

    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("UpdateMemoryResponse", JSON.stringify(response));
  });

  socket.on("GetAllRegistersRequest", (args, callback) => {
    console.log("UpdateMemoryRequest Args", args);
    Manager.checkArgs(args);
    const machine = manager.getMachine(socket.id);
    const response = machine.getAllRegisters();

    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("GetAllRegistersResponse", JSON.stringify(response));
  });

  socket.on("GetAllMemoryRequest", (args, callback) => {
    console.log("UpdateMemoryRequest Args", args);
    Manager.checkArgs(args);
    const machine = manager.getMachine(socket.id);
    const response = machine.getAllMemory();

    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("GetAllMemoryResponse", JSON.stringify(response));
  });

  socket.on("GetAllStatisticsRequest", (args, callback) => {
    console.log("GetAllStatistics Args", args);
    Manager.checkArgs(args);
    const machine = manager.getMachine(socket.id);
    const response = machine.getAllStatistics();

    if (typeof callback === "function") callback(JSON.stringify(response));
    socket.emit("GetAllStatisticsResponse", JSON.stringify(response));
  });
});

server.listen(3000);
