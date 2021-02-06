import React, { useEffect } from 'react';
import '../css/canvas.css';



export const Canvas = () => {

    useEffect ( () => {

        // Definimos el entorno
        const canvas = document.querySelector('#bbCanvas');
        const context = canvas.getContext('2d');

        // Tamaño de la ventana
        context.canvas.width  = window.innerWidth;
        context.canvas.height = window.innerHeight;

        // Definimos el trazo
        context.lineWidth = 8; 
        context.lineCap = 'round'; 
        context.strokeStyle = 'white';
        
        let isIdle = true;

        const drawstart = (event) => {

            context.beginPath();
            context.moveTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
            isIdle = false;

        }

        const drawmove = (event) => {

            if (isIdle) return;
            context.lineTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
            context.stroke();
        }

        const drawend = (event) => {
            if (isIdle) return;
            drawmove(event);
            isIdle = true;
        }

        const touchstart = (event) => { 
            drawstart(event.touches[0]) 
        }

        const touchmove = (event) => 
        { 
            drawmove(event.touches[0]); 
            event.preventDefault(); 
        }
        
        const touchend = (event) => { 
            drawend(event.changedTouches[0]); 
        }


        // Generamos los listeners
        canvas.addEventListener('touchstart', touchstart);
        canvas.addEventListener('touchmove', touchmove);
        canvas.addEventListener('touchend', touchend);        

        canvas.addEventListener('mousedown', drawstart);
        canvas.addEventListener('mousemove', drawmove);
        canvas.addEventListener('mouseup', drawend);

})

    return (
        <canvas id='bbCanvas'></canvas>
    )
}
