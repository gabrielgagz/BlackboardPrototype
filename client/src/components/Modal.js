import React from "react";
import { useHistory } from "react-router-dom";

export const Modal = () => {

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
                    Are you sure you want to quit?
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
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
