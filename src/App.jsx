import { useEffect, useState, useRef } from 'react';
import Cropper from 'cropperjs';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { FiZoomIn, FiZoomOut, FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import loRound from 'lodash/round';
import FileBase64 from 'react-file-base64';
import { saveAs } from 'file-saver';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'cropperjs/dist/cropper.css';

import defaultImage from './assets/default.png';

const Wrapper = styled.div`
  max-width: 600px;

  .image-wrapper {
    max-width: 100%;

    img {
      display: block;
      width: 100%;
    }
  }

  .d-flex.col {
    gap: 10px;
  }

  .upload-file {
    display: none;
  }
`;

function App() {
  const cropRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const [imageURL, setImageURL] = useState(defaultImage);

  const [isDisabled, setIsDisabled] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [height, setHeight] = useState(0);

  const doZoom = val => {
    if (isDisabled) return;

    const newVal = loRound(+val, 1);

    if (newVal >= 0.1 && newVal <= 5) {
      console.log('ZOOM TO', newVal);

      cropRef.current.zoomTo(newVal);
      setZoom(newVal);
    }
  };

  const doRotate = val => {
    if (isDisabled) return;

    const newVal = loRound(+val);

    if (newVal >= -180 && newVal <= 180) {
      console.log('ROTATE TO', newVal);

      cropRef.current.rotateTo(newVal);
      setRotate(newVal);
    }
  };

  const handleOpenImageSelector = () => {
    if (isDisabled) return;

    console.log('OPEN IMAGE SELECTOR');

    document.querySelector('.upload-file input[type="file"]').click();
  };

  const handleChangeImage = file => {
    if (isDisabled) return;

    const imageDataURL = file.base64;

    console.log('CHANGE NEW IMAGE', { imageDataURL });

    setImageURL(imageDataURL);

    cropRef.current.replace(imageDataURL);
  };

  const handleZoomChange = e => {
    doZoom(e.target.value);
  };

  const handleZoomOutClick = () => {
    doZoom(zoom - 0.1);
  };

  const handleZoomInClick = () => {
    doZoom(zoom + 0.1);
  };

  const handleRotateChange = e => {
    if (isDisabled) return;

    doRotate(+e.target.value);
  };

  const handleRotateLeftClick = () => {
    doRotate(rotate - 90);
  };

  const handleRotateRightClick = () => {
    doRotate(rotate + 90);
  };

  const handleFlipHorizontal = () => {
    const { scaleX, scaleY } = cropRef.current.getData();
    const newScaleX = -1 * scaleX;

    console.log('FLIP HORIZONTAL', { newScaleX, scaleX, scaleY });

    cropRef.current.scale(newScaleX, scaleY);
  };

  const handleFlipVertical = () => {
    const { scaleX, scaleY } = cropRef.current.getData();
    const newScaleY = -1 * scaleY;

    console.log('FLIP VERTICAL', { newScaleY, scaleX, scaleY });

    cropRef.current.scale(scaleX, newScaleY);
  };

  const handleReset = () => {
    console.log('RESET');

    setZoom(1);
    setRotate(0);
    cropRef.current.reset();
  };

  const handleDownloadImage = () => {
    cropRef.current.crop();

    const data = cropRef.current.getCroppedCanvas().toDataURL();

    saveAs(data, `img-${Date.now()}.png`);
  };

  useEffect(() => {
    console.log('MOUNTED');

    setHeight(imageWrapperRef.current.offsetWidth);

    addEventListener('resize', () => {
      setHeight(imageWrapperRef.current.offsetWidth);
    });

    console.log('INIT CROPPER');

    cropRef.current = new Cropper(document.getElementById('image'), {
      viewMode: 0,
      dragMode: 'move',
      aspectRatio: 1,
      responsive: true,
      modal: false,
      guides: false,
      center: false,
      highlight: false,
      background: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      zoomOnTouch: false,
      zoomOnWheel: false,
      minCropBoxHeight: Number.MAX_SAFE_INTEGER,
      minCropBoxWidth: Number.MAX_SAFE_INTEGER,
      ready: () => {
        setIsDisabled(false);
      }
    });

    return () => {
      console.log('UNMOUNTED');

      if (cropRef.current) {
        cropRef.current.destroy();
      }
    };
  }, []);

  return (
    <Wrapper>
      <Container className="m3">
        <Row className="mb-3">
          <Col>
            <div
              className="image-wrapper"
              ref={imageWrapperRef}
              style={{ height }}
            >
              <img id="image" src={imageURL} alt="User photo" />
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="d-flex">
            <Button disabled={isDisabled} onClick={handleZoomOutClick}>
              <FiZoomOut />
            </Button>
            <Form.Range
              disabled={isDisabled}
              value={zoom}
              onChange={handleZoomChange}
              min={0.1}
              max={5}
              step={0.1}
            />
            <Button disabled={isDisabled} onClick={handleZoomInClick}>
              <FiZoomIn />
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="d-flex">
            <Button disabled={isDisabled} onClick={handleRotateLeftClick}>
              <FiRotateCcw />
            </Button>
            <Form.Range
              disabled={isDisabled}
              value={rotate}
              onChange={handleRotateChange}
              min={-180}
              max={180}
              step={90}
            />
            <Button disabled={isDisabled} onClick={handleRotateRightClick}>
              <FiRotateCw />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <Button disabled={isDisabled} onClick={handleFlipVertical}>
              Lật dọc
            </Button>
            <Button disabled={isDisabled} onClick={handleFlipHorizontal}>
              Lật ngang
            </Button>
            <Button disabled={isDisabled} onClick={handleReset}>
              Reset
            </Button>
            <Button disabled={isDisabled} onClick={handleOpenImageSelector}>
              Đổi hình
            </Button>
            <Button disabled={isDisabled} onClick={handleDownloadImage}>
              Tải hình
            </Button>
          </Col>
        </Row>
      </Container>
      <div className="upload-file">
        <FileBase64 onDone={handleChangeImage} />
      </div>
    </Wrapper>
  );
}

export default App;
