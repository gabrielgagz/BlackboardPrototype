const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const uuid = require('uuid');
let connectedUsers = 0;

const PORT = 4001;
const NEW_EVENT = "newEvent";

io.on("connection", (socket) => {

    // Entering into token room
    const { token } = socket.handshake.query;

    socket.join(token);

    // Get number of clients in room
    const usersConnected = parseInt( io.sockets.adapter.rooms.get( token ).size);

    console.log( 'Conectado: ' + token + ' - Usuarios: ' + usersConnected );

    // Number of users is limited to 2 per room
    if ( usersConnected > 2 ) 
        io.to( socket.id ).emit(NEW_EVENT, [{ error: true }]);

    // Earring new events
    socket.on(NEW_EVENT, (data) => {

        io.in(token).emit(NEW_EVENT, data);
        
    });

    // Leave room and close socket
    socket.on("disconnect", () => {
        socket.leave(token);
        console.log( 'Desconectado: ' + token )
    });

});

server.listen(PORT, () => {

    console.log(`Servidor iniciado en puerto: ${PORT}`);
    
});
