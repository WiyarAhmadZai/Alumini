import React from 'react';

const Card = ({ children, className = '', shadow = true, rounded = true }) => {
  const baseClasses = 'overflow-hidden';
  const shadowClasses = shadow ? 'shadow-md' : '';
  const roundedClasses = rounded ? 'rounded-lg' : '';
  
  const classes = `${baseClasses} ${shadowClasses} ${roundedClasses} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-50 px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-50 px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;