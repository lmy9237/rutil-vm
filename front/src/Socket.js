import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// Initialize SockJS and Stomp client
let SOCKET_URL = 'https://localhost'

if (import.meta.env.PROD) {
  console.log("THIS IS PRODUCTION !!!")
  console.log(`Socket.js ... import.meta.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: __RUTIL_VM_OVIRT_IP_ADDRESS__\n\n`)
  SOCKET_URL = 'https://__RUTIL_VM_OVIRT_IP_ADDRESS__:6690/ws';
}
console.log(`SOCKET_URL: ${SOCKET_URL}`)
const SOCKJS = new SockJS(SOCKET_URL);
const STOMP = Stomp.over(SOCKJS)

export default STOMP