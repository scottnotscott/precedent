import { Server } from 'socket.io'


const SocketHandler = (req, res) => {
    let onlineUsers;
    if (res.socket.server.io) {
      
    } else {
      
      const io = new Server(res.socket.server)
      res.socket.server.io = io

      io.on('connection', socket => {
        onlineUsers++

        // setInterval(() => {
        //     socket.emit('totalusers', {data: onlineUsers});
        //   }, 5000);
        //setInterval(socket.broadcast.emit('total-users', onlineUsers), 1000)
        //TODO:: rethink socketio functionality and whether this approach is really suitable.
        
      })

      io.on('disconnect', () => {
          onlineUsers--
      })
    }
    res.end()
  }
  
  export default SocketHandler