import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FiRefreshCw, FiDownload, FiImage } from 'react-icons/fi';
import { BiExpandVertical, BiExpandHorizontal } from 'react-icons/bi';

const ActionButtons = ({ 
  onFlipVertical, 
  onFlipHorizontal, 
  onReset, 
  onOpenImageSelector, 
  onDownloadImage 
}) => {
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <ButtonGroup size="sm" className="mb-2">
        <Button variant="outline-secondary" onClick={onFlipVertical}>
          <BiExpandVertical className="me-1" /> Flip Vertical
        </Button>
        <Button variant="outline-secondary" onClick={onFlipHorizontal}>
          <BiExpandHorizontal className="me-1" /> Flip Horizontal
        </Button>
      </ButtonGroup>
      
      <ButtonGroup size="sm" className="mb-2">
        <Button variant="outline-secondary" onClick={onReset}>
          <FiRefreshCw className="me-1" /> Reset
        </Button>
        <Button variant="outline-primary" onClick={onOpenImageSelector}>
          <FiImage className="me-1" /> Change Image
        </Button>
        <Button variant="primary" onClick={onDownloadImage} title="download">
          <FiDownload className="me-1" /> Download
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default ActionButtons; 