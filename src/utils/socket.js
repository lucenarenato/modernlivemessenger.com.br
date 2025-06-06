import { io } from 'socket.io-client';

const SOCKET_BASE_URL = import.meta.env.VITE_BACKEND_URL
export const socket = io(SOCKET_BASE_URL);