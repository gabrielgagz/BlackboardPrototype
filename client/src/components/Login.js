import { useState, useEffect, useRef } from 'react';
import  { useHistory } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import '../css/login.css';

export const Login = () => {

    // Start with an empty socket
    const [token, setToken] = useState();

    // Generator button state
    const [btnState, setBtnState] = useState( false );

    // Socket connection
    const { events } = useSocket( token );

    // Save generator button ref
    const button = useRef();

    // Use Router history
    const history = useHistory();

    useEffect( () => {

        // Check if we have at least one event
        if ( events.length > 0 ) {

            const event = events[0][0];

            if ( event.token === token ) {
                
                // Disable button and redirect to blackboard component
                button.current.disabled = true;
                history.push(`/login/${ token }`, { width: event.width, height: event.height });
            }
        }

    },[ events ]);

    const generateToken = () => {

        const uuid = uuidv4();

        // Qr call
        generateQR( uuid )

        // Return new token
        return uuid;
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
        if ( !btnState ) {
            button.current.innerHTML = "RELOAD QR";
            setBtnState( true );
        }

        // Generate Qr
        setQR();
    }

    return (
        <>
            <button 
            className='btn btn-login btn-lg btn-success mt-3 py-2 px-3'
            onClick={ () => setToken( generateToken() ) }
            >
                GENERATE QR
            </button>
            <canvas id='loginCanvas'></canvas>
        </>
    )

}



