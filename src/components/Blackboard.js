import  React from 'react';
import { Canvas } from './Canvas';
import { v4 as uuidv4 } from 'uuid';
import '../css/blackboard.css';

export const Blackboard = () => {

    const uuid = uuidv4();

    return (
        <div className='blackboard'>
            <Canvas uuid={ uuid }/>
            <div className='buttons'>
                <button className='btn btn-primary mb-3 col-sm'>NOTAS</button>
                <button className='btn btn-danger col-sm'>SALIR</button>
            </div>
        </div>
    )
}