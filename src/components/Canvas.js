import React, { useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import PropTypes from 'prop-types';
import "../css/canvas.css";


export const Canvas = ( uuid ) => {

    const urlToken = window.location.pathname.replace("/blackboard/", "");

    // Importamos el Hook para el uso de WebSocket
    const { draws, sendDraw } = useSocket( urlToken );

    useEffect(() => {

        // Definimos el entorno
        const canvas = document.querySelector("#bCanvas");
        const context = canvas.getContext("2d");
        let lastPoint;

        // Tamaño de la ventana
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Definimos el trazado
        context.strokeStyle = 'white';
        context.lineWidth = 4;
        context.lineCap = 'round';

        // Escribimos en la pizarra
        const draw = ( data ) => {

            // Obtenemos el trazado del servidor
            const { lastPoint, x, y } = data[0];

            context.beginPath();
            context.moveTo(lastPoint.x, lastPoint.y);
            context.lineTo(x, y);
            context.stroke();
            context.closePath();

        }
        

        // Acctiones al mover el mouse
        // TODO: Implementar touch input
        const drawMove = (e) => {

            if ( e.buttons ) {

                if (!lastPoint) {
                    lastPoint = { x: e.offsetX, y: e.offsetY };
                    return;
                }

                sendDraw([{
                    lastPoint, 
                    x: e.offsetX,
                    y: e.offsetY
                }]);
        
                lastPoint = { x: e.offsetX, y: e.offsetY };
                
            }

        }

        const drawUp = () => {

            lastPoint = undefined;
            
        }

        // Recibimos los datos del servidor 
        // los y dibujamos en pantalla
        draws.forEach( draw );

        // Implemetación de touch screen
        const touchmove = ( e ) => {

            drawMove(e.changedTouches[0]);
            e.preventDefault(); 

        } 

        canvas.onmousemove = drawMove;
        canvas.onmouseup = drawUp;
        
    },);

    return <canvas id="bCanvas"></canvas>;
};

Canvas.propTypes = {
    uuid: PropTypes.string
};