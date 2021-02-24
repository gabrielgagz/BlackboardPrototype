import { useState, useEffect, useRef } from 'react';
import  { useHistory } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import QRCode from 'qrcode';
import '../css/login.css';


export const Login = () => {

    // Start with an empty socket
    const [token, setToken] = useState();

    // Generator button state
    const [state, setState] = useState( false );

    // Socket connection
    const { events } = useSocket( token );

    // Save generator button ref
    const button = useRef();

    // Use Router history
    const history = useHistory();


    useEffect( () => {

        // Check if we have at least one event
        if ( events.length > 0 ) {

            if ( events[0][0].token === token ) {
                
                // Disable button and redirect to blackboard component
                button.current.disabled = true;
                history.push(`/login/${ token }/web`);
            }
        }

    },[ events ]);

    const generateToken = () => {

        // Token length
        const length = 16;

        const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        let b = [];  

        for (let i=0; i<length; i++) {

        const j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];

        }

        // Qr call
        generateQR(b.join("")  )

        // Return new token
        return b.join("");
    }

    const generateQR = ( token ) => {

        button.current = document.querySelector('.btn');
        const loginCanvas = document.querySelector('#loginCanvas');

        const url = window.location.href + `login/${ token }/qr`;

        // Generate Qr
        const setQR = async () => {

        try {
            await QRCode.toCanvas( loginCanvas, url, { scale: 7     } );
        } catch (err) {
            console.error(err);
        }

        }

        // Change text if button is clicked once
        if ( !state ) {
            button.current.innerHTML = "RELOAD QR";
            setState( true );
        }

        // Generate Qr
        setQR();
    }

    return (
        <>
            <button 
            className='btn btn-lg btn-success mt-3 py-2 px-3'
            onClick={ () => setToken( generateToken() ) }
            >
                GENERATE QR
            </button>
            <canvas id='loginCanvas'></canvas>
        </>
    )

}


