import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_DRAW_EVENT = "newDrawEvent";
const SOCKET_SERVER_URL = "http://192.168.1.31:4001";

export const useSocket = ( token ) => {


    const [draws, setDraws] = useState([]);
    const socketRef = useRef();

    useEffect(() => {

        // Creamos la conexión al socket
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            query: { token },
        });

        // Escuchamos nuevos eventos
        socketRef.current.on(NEW_DRAW_EVENT, ( draw ) => {

            setDraws(( draws ) => [...draws, draw]);

        });

        // Destroys the socket reference
        // when the connection is closed
        return () => {
            socketRef.current.disconnect();
        };

    }, [token]);

    // Sends a message to the server that
    // forwards it to all users in the same room
    const sendDraw = ( data ) => {
    
        socketRef.current.emit(NEW_DRAW_EVENT, data );
    };

    return { draws, sendDraw };

};
