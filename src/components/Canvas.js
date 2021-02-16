import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import PropTypes from "prop-types";
import "../css/canvas.css";

export const Canvas = (uuid) => {

    // Obtenemos el token desde la dirección web
    const urlToken = window.location.pathname
        .replace("/login/", "")
        .replace("/qr", "");

    // Definimos si la web ha sido acticada desde el qr
    const isQrOn = window.location.href.includes("qr");

    // State del Qr loader
    const [qrLoad, setQrLoad] = useState(false);

    // Importamos el Hook para el uso de WebSocket
    const { events, sendEvents } = useSocket(urlToken);

    // Guardamos la referencia de lastPoint
    const lastPoint = useRef();

    useEffect(() => {

        // Si la web viene a traves del QR emitimos el token, y validamos
        if (isQrOn && !qrLoad) {

            sendEvents([{ token: urlToken, onUrl: true }]);
            setQrLoad(true);

        }

        // Definimos el entorno
        const canvas = document.querySelector("#bCanvas");
        const context = canvas.getContext("2d");

        // Tamaño de la ventana
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Definimos el trazado
        context.strokeStyle = "white";
        context.lineWidth = 4;
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

        // Acciones al mover el mouse o touch
        const eventMove = ( condition, coords ) => {

            if ( condition ) {

                if (!lastPoint.current) {

                    lastPoint.current = { x: coords.x, y: coords.y };
                    return;

                }

                sendEvents([
                    {
                        lastPoint: lastPoint.current,
                        x: coords.x,
                        y: coords.y
                    }
                ]);

                lastPoint.current = { x: coords.x, y: coords.y };
            }
        };

        const drawMove = ( e ) => {

            const condition = e.buttons;

            const coords = { x: e.offsetX, y: e.offsetY };

            eventMove( condition, coords );

        }

        const touchMove = ( e ) => {

            const event = e.changedTouches[0];

            const condition = e.touches;

            const coords = { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop }

            eventMove( condition, coords );

            e.preventDefault();

        }

        // Action executed when button or touch is released
        const drawUp = () => {

            lastPoint.current = undefined;

        };

        // Recibimos los datos del servidor
        // los y dibujamos en pantalla
        events.forEach(draw);

        // Mouse Events
        canvas.onmousemove = drawMove;
        canvas.onmouseup = drawUp;

        // Touch Events
        canvas.ontouchmove = touchMove;
        canvas.ontouchend = drawUp;
        canvas.ontouchcancel = drawUp;
        
    });

    return <canvas id="bCanvas"></canvas>;
};

Canvas.propTypes = {
    uuid: PropTypes.string,
};
