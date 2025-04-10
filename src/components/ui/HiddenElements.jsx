import FileBase64 from 'react-file-base64';

const HiddenElements = ({ onFileChange, canvasRef }) => {
  return (
    <div className="hidden">
      <FileBase64 onDone={onFileChange} />
      <canvas ref={canvasRef} height={1000} width={1000} />
    </div>
  );
};

export default HiddenElements; 