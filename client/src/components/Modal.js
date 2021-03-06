import React from "react";
import { useHistory } from "react-router-dom";

export const Modal = ( modalAction ) => {

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
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                    {
                    ( modalAction ) ?
                    'Are you sure you want to quit?'
                    : 'User limit (2) was exceeded for this session.'
                    }
                    </div>
                    <div className="modal-footer">
                        {
                        ( modalAction ) &&
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        }
                        <button type="button" className="btn btn-danger"
                        data-bs-dismiss="modal"
                        onClick={ executeAction }
                        >
                            Quit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
