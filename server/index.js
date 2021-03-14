const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const PORT = process.env.PORT || 4000;
const NEW_EVENT = "newEvent";

io.on("connection", (socket) => {

    let isRoomOk = false;

    // Entering into token room
    const { token } = socket.handshake.query;

    socket.join(token);

    // Get number of clients in room
    const usersConnected = io.sockets.adapter.rooms.get( token ).size;

    if ( usersConnected === 2 ) { isRoomOk = true; }

    console.log( 'Connected: ' + token + ' - Users: ' + usersConnected );

    // Number of users is limited to 2 per room
    if ( usersConnected > 2 ) 
        io.to(socket.id).emit(NEW_EVENT, [{ error: true }]);

    // Earring new events
    socket.on(NEW_EVENT, (data) => {
        io.in(token).emit(NEW_EVENT, data);
    });

    // Leave room and close socket
    socket.on("disconnect", () => {

        socket.leave(token);

        console.log( 'Disconnected: ' + token + ' - Users: ' + (usersConnected-1) );

        const usersOnDisconnect = (usersConnected - 1) <= 1;

        console.log( isRoomOk, usersOnDisconnect)

        if ( isRoomOk && usersOnDisconnect) {
            isRoomOk = false;
            io.in(token).emit(NEW_EVENT, [{ nousers: true }]);
        }
        
    });

});

server.listen(PORT, () => {

    console.log(`Server started at port: ${PORT}`);
    
});
