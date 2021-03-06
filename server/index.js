const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const PORT = process.env.PORT || 4000;
const NEW_EVENT = "newEvent";

io.on("connection", (socket) => {

    // Entering into token room
    const { token } = socket.handshake.query;

    socket.join(token);

    // Get number of clients in room
    const usersConnected = io.sockets.adapter.rooms.get( token ).size;

    console.log( 'Connected: ' + token + ' - Users: ' + usersConnected );

    const emmitEvent = ( data ) => {
        io.in(token).emit(NEW_EVENT, data);
    }

    // Number of users is limited to 2 per room
    if ( usersConnected > 2 ) 
        emmitEvent([{ error: true }]);

    // Earring new events
    socket.on(NEW_EVENT, (data) => {
        emmitEvent( data );
    });

    // Leave room and close socket
    socket.on("disconnect", () => {
        socket.leave(token);
        console.log( 'Disconnected: ' + token )
    });

});

server.listen(PORT, () => {

    console.log(`Server started at port: ${PORT}`);
    
});
