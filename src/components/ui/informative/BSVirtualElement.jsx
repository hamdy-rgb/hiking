import React, { useRef } from "react";
import { Button, Tooltip } from "@mui/material";
import PropTypes from "prop-types";

const BSVirtualElement = ({ title, description, children, ...props }) => {
  const positionRef = useRef({
    x: 0,
    y: 0,
  });

  const popperRef = useRef(null);
  const areaRef = useRef(null);

  const handleMouseMove = event => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };

  return (
    <Tooltip
      title={description}
      placement="top"
      arrow
      PopperProps={{
        popperRef,
        anchorEl: {
          getBoundingClientRect: () => {
            return new DOMRect(
              positionRef.current.x,
              areaRef.current.getBoundingClientRect().y,
              0,
              0,
            );
          },
        },
      }}
    >
      <Button {...props} ref={areaRef} onMouseMove={handleMouseMove}>
        {children}
      </Button>
    </Tooltip>
  );
};

export default BSVirtualElement;

BSVirtualElement.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
