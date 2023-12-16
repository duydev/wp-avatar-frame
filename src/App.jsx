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
import loGet from 'lodash/get';
import FileBase64 from 'react-file-base64';
import { saveAs } from 'file-saver';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'cropperjs/dist/cropper.css';

import { listAllPhotoFrames } from './service';

import defaultImage from './assets/default.png';
import frameImage from './assets/frame.png';

const Wrapper = styled.div`
  max-width: 600px;

  .image-wrapper {
    max-width: 100%;

    position: relative;

    .photo-frame {
      width: 100%;
      position: absolute;
      z-index: 1;
      pointer-events: none;
    }

    .user-photo {
      display: block;
      width: 100%;
    }
  }

  .d-flex.col {
    gap: 10px;
  }

  .hidden {
    display: none;
  }
`;

function App() {
  const cropRef = useRef(null);
  const frameRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const [userPhotoURL, setUserPhotoURL] = useState(null);
  const [framePhotoURL, setFramePhotoURL] = useState(null);

  const [isDisabled, setIsDisabled] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [height, setHeight] = useState(0);

  const doZoom = val => {
    if (isDisabled) return;

    const newVal = loRound(+val, 1);

    if (newVal >= 0.1 && newVal <= 5) {
      // console.log('ZOOM TO', newVal);

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

    // console.log('OPEN IMAGE SELECTOR');

    document.querySelector('.hidden input[type="file"]').click();
  };

  const handleChangeImage = file => {
    if (isDisabled) return;

    const imageDataURL = file.base64;

    // console.log('CHANGE NEW IMAGE', { imageDataURL });

    setUserPhotoURL(imageDataURL);

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

    // console.log('FLIP HORIZONTAL', { newScaleX, scaleX, scaleY });

    cropRef.current.scale(newScaleX, scaleY);
  };

  const handleFlipVertical = () => {
    const { scaleX, scaleY } = cropRef.current.getData();
    const newScaleY = -1 * scaleY;

    // console.log('FLIP VERTICAL', { newScaleY, scaleX, scaleY });

    cropRef.current.scale(scaleX, newScaleY);
  };

  const handleReset = () => {
    // console.log('RESET');

    setZoom(1);
    setRotate(0);
    cropRef.current.reset();
  };

  const handleDownloadImage = () => {
    cropRef.current.crop();

    const ctx = frameRef.current.getContext('2d');

    ctx.clearRect(0, 0, 1000, 1000);

    const img1 = new Image();
    img1.onload = () => {
      ctx.drawImage(img1, 0, 0, 1000, 1000);

      const img2 = new Image();
      img2.onload = () => {
        ctx.drawImage(img2, 0, 0, 1000, 1000);

        const data = frameRef.current.toDataURL();

        saveAs(data, `img-${Date.now()}.png`);
      };
      img2.src = framePhotoURL;
    };
    img1.src = cropRef.current.getCroppedCanvas().toDataURL();

    // console.log(cropRef.current.getCroppedCanvas().toDataURL());

    // window.open(, '_blank');
  };

  useEffect(() => {
    // console.log('MOUNTED');

    listAllPhotoFrames().then(frames => {
      const userPhoto = document
        .getElementById('ctxh-avatar-frame')
        .getAttribute('data-user-photo');

      const framePhoto = loGet(frames, '[0].url');

      console.log(frames, framePhoto);

      setUserPhotoURL(userPhoto || defaultImage);
      setFramePhotoURL(framePhoto || frameImage);

      setHeight(imageWrapperRef.current.offsetWidth);

      addEventListener('resize', () => {
        setHeight(imageWrapperRef.current.offsetWidth);
      });

      setTimeout(() => {
        // console.log('INIT CROPPER');

        if (!cropRef.current) {
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
              // console.log('READY');

              setIsDisabled(false);
            }
          });
        }
      }, 0);
    });

    return () => {
      // console.log('UNMOUNTED');

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
              <img
                className="photo-frame"
                src={framePhotoURL}
                alt="Photo frame"
              />
              <img
                className="user-photo"
                id="image"
                src={userPhotoURL}
                alt="User photo"
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="d-flex">
            <Button disabled={isDisabled} onClick={handleZoomOutClick}>
              <FiZoomOut />
            </Button>
            <Form.Range
              title="zoom"
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
              title="rotate"
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
            <Button
              disabled={isDisabled}
              onClick={handleDownloadImage}
              title="download"
            >
              Tải hình
            </Button>
          </Col>
        </Row>
      </Container>
      <div className="hidden">
        <FileBase64 onDone={handleChangeImage} />
        <canvas ref={frameRef} height={1000} width={1000} />
      </div>
    </Wrapper>
  );
}

export default App;
