import { useState, useRef } from 'react';
import loRound from 'lodash/round';
import { saveAs } from 'file-saver';

export const useImageEditor = () => {
  const frameRef = useRef(null);
  const cropperRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);

  const handleCropperReady = (cropper) => {
    cropperRef.current = cropper;
    setIsDisabled(false);
  };

  const updateImage = (imageDataURL) => {
    if (cropperRef.current) {
      cropperRef.current.replace(imageDataURL);
    }
  };

  const doZoom = val => {
    const newVal = loRound(+val, 1);

    if (newVal >= 0.1 && newVal <= 5) {
      cropperRef.current?.zoomTo(newVal);
      setZoom(newVal);
    }
  };

  const doRotate = val => {
    const newVal = loRound(+val);

    if (newVal >= -180 && newVal <= 180) {
      cropperRef.current?.rotateTo(newVal);
      setRotate(newVal);
    }
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
    doRotate(+e.target.value);
  };

  const handleRotateLeftClick = () => {
    doRotate(rotate - 90);
  };

  const handleRotateRightClick = () => {
    doRotate(rotate + 90);
  };

  const handleFlipHorizontal = () => {
    if (!cropperRef.current) return;
    const { scaleX, scaleY } = cropperRef.current.getData();
    const newScaleX = -1 * scaleX;
    cropperRef.current.scale(newScaleX, scaleY);
  };

  const handleFlipVertical = () => {
    if (!cropperRef.current) return;
    const { scaleX, scaleY } = cropperRef.current.getData();
    const newScaleY = -1 * scaleY;
    cropperRef.current.scale(scaleX, newScaleY);
  };

  const handleReset = () => {
    setZoom(1);
    setRotate(0);
    if (cropperRef.current) {
      cropperRef.current.reset();
    }
  };

  const handleDownloadImage = (framePhotoURL) => {
    if (!cropperRef.current || !frameRef.current) {
      console.error("Cropper or frame reference not available");
      return;
    }
    
    try {
      // First, get the cropped canvas from Cropper.js
      const croppedCanvas = cropperRef.current.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });
      
      if (!croppedCanvas) {
        console.error("Failed to get cropped canvas");
        return;
      }
      
      // Get the hidden canvas context
      const ctx = frameRef.current.getContext('2d');
      ctx.clearRect(0, 0, 1000, 1000);
      
      // Load and draw the cropped user image
      const userImage = new Image();
      userImage.crossOrigin = "Anonymous"; // Try to handle CORS issues
      
      userImage.onload = () => {
        // Draw user image on the canvas
        ctx.drawImage(userImage, 0, 0, 1000, 1000);
        
        // Now load and draw the frame image on top
        const frameImage = new Image();
        frameImage.crossOrigin = "Anonymous"; // Try to handle CORS issues
        
        frameImage.onload = () => {
          // Draw frame on top of user image
          ctx.drawImage(frameImage, 0, 0, 1000, 1000);
          
          try {
            // Get the final image as a blob instead of data URL
            frameRef.current.toBlob((blob) => {
              if (!blob) {
                console.error("Failed to create blob from canvas");
                return;
              }
              
              // Use FileSaver to download the image
              saveAs(blob, `photo-frame-${Date.now()}.png`);
            }, 'image/png', 1);
          } catch (e) {
            console.error("Error generating download:", e);
            
            // Fallback method for browsers that don't support toBlob
            try {
              const dataURL = frameRef.current.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `photo-frame-${Date.now()}.png`;
              link.href = dataURL;
              link.click();
            } catch (fallbackError) {
              console.error("Fallback download failed:", fallbackError);
            }
          }
        };
        
        // Handle errors loading the frame image
        frameImage.onerror = () => {
          console.error("Error loading frame image");
        };
        
        frameImage.src = framePhotoURL;
      };
      
      // Handle errors loading the user image
      userImage.onerror = () => {
        console.error("Error loading user image");
      };
      
      // Set source of the user image to the cropped canvas data URL
      userImage.src = croppedCanvas.toDataURL('image/png');
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return {
    frameRef,
    cropperRef,
    isDisabled,
    zoom,
    rotate,
    handleCropperReady,
    updateImage,
    handleZoomChange,
    handleZoomOutClick,
    handleZoomInClick,
    handleRotateChange,
    handleRotateLeftClick,
    handleRotateRightClick,
    handleFlipHorizontal,
    handleFlipVertical,
    handleReset,
    handleDownloadImage
  };
}; 