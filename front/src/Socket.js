import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import Logger from "./utils/Logger";
import CONSTANT from "./Constants";

// Initialize SockJS and Stomp client
let SOCKET_URL = `https://${CONSTANT.baseUrl}:6690/ws`
Logger.debug(`SOCKET_URL: ${SOCKET_URL}`)
const SOCKJS = new SockJS(SOCKET_URL);
const STOMP = Stomp.over(SOCKJS)

export default STOMP