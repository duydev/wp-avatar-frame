import { useEffect, useState, useRef } from 'react';
import Cropper from 'cropperjs';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { toRatio, toZoom, toDegree } from './utils';
import { FiZoomIn, FiZoomOut, FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import loRound from 'lodash/round';
import FileBase64 from 'react-file-base64';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'cropperjs/dist/cropper.css';

import defaultImage from './assets/default.png';

const Wrapper = styled.div`
  max-width: 600px;

  .image-wrapper {
    border: 1px solid red;
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
  const [zoom, setZoom] = useState(50);
  const [rotate, setRotate] = useState(50);
  const [height, setHeight] = useState(0);

  const handleOpenImageSelector = () => {
    console.log('OPEN IMAGE SELECTOR');

    document.querySelector('.upload-file input[type="file"]').click();
  };

  const handleZoomChange = e => {
    if (isDisabled) return;

    setZoom(+e.target.value);
  };

  const handleZoomOutClick = () => {
    if (isDisabled) return;

    setZoom(zoom - 5);
  };

  const handleZoomInClick = () => {
    if (isDisabled) return;

    setZoom(zoom + 5);
  };

  const handleRotateChange = e => {
    if (isDisabled) return;

    setRotate(+e.target.value);
  };

  const handleRotateLeftClick = () => {
    if (isDisabled) return;

    const newRotate = rotate - 25;

    if (newRotate >= 0) {
      setRotate(newRotate);
    }
  };

  const handleRotateRightClick = () => {
    if (isDisabled) return;

    const newRotate = rotate + 25;

    if (newRotate <= 100) {
      setRotate(newRotate);
    }
  };

  const handleFlipHorizontal = () => {
    const { scaleX, scaleY } = cropRef.current.getData();
    const newScaleX = -1 * scaleX;

    cropRef.current.scale(newScaleX, scaleY);
  };

  const handleFlipVertical = () => {
    const { scaleX, scaleY } = cropRef.current.getData();
    const newScaleY = -1 * scaleY;

    cropRef.current.scale(scaleX, newScaleY);
  };

  const handleReset = () => {
    console.log('RESET');

    setZoom(50);
    setRotate(50);
    cropRef.current.scale(1, 1);
  };

  const handleChangeImage = file => {
    const imageDataURL = file.base64;

    console.log('CHANGE NEW IMAGE', { imageDataURL });

    setImageURL(imageDataURL);
    setZoom(0);
    setRotate(0);

    cropRef.current.replace(imageDataURL);
  };

  const handleDownloadImage = () => {
    cropRef.current.crop();

    const data = cropRef.current.getCroppedCanvas().toDataURL();

    // cropRef.current.clear();

    console.log(data);
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
      initialAspectRatio: 1,
      aspectRatio: 1,
      responsive: true,
      checkCrossOrigin: false,
      guides: false,
      center: false,
      highlight: false,
      background: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      autoCrop: true,
      autoCropArea: 1,
      ready: () => {
        setZoom(50);
        setRotate(50);
        setIsDisabled(false);
        // cropRef.current.setCropBoxData({
        //   top: 0,
        //   left: 0,
        //   width: 300,
        //   height: 300
        // });
      },
      zoom: e => {
        const { ratio, originalEvent } = e.detail;
        const newRatio = loRound(ratio, 1);

        if (originalEvent) {
          e.preventDefault();

          setZoom(toZoom(newRatio));
          return;
        }

        if (newRatio > 5) {
          e.preventDefault();

          setZoom(100);
          return;
        }

        if (newRatio < 0.1) {
          e.preventDefault();

          setZoom(0);
          return;
        }
      }
    });

    return () => {
      console.log('UNMOUNTED');

      if (cropRef.current) {
        cropRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isDisabled) return;
    console.log('ZOOM TO', toRatio(zoom));

    try {
      cropRef.current.zoomTo(toRatio(zoom));
    } catch {
      //
    }
  }, [isDisabled, zoom]);

  useEffect(() => {
    if (isDisabled) return;
    console.log('ROTATE TO', toDegree(rotate));

    cropRef.current.rotateTo(toDegree(rotate));
  }, [isDisabled, rotate]);

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
