import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

interface SiteActionbarProps {
  showDownloadModal?: (show: boolean) => void;
  showUploadModal?: (show: boolean) => void;
}

export function SiteActionbar({ showDownloadModal, showUploadModal }: SiteActionbarProps = {}) {
  return (
    <Navbar bg="light" className="p-0 second-nav">
      <Container fluid className="p-0">
        <Nav></Nav>
        <div className="d-flex">
          <div className="p-2">
            {showDownloadModal && (
              <Button className="ms-1" onClick={() => showDownloadModal(true)}>
                Download Data
              </Button>
            )}
          </div>
          <div className="p-2">
            {showUploadModal && (
              <Button className="ms-1" onClick={() => showUploadModal(true)}>
                Upload Data
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Navbar>
  );
}
