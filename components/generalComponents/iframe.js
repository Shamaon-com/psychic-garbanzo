import React, { useState, useEffect, useRef } from "react";

export default function Iframe({ ...props }) {
  const [src, setSrc] = useState("");
  const parentRef = useRef(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  /**
   * 
   * recives:
   *  - src (required)
   */

  useEffect(() => {
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSrc(props.src);
    handleResize();
    
  }, [props.src]);

  const solveResize = (parentWidth, parentHeight) => {
    if (1.69 < parentWidth / parentHeight > 1.72) {
      return [parentWidth, parentHeight];
    } else if (parentWidth > parentHeight) {
      while (parentWidth < parentHeight * 1.7) {
        parentHeight--;
      }
    } else if (parentHeight > parentWidth) {
      parentHeight = parentWidth / 1.7;
    }

    return [parentWidth, parentWidth / 1.7];
  };

  const handleResize = () => {
    if (parentRef.current) {
      const parentWidth = parentRef.current.offsetWidth;
      const parentHeight = parentRef.current.offsetHeight;
      const [width, height] = solveResize(parentWidth, parentHeight);
      setWidth(width);
      setHeight(height);
    }
  };

  return (

      <div
        ref={parentRef}
        className="w-full h-full"
      >
        <iframe
          className="z-10"
          src={src}
          scrolling="no"
          frameBorder="1"
          marginHeight="0px"
          marginwidth="0px"
          width="100%"
          height={height}
          allowfullscreen
        />
      </div>
  );
}
