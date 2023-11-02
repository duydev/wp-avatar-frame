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

const ZOOM_STEP = 10;

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
`;

function App() {
  const cropRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(50); // %

  const handleScaleChange = e => {
    if (!ready) {
      return;
    }

    const newValue = +e.target.value;

    setScale(newValue);
  };

  const handleZoomOutClick = () => {
    if (!ready) {
      return;
    }

    let newValue = scale - ZOOM_STEP;
    newValue = newValue < 0 ? 0 : newValue;

    setScale(newValue);
  };

  const handleZoomInClick = () => {
    if (!ready) {
      return;
    }

    let newValue = scale + ZOOM_STEP;
    newValue = newValue > 100 ? 100 : newValue;

    setScale(newValue);
  };

  useEffect(() => {
    const image = document.getElementById('image');

    cropRef.current = new Cropper(image, {
      viewMode: 3,
      dragMode: 'move',
      initialAspectRatio: 1,
      aspectRatio: 1,
      responsive: true,
      checkCrossOrigin: false,
      guides: false,
      center: false,
      highlight: false,
      background: false,
      autoCrop: false,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      ready: () => {
        console.log('READY');
        setReady(true);
      }
    });

    console.log('MOUNTED');

    return () => {
      cropRef.current.destroy();
      console.log('UNMOUNTED');
    };
  }, []);

  useEffect(() => {
    cropRef.current.scale(scale * 0.02);
  }, [scale]);

  return (
    <Wrapper>
      <Container>
        <Row>
          <Col>
            <div className="image-wrapper">
              <img id="image" src={defaultImage} alt="image" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button disabled={!ready} onClick={handleZoomOutClick}>
              Thu nhỏ
            </Button>
          </Col>
          <Col>
            <Form.Range
              disabled={!ready}
              value={scale}
              onChange={handleScaleChange}
            />
          </Col>
          <Col>
            <Button disabled={!ready} onClick={handleZoomInClick}>
              Phóng lớn
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button disabled={!ready} onClick={handleZoomOutClick}>
              Xoay trái
            </Button>
          </Col>
          <Col>
            <Form.Range
              disabled={!ready}
              value={scale}
              onChange={handleScaleChange}
            />
          </Col>
          <Col>
            <Button disabled={!ready} onClick={handleZoomInClick}>
              Xoay phải
            </Button>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default App;
