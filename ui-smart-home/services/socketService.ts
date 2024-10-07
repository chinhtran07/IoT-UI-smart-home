import { BASE_URL } from "@/configs/apiConfig"
import { io } from "socket.io-client"

export const socket = io(BASE_URL);