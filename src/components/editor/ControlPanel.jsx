import ZoomControl from '../ui/ZoomControl';
import RotateControl from '../ui/RotateControl';
import ActionButtons from '../ui/ActionButtons';
import HiddenElements from '../ui/HiddenElements';

const ControlPanel = ({
  zoom,
  rotate,
  onZoomChange,
  onZoomOutClick,
  onZoomInClick,
  onRotateChange,
  onRotateLeftClick,
  onRotateRightClick,
  onFlipVertical,
  onFlipHorizontal,
  onReset,
  onOpenImageSelector,
  onDownloadImage,
  onFileChange,
  canvasRef
}) => {
  return (
    <div className="control-panel p-3 bg-light rounded h-100 d-lg-flex flex-column justify-content-center">
      <div className="mb-4">
        <h5>Zoom</h5>
        <ZoomControl 
          zoom={zoom}
          onZoomChange={onZoomChange}
          onZoomOutClick={onZoomOutClick}
          onZoomInClick={onZoomInClick}
        />
      </div>
      
      <div className="mb-4">
        <h5>Rotation</h5>
        <RotateControl 
          rotate={rotate}
          onRotateChange={onRotateChange}
          onRotateLeftClick={onRotateLeftClick}
          onRotateRightClick={onRotateRightClick}
        />
      </div>
      
      <div className="mb-4">
        <h5>Actions</h5>
        <ActionButtons 
          onFlipVertical={onFlipVertical}
          onFlipHorizontal={onFlipHorizontal}
          onReset={onReset}
          onOpenImageSelector={onOpenImageSelector}
          onDownloadImage={onDownloadImage}
        />
      </div>
      
      <HiddenElements 
        onFileChange={onFileChange}
        canvasRef={canvasRef}
      />
    </div>
  );
};

export default ControlPanel; 