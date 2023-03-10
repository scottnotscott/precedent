import { useEffect } from 'react'
import io from 'Socket.IO-client'
let socket

export default function GameServer() {

 useEffect(() => {
    async function socketInitialiser() {
        await fetch('api/socket')
        socket = io()

        socket.on('connect', () => {
            console.log('Connected')
        })
    }
    socketInitialiser();
 }, [])
  }
