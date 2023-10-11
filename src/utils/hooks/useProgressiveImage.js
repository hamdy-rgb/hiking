import { useState, useEffect } from "react";

const useProgressiveImage = src => {
  const [sourceLoaded, setSourceLoaded] = useState(null);
  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => setSourceLoaded(src);
  }, [src]);

  return sourceLoaded;
};

export default useProgressiveImage;
