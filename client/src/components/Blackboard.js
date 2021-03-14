import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { Modal } from './Modal';
import { v4 as uuidv4 } from 'uuid';
import "../css/blackboard.css";

export const Blackboard = () => {

    // Get token from url
    const urlToken = window.location.pathname
        .replace("/login/", "")
        .replace("/qr", "");

    // Check if user is coming from qr action
    const isQrOn = window.location.href.includes("qr");

    // States
    const [envState, setEnvState] = useState( false );
    const [qrLoad, setQrLoad ] = useState(false);
    const [cleanUp, setCleanUp] = useState( false );

    // Refs
    const lastPoint = useRef();
    const canvasRef = useRef();
    const contextRef = useRef();
    const uuidRef = useRef();

    // Socket custom hook
    const { events, sendEvents, setEvents } = useSocket(urlToken);

    // Modal & actions
    const [modalAction, setModalAction] = useState();
    const modal = Modal( modalAction );

    // Get window size from history
    const history = useHistory();
    const histWidth = history.location.state?.width;
    const histHeight = history.location.state?.height;

    // Set unique id per device
    uuidRef.current = uuidv4();

    useEffect( () => {

        // Canvas environment
        canvasRef.current = document.querySelector("#bCanvas");
        contextRef.current = canvasRef.current.getContext("2d");

        // Window Size (bigger screen resize canvas to match lower screen)
        if ( (window.innerWidth + window.innerHeight) >  ( histWidth + histHeight) ) {

            canvasRef.current.width = histWidth;
            canvasRef.current.height = histHeight;
            canvasRef.current.classList.add("bCanvas");
            
        } else {

            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;

        }

        // Define the path
        contextRef.current.strokeStyle = "white";
        contextRef.current.lineWidth = 2;
        contextRef.current.lineCap = "round";

    },[ envState ]);


    useEffect(() => {

        // Check if user comes from Qr code, if so, send token and window size
        if (isQrOn && !qrLoad) {

            sendEvents([{ token: urlToken, width: window.innerWidth, height: window.innerHeight }]);
            setQrLoad(true);

        }

        // Check if events "cleanup" exists, if so, cleanup all events from server
        if ( events.length > 0 ) {

            // Back to home if user limit is exceeded
            if ( events[events.length -1][0].nousers ) {

                const hiddenButton = document.querySelector('.hiddenButton');
                hiddenButton.click();
                setModalAction('user-alone');

            }
            

            // Back to home if user limit is exceeded
            if ( events[0][0].error ) {

                const hiddenButton = document.querySelector('.hiddenButton');
                hiddenButton.click();
                setModalAction('user-limit');

            }
            
            // Capture the last event, trigered by "CLEAN UP" button
            if (events[events.length -1][0].cleanup) {

                setEvents([]);
                setEnvState(!envState);
                sendEvents([{}]);

            }
            
        }

        // Write
        const draw = ( data ) => {

            // Get coordinate(s) from server
            const { lastPoint, x, y } = data[0];

            if ( lastPoint ) {

                contextRef.current.beginPath();
                contextRef.current.moveTo(lastPoint.x, lastPoint.y);
                contextRef.current.lineTo(x, y);
                contextRef.current.stroke();
                contextRef.current.closePath();

            }
            
        };

        // Actions executed when mouse is moved or touch is detected
        const eventMove = ( event, condition ) => {

            const posX = event.pageX - canvasRef.current.offsetLeft;
            const posY = event.pageY - canvasRef.current.offsetTop;
            

            if ( condition ) {

                if (!lastPoint.current) {

                    lastPoint.current = { x: posX, y: posY };
                    return;

                }
                
                draw([
                    {
                        lastPoint: lastPoint.current,
                        x: posX,
                        y: posY
                    }
                ]); 

                sendEvents([
                    {
                        lastPoint: lastPoint.current,
                        x: posX,
                        y: posY,
                        uuid: uuidRef.current
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
            
            sendEvents([{ cleanup: true }]);
            setCleanUp( false );

        }

        // Get coordinates and draw
        if ( events.length > 0 ) {

            if ( events[0][0].uuid !== uuidRef.current ) {

                events.forEach(draw);
                
            } 
        }

        // Mouse Events
        canvasRef.current.onmousemove = mouseMove;
        canvasRef.current.onmouseup = moveUp;

        // Touch Events
        canvasRef.current.ontouchmove = touchMove;
        canvasRef.current.ontouchend = moveUp;
        canvasRef.current.ontouchcancel = moveUp;
        
    });

    return (
        <div className='blackboard'>
            <canvas id="bCanvas"></canvas>
            <div className='buttons d-grid gap-2 md-block'>
                <button
                    className ='btn btn-primary'
                    type = 'button'
                    onClick = { () => setCleanUp( true ) }
                    >
                    CLEAN UP
                </button>
                <button 
                    className='btn btn-danger'
                    type = 'button'
                    data-bs-toggle="modal"  data-bs-target="#bbModal"
                    onClick = { () => setModalAction( 'user-quit' ) }
                >
                    QUIT
                </button>
                { modal }
                <button 
                type = 'button'
                className = 'hiddenButton'
                data-bs-toggle="modal" data-bs-target="#bbModal"
                >
                </button>
            </div>
        </div>
    );
};