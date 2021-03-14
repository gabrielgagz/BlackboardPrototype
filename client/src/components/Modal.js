import React from "react";
import { useHistory } from "react-router-dom";
import "../css/modal.css";

export const Modal = (modalAction) => {

    let modalTitle = 'ERROR';
    let closeButton = false;
    let modalMessage; 

    switch ( modalAction ) {
        
        case 'user-quit':
            modalTitle = 'WARNING';
            modalMessage = 'Are you sure you want to quit?';
            closeButton = true;
        break;
        case 'user-limit':
            modalMessage = 'User limit (2) was exceeded for this session.';
        break;
        default:
            modalMessage = 'Remote user disconnected. \nAt  least 2 users are needed for this session.';

    }
    
    // Use Router history
    const history = useHistory();

    const executeAction = () => {
        history.push("/");
    };

    return (
        <div
            className="modal fade"
            id="bbModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="bbModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog text-center">
                <div className="modal-content">
                    <div className="modal-header bg-danger text-white py-2 text-center d-block">
                        <h5>{ modalTitle }</h5>
                    </div>
                    <div className="modal-body">
                        { modalMessage }
                    </div>
                    <div className="modal-footer text-center d-block">
                        {closeButton && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn btn-danger"
                            data-bs-dismiss="modal"
                            onClick={executeAction}
                        >
                            Quit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
