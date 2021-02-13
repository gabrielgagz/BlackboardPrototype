import QRCode from 'qrcode';
import { useState } from 'react';
import '../css/login.css';

export const Login = () => {

    const [state, setState] = useState( false );

    const generateToken = () => {

        // Longitud del token
        const length = 16;

        const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        let b = [];  

        for (let i=0; i<length; i++) {

        const j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];

        }

        return b.join("");

}

    const generateQR = () => {

        // Seleccionamos los objetos del boton y canvas
        const button = document.querySelector('.btn');
        const loginCanvas = document.querySelector('#loginCanvas');

        const token = generateToken();

        const url = window.location.href + `blackboard/${ token }`;

        // Generamos el QR
        const generateQR = async () => {

        try {
            await QRCode.toCanvas( loginCanvas, url, { scale: 7     } );
        } catch (err) {
            console.error(err);
        }

        }

        // Si el boton no fue generado, cambiamos el texto
        if ( !state ) {
            button.innerHTML = "RECARGAR QR";
            setState( true );
        }

        // Dibujamos el QR
        generateQR();

}

return (
    <>
        <button 
        className='btn btn-lg btn-success mt-3 py-2 px-3'
        onClick={ generateQR }
        >
            GENERAR QR
        </button>
        <canvas id='loginCanvas'></canvas>
    </>
)

}



