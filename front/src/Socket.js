import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// Initialize SockJS and Stomp client
const SOCKET_URL = 'https://localhost:8443/ws'
const SOCKJS = new SockJS(SOCKET_URL);
const STOMP = Stomp.over(SOCKJS)

export default STOMP