import { useState, useEffect } from 'react';
import defaultUserImage from '../../assets/default.png';
import defaultFrameImage from '../../assets/frame.png';

/**
 * Reusable Image component with error handling and fallback
 * @param {string} src - Primary image source
 * @param {string} defaultSrc - Fallback image source if primary fails to load
 * @param {string} alt - Image alt text
 * @param {string} type - Image type ('frame' or 'user') to use appropriate default
 * @param {string} className - CSS class
 * @param {string} id - Element ID
 */
const Image = ({ 
  src, 
  defaultSrc, 
  alt, 
  type,
  className, 
  id,
  ...props 
}) => {
  // Determine the correct default image if defaultSrc is not provided
  const getDefaultSrc = () => {
    if (defaultSrc) return defaultSrc;
    
    if (type === 'frame') return defaultFrameImage;
    if (type === 'user') return defaultUserImage;
    
    return null;
  };

  const finalDefaultSrc = getDefaultSrc();
  const [imageSrc, setImageSrc] = useState(src || finalDefaultSrc);

  useEffect(() => {
    setImageSrc(src || finalDefaultSrc);
  }, [src, finalDefaultSrc]);

  const handleError = () => {
    if (imageSrc !== finalDefaultSrc && finalDefaultSrc) {
      console.warn(`Image failed to load: ${alt}, falling back to default image`);
      setImageSrc(finalDefaultSrc);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      id={id}
      onError={handleError}
      {...props}
    />
  );
};

export default Image; 