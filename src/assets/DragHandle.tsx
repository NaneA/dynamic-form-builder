import React from 'react';

const DragHandle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    fill="gray"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="5" cy="5" r="2" />
    <circle cx="5" cy="10" r="2" />
    <circle cx="5" cy="15" r="2" />
    <circle cx="10" cy="5" r="2" />
    <circle cx="10" cy="10" r="2" />
    <circle cx="10" cy="15" r="2" />
  </svg>
);

export default DragHandle;
