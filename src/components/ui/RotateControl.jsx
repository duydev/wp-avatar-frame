import { FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const RotateControl = ({ 
  rotate, 
  onRotateChange, 
  onRotateLeftClick, 
  onRotateRightClick 
}) => {
  return (
    <div className="d-flex align-items-center">
      <Button 
        variant="outline-secondary" 
        size="sm"
        className="me-2" 
        onClick={onRotateLeftClick}
      >
        <FiRotateCcw />
      </Button>
      <Form.Range
        className="flex-grow-1 mx-2"
        title="rotate"
        value={rotate}
        onChange={onRotateChange}
        min={-180}
        max={180}
        step={90}
      />
      <Button 
        variant="outline-secondary" 
        size="sm"
        className="ms-2" 
        onClick={onRotateRightClick}
      >
        <FiRotateCw />
      </Button>
    </div>
  );
};

export default RotateControl; 