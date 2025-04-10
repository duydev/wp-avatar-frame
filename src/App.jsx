import { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import loGet from 'lodash/get';

import 'bootstrap/dist/css/bootstrap.min.css';

import { listAllPhotoFrames } from './service';
import { useImageEditor } from './lib/useImageEditor';
import ImageEditor from './components/editor/ImageEditor';
import ControlPanel from './components/editor/ControlPanel';

import defaultImage from './assets/default.png';
import frameImage from './assets/frame.png';

function App() {
  const [userPhotoURL, setUserPhotoURL] = useState(null);
  const [framePhotoURL, setFramePhotoURL] = useState(null);
  
  const {
    frameRef,
    zoom,
    rotate,
    handleCropperReady,
    updateImage,
    handleZoomChange,
    handleZoomOutClick,
    handleZoomInClick,
    handleRotateChange,
    handleRotateLeftClick,
    handleRotateRightClick,
    handleFlipHorizontal,
    handleFlipVertical,
    handleReset,
    handleDownloadImage
  } = useImageEditor();

  const handleOpenImageSelector = useCallback(() => {
    document.querySelector('.hidden input[type="file"]').click();
  }, []);

  const handleChangeImage = useCallback(file => {
    if (!file || !file.base64) {
      console.warn('No valid file data received');
      return;
    }

    // Set the image URL first
    const imageDataURL = file.base64;
    setUserPhotoURL(imageDataURL);
    
    // The image will be automatically updated in the ImageEditor component
    // thanks to the useEffect that watches for userPhotoURL changes
  }, []);

  const handleDownloadClick = useCallback(() => {
    handleDownloadImage(framePhotoURL);
  }, [handleDownloadImage, framePhotoURL]);

  useEffect(() => {
    listAllPhotoFrames().then(frames => {
      const userPhoto = document
        .getElementById('ctxh-avatar-frame')
        .getAttribute('data-user-photo');

      const framePhoto = loGet(frames, '[0].url');
      setUserPhotoURL(userPhoto || defaultImage);
      setFramePhotoURL(framePhoto || frameImage);
    });
  }, []);

  return (
    <div className="py-4">
      <style>
        {`
          .hidden { display: none; }
          .d-flex.col { gap: 10px; }
          @media (min-width: 992px) {
            .control-panel { margin-top: 0 !important; }
          }
        `}
      </style>
      <Container fluid>
        <Row className="gx-4 gy-3">
          <Col lg={6} className="mb-lg-0">
            <ImageEditor 
              userPhotoURL={userPhotoURL}
              framePhotoURL={framePhotoURL}
              onCropperReady={handleCropperReady}
              defaultUserImage={defaultImage}
              defaultFrameImage={frameImage}
            />
          </Col>
          <Col lg={6}>
            <div className="mt-4 mt-lg-0">
              <ControlPanel
                zoom={zoom}
                rotate={rotate}
                onZoomChange={handleZoomChange}
                onZoomOutClick={handleZoomOutClick}
                onZoomInClick={handleZoomInClick}
                onRotateChange={handleRotateChange}
                onRotateLeftClick={handleRotateLeftClick}
                onRotateRightClick={handleRotateRightClick}
                onFlipVertical={handleFlipVertical}
                onFlipHorizontal={handleFlipHorizontal}
                onReset={handleReset}
                onOpenImageSelector={handleOpenImageSelector}
                onDownloadImage={handleDownloadClick}
                onFileChange={handleChangeImage}
                canvasRef={frameRef}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
