import React from 'react';
import '../css/blackboard.css';
import { Canvas } from '../helpers/Canvas';

export const Blackboard = () => {

    Canvas();

    return (
        <div className='blackboard'>
            <Canvas />
            <div className='buttons'>
                <button className='btn btn-primary mb-3 col-sm'>NOTAS</button>
                <button className='btn btn-danger col-sm'>SALIR</button>
            </div>
        </div>
    )
}
