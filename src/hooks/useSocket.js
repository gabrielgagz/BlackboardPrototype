import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_EVENT = "newEvent";
const SOCKET_SERVER_URL = `${process.env.REACT_APP_API_KEY}`;

export const useSocket = ( token ) => {

    // State de la pizarra
    const [events, setEvents] = useState([]);

    // Ref al socket
    const socketRef = useRef();

    useEffect(() => {

        // Solo conectaremos si el token está definido
        if ( token ) {

            // Creamos la conexión al socket
            socketRef.current = socketIOClient  (SOCKET_SERVER_URL, {
                query: { token },
            });

            // Escuchamos nuevos eventos
            socketRef.current.on(NEW_EVENT, ( event ) => {

                setEvents(( events ) => [...events, event]);

            });


            // Destroys the socket reference
            // when the connection is closed
            return () => {
                socketRef.current.disconnect();
            };

        }

    }, [ token ] );

    // Sends a message to the server that
    // forwards it to all users in the same room
    const sendEvents = ( data ) => {

        socketRef.current.emit(NEW_EVENT, data );
    };

    return { events, sendEvents, setEvents };

};
