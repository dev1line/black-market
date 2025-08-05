'use client';

import React, { useState, useRef } from 'react';

interface DropDownMenuProps {
  title: string;
  classes?: string;
  buttonClasses?: string;
  children: React.ReactNode;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  title,
  classes,
  buttonClasses,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleDropdownContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't close the dropdown when clicking inside the content
  };

  return (
    <li
      ref={dropdownRef}
      className={`dropdown-menu ${classes ? classes : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`dropdown-button ${buttonClasses ? buttonClasses : ''}`}
        style={{
          backgroundImage: `url('/images/black-market/ButtonDrop.png')`,
          width: '225px',
          height: '50px',
          color: 'black',
          borderRadius: '16px',
        }}
        onClick={handleButtonClick}
      >
        <span
          style={{
            color: '#fff',
            fontWeight: 'bold',
            textShadow:
              '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
          }}
        >
          {title}
        </span>
      </button>
      {isOpen && (
        <div className="dropdown-inner" onClick={handleDropdownContentClick}>
          {children}
        </div>
      )}
    </li>
  );
};

export default DropDownMenu;
