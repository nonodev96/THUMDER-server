import { createServer } from "http";
import { Server, Socket } from "socket.io";
import InterpreterDLX from "./InterpreterDLX";
import { Utils } from "./Utils";
import { File } from "./Types";

export const httpServer = createServer();
export const server = new Server(httpServer, {});
server.on("connection", (socket: Socket) => {
  console.debug("Connection new Socket %s", socket.id);

  socket.on("CodeRequest", (args) => {
    console.log("args", args);
    if (!Utils.isJSON(args)) {
      throw new Error("Not is a JSON");
    }

    const file: File = JSON.parse(args) as File;
    const interpreter = new InterpreterDLX();
    interpreter.setContent(file.content);
    interpreter.analyze();
    const code = interpreter.getCode();
    console.debug("Code: %s", typeof code);

    socket.emit("CodeResponse", JSON.stringify(code));
  });
});

server.listen(3000);
