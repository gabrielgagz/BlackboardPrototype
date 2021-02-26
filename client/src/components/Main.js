import React from 'react';
import { AppRouter } from './Router';
import { ToastContainer } from 'react-toastify';

export const Main = () => {
    return (
        <div className='container-fluid'>
            <AppRouter />
            <ToastContainer />
        </div>
    )
}
