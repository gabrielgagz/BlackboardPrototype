import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import "../css/blackboard.css";

export const Blackboard = () => {

    // Obtenemos el token desde la dirección web
    const urlToken = window.location.pathname
        .replace("/login/", "")
        .replace("/qr", "")
        .replace("/web", "");

    // Definimos si la web ha sido acticada desde el qr
    const isQrOn = window.location.href.includes("qr");

    // Qr loader state
    const [qrLoad, setQrLoad] = useState(false);

    // Clean-Up state
    const [ cleanUp, setCleanUp ] = useState( false );

    // Importamos el Hook para el uso de WebSocket
    const { events, sendEvents, setEvents} = useSocket(urlToken);

    // Guardamos la referencia de lastPoint
    const lastPoint = useRef();

    useEffect(() => {

        // Si la web viene a traves del QR emitimos el token, y validamos
        if (isQrOn && !qrLoad) {

            sendEvents([{ token: urlToken, onUrl: true }]);
            setQrLoad(true);

        }

        // Check if events "cleanup" exists, if so, cleanup all events from server
        if ( events.length > 0 ) {

            // Capture the last event, trigered by "CLEAN UP" button
            if (events[events.length -1][0].cleanup) {
                setEvents([]);
            }
            
        }

        // Definimos el entorno
        const canvas = document.querySelector("#bCanvas");
        const context = canvas.getContext("2d");

        // Tamaño de la ventana
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Definimos el trazado
        context.strokeStyle = "white";
        context.lineWidth = 3;
        context.lineCap = "round";

        // Escribimos en la pizarra
        const draw = (data) => {

            // Obtenemos el trazado del servidor
            const { lastPoint, x, y } = data[0];

            // Chequeamos que lastPoint esté definido
            if ( lastPoint ) {

                context.beginPath();
                context.moveTo(lastPoint.x, lastPoint.y);
                context.lineTo(x, y);
                context.stroke();
                context.closePath();

            }
        };

        // Actions executed when mouse is moved or touch is detected
        const eventMove = ( event, condition ) => {

            const posX = event.pageX - canvas.offsetLeft;
            const posY = event.pageY - canvas.offsetTop;

            if ( condition ) {

                if (!lastPoint.current) {

                    lastPoint.current = { x: posX, y: posY };
                    return;

                }

                sendEvents([
                    {
                        lastPoint: lastPoint.current,
                        x: posX,
                        y: posY
                    }
                ]);

                lastPoint.current = { x: posX, y: posY };
            }
        };

        // Mouse Wrapper for move events
        const mouseMove = ( event ) => {

            const condition = event.buttons;

            eventMove( event, condition );

        }

        // Touch Wrapper for move events
        const touchMove = ( event ) => {

            const touchEvent = event.changedTouches[0];

            const condition = event.touches;

            eventMove( touchEvent, condition );

            event.preventDefault();

        }

        // Action executed when button or touch is released
        const moveUp = () => {

            lastPoint.current = undefined;

        };

        // Clean up the screen
        if ( cleanUp ) { 

        sendEvents([{ cleanup: true }])
        setCleanUp( false );

        }

        // Recibimos los datos del servidor
        // los y dibujamos en pantalla
        events.forEach(draw);

        // Mouse Events
        canvas.onmousemove = mouseMove;
        canvas.onmouseup = moveUp;

        // Touch Events
        canvas.ontouchmove = touchMove;
        canvas.ontouchend = moveUp;
        canvas.ontouchcancel = moveUp;
        
    });

    return (
        <div className='blackboard'>
            <canvas id="bCanvas"></canvas>
            <div className='buttons'>
                <button 
                    className ='btn btn-primary mb-3 col-sm'
                    onClick = { () => setCleanUp( true ) }
                    >
                    CLEAN UP
                </button>
                <button className='btn btn-danger col-sm'>EXIT</button>
            </div>
        </div>
    );
};
