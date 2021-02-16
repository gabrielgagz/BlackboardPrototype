import { useState, useEffect, useRef } from 'react';
import  { useHistory } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import QRCode from 'qrcode';
import '../css/login.css';


export const Login = () => {

    // Iniciamos el token vacio
    const [token, setToken] = useState();

    // State del boton generador
    const [state, setState] = useState( false );

    // Conectamos al Socket
    const { events } = useSocket( token );

    // Guardamos la referencia al boton generador
    const button = useRef();

    // Usamos history del Router
    const history = useHistory();

    // Chequeamos que events cambie. El primer cambio corresponderá a la carga a través del QR nos redirigimos a la pizarra con el token correspondiente
    useEffect( () => {

        // Si hay evento, ejecutamos las acciones para la redirección
        if ( events.length > 0 ) {

            if ( events[0][0].token === token ) {
                
                // Deshabilitamos el boton y redireccionamos a la pizarra

                button.current.disabled = true;
                
                history.push(`/login/${ token }`)
            }
        }

    },[ events ]);

    const generateToken = () => {

        // Longitud del token
        const length = 16;

        const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        let b = [];  

        for (let i=0; i<length; i++) {

        const j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];

        }

        // LLamamos al QR
        generateQR(b.join("")  )

        // Almacenamos el token
        return b.join("");
    }

    const generateQR = ( token ) => {

        // Seleccionamos los objetos del boton y canvas
        button.current = document.querySelector('.btn');
        const loginCanvas = document.querySelector('#loginCanvas');

        const url = window.location.href + `login/${ token }/qr`;

        // Generamos el QR
        const setQR = async () => {

        try {
            await QRCode.toCanvas( loginCanvas, url, { scale: 7     } );
        } catch (err) {
            console.error(err);
        }

        }

        // Si el boton no fue generado
        // cambiamos el texto
        if ( !state ) {
            button.current.innerHTML = "RECARGAR QR";
            setState( true );
        }

        // Generamos el QR
        setQR();
    }

    return (
        <>
            <button 
            className='btn btn-lg btn-success mt-3 py-2 px-3'
            onClick={ () => setToken( generateToken() ) }
            >
                GENERAR QR
            </button>
            <canvas id='loginCanvas'></canvas>
        </>
    )

}



