import dotenv from "dotenv";
import app from "./app";
import http from "http"
import { setUpWebSocket } from "./websocket";
dotenv.config();

const PORT = process.env.PORT || 5000;
const server  = http.createServer(app);
setUpWebSocket(server)
server.listen(PORT, ()=>{
  console.log(`Server is running at port ${PORT}`)
})