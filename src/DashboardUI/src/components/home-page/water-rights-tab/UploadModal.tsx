import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useHomePageContext } from "../Provider";

function UploadModal() {
    const { showUploadModal, setShowUploadModal } = useHomePageContext();

    const close = () => {
        setShowUploadModal(false);
    }

    return (
        <Modal show={showUploadModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton onClick={close}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Upload Data
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Upload functionality is coming soon. Please check back later.</p>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'end'}}>
                <Button className="btn btn-secondary" onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UploadModal;
