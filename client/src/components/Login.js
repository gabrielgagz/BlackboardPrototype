import { useState, useEffect, useRef } from 'react';
import  { useHistory, useLocation } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import 'react-toastify/dist/ReactToastify.css';
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

    const location = useLocation();

    useEffect( () => {

        if (location.state) {
            
        // Show toast error when you open a third session in the same room 
            if ( Object.keys(location.state).length > 0 ) {
                
                toast.error('User limit was exceeded!', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            
                history.replace( {
                    pathname: location.pathname,
                    state: {}
                } );
            
            }
        }

        // Check if we have at least one event
        if ( events.length > 0 ) {

            if ( events[0][0].token === token ) {
                
                // Disable button and redirect to blackboard component
                button.current.disabled = true;
                history.push(`/login/${ token }`);
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

        const url = window.location.href + `login/${ token }`;

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
            className='btn btn-login btn-lg btn-success mt-3 py-2 px-3'
            onClick={ () => setToken( generateToken() ) }
            >
                GENERATE QR
            </button>
            <canvas id='loginCanvas'></canvas>
        </>
    )

}



