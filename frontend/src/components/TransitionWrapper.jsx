import React from 'react';
import PropTypes from 'prop-types';
import { Fade, Grow, Slide } from '@mui/material';

const TransitionWrapper = ({ children, type = 'fade', timeout = 300, direction = 'up', ...props }) => {
  const getTransitionComponent = () => {
    switch (type) {
      case 'fade':
        return (
          <Fade timeout={timeout} {...props}>
            {children}
          </Fade>
        );
      case 'grow':
        return (
          <Grow timeout={timeout} {...props}>
            {children}
          </Grow>
        );
      case 'slide':
        return (
          <Slide direction={direction} timeout={timeout} {...props}>
            {children}
          </Slide>
        );
      default:
        return children;
    }
  };

  return getTransitionComponent();
};

TransitionWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['fade', 'grow', 'slide']),
  timeout: PropTypes.number,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
  in: PropTypes.bool,
};

TransitionWrapper.defaultProps = {
  type: 'fade',
  timeout: 300,
  direction: 'up',
  in: true,
};

export default TransitionWrapper; 