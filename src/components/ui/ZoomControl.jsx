import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ZoomControl = ({ 
  zoom, 
  onZoomChange, 
  onZoomInClick, 
  onZoomOutClick 
}) => {
  return (
    <div className="d-flex align-items-center">
      <Button 
        variant="outline-secondary" 
        size="sm"
        className="me-2" 
        onClick={onZoomOutClick}
      >
        <FiZoomOut />
      </Button>
      <Form.Range
        className="flex-grow-1 mx-2"
        title="zoom"
        value={zoom}
        onChange={onZoomChange}
        min={0.1}
        max={5}
        step={0.1}
      />
      <Button 
        variant="outline-secondary" 
        size="sm"
        className="ms-2" 
        onClick={onZoomInClick}
      >
        <FiZoomIn />
      </Button>
    </div>
  );
};

export default ZoomControl; 