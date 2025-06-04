
import { io } from 'socket.io-client';


const SOCKET_URL = 'http://localhost:8000'; // Replace with actual

const socket = io(SOCKET_URL, {
  transports: ['websocket'], // ensures better compatibility with mobile
  autoConnect: false,
});

export default socket;
