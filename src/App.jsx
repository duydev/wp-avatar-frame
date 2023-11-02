import { useEffect, useState, useRef } from 'react';
import Cropper from 'cropperjs';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'cropperjs/dist/cropper.css';
import defaultImage from './assets/default-image.jpg';
import { toRatio, toZoom, toDegree } from './utils';
import { FiZoomIn, FiZoomOut, FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import loRound from 'lodash/round';
import FileBase64 from 'react-file-base64';

const Wrapper = styled.div`
  background-color: #000;

  .image-wrapper {
    width: 300px;
    height: 300px;

    img {
      display: block;
      max-width: 100%;
    }
  }

  .upload-file {
    display: none;
  }
`;

function App() {
  const cropRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [zoom, setZoom] = useState(50);
  const [rotate, setRotate] = useState(50);

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
    setZoom(50);
    setRotate(50);
    cropRef.current.scale(1, 1);
  };

  const handleOpenImageSelector = () => {
    document.querySelector('.upload-file input[type="file"]').click();
  };

  const handleChangeImage = file => {
    setZoom(0);
    setRotate(0);
    cropRef.current.replace(file.base64);
  };

  const handleDownloadImage = () => {
    cropRef.current.crop();

    const data = cropRef.current.getCroppedCanvas().toDataURL();

    // cropRef.current.clear();

    console.log(data);
  };

  useEffect(() => {
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
      ready: () => {
        setZoom(50);
        setRotate(50);
        setIsDisabled(false);
        cropRef.current.setCropBoxData({
          top: 0,
          left: 0,
          width: 300,
          height: 300
        });
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
      setIsDisabled(true);
      cropRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (isDisabled) return;

    try {
      cropRef.current.zoomTo(toRatio(zoom));
    } catch {
      //
    }
  }, [isDisabled, zoom]);

  useEffect(() => {
    if (isDisabled) return;

    cropRef.current.rotateTo(toDegree(rotate));
  }, [isDisabled, rotate]);

  return (
    <Wrapper>
      <Container className="m3">
        <Row className="m3">
          <Col>
            <div className="image-wrapper">
              <img id="image" src={defaultImage} alt="image" />
            </div>
          </Col>
        </Row>
        <Row className="m3">
          <Col>
            <Button disabled={isDisabled} onClick={handleZoomOutClick}>
              <FiZoomOut />
            </Button>
          </Col>
          <Col>
            <Form.Range
              disabled={isDisabled}
              value={zoom}
              onChange={handleZoomChange}
            />
          </Col>
          <Col>
            <Button disabled={isDisabled} onClick={handleZoomInClick}>
              <FiZoomIn />
            </Button>
          </Col>
        </Row>
        <Row className="m3">
          <Col>
            <Button disabled={isDisabled} onClick={handleRotateLeftClick}>
              <FiRotateCcw />
            </Button>
          </Col>
          <Col>
            <Form.Range
              disabled={isDisabled}
              value={rotate}
              onChange={handleRotateChange}
            />
          </Col>
          <Col>
            <Button disabled={isDisabled} onClick={handleRotateRightClick}>
              <FiRotateCw />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button disabled={isDisabled} onClick={handleFlipVertical}>
              Lật dọc
            </Button>
          </Col>
          <Col>
            <Button disabled={isDisabled} onClick={handleFlipHorizontal}>
              Lật ngang
            </Button>
          </Col>
          <Col>
            <Button disabled={isDisabled} onClick={handleReset}>
              Reset
            </Button>
          </Col>
          <Col>
            <Button disabled={isDisabled} onClick={handleOpenImageSelector}>
              Đổi hình
            </Button>
          </Col>
          <Col>
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
