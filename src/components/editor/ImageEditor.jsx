import { useEffect, useState, useRef } from 'react';
import Cropper from 'cropperjs';
import Image from '../ui/Image';
import 'cropperjs/dist/cropper.css';

const ImageEditor = ({ 
  userPhotoURL, 
  framePhotoURL, 
  onCropperReady,
  defaultUserImage,
  defaultFrameImage 
}) => {
  const imageWrapperRef = useRef(null);
  const cropperRef = useRef(null);
  const imageElement = useRef(null);
  const [height, setHeight] = useState(0);
  const [cropperInitialized, setCropperInitialized] = useState(false);

  // Handle window resize to maintain aspect ratio
  useEffect(() => {
    const updateHeight = () => {
      if (imageWrapperRef.current) {
        setHeight(imageWrapperRef.current.offsetWidth);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Initialize cropper once when component mounts
  useEffect(() => {
    const initCropper = () => {
      if (cropperRef.current || !imageElement.current) return;
      
      // Create new cropper instance
      cropperRef.current = new Cropper(imageElement.current, {
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
          setCropperInitialized(true);
          if (onCropperReady) {
            onCropperReady(cropperRef.current);
          }
        }
      });
    };

    // Delay initialization to ensure the image is loaded
    const timer = setTimeout(() => {
      initCropper();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
        setCropperInitialized(false);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Update image when userPhotoURL changes
  useEffect(() => {
    if (cropperInitialized && cropperRef.current && userPhotoURL) {
      cropperRef.current.replace(userPhotoURL);
    }
  }, [userPhotoURL, cropperInitialized]);

  // Set image element ref when the image is loaded
  const handleImageLoad = (event) => {
    imageElement.current = event.target;
  };

  return (
    <div className="p-3 bg-light rounded">
      <h4 className="mb-3 text-center">Image Editor</h4>
      <div 
        className="position-relative mx-auto"
        style={{ 
          maxWidth: '100%',
          margin: '0 auto',
          height,
          maxWidth: window.innerWidth >= 992 ? '90%' : '100%'
        }}
        ref={imageWrapperRef}
      >
        <Image
          className="photo-frame w-100 position-absolute"
          style={{ zIndex: 1, pointerEvents: 'none' }}
          src={framePhotoURL}
          defaultSrc={defaultFrameImage}
          type="frame"
          alt="Photo frame"
        />
        <Image
          className="user-photo d-block w-100"
          id="image"
          src={userPhotoURL}
          defaultSrc={defaultUserImage}
          type="user"
          alt="User photo"
          onLoad={handleImageLoad}
        />
      </div>
    </div>
  );
};

export default ImageEditor; 