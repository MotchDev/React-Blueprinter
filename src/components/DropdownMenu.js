import React, { useRef, useState, useEffect } from "react";
import "styles/dropdownMenu.scss";

const DropdownMenu = ({ children, buttonText, buttonIcon, onClose }) => {
  const node = useRef();
  const [open, setOpen] = useState();

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClick(clickCallback, closeMenu) {
    clickCallback();
    if (closeMenu) {
      handleClose();
    }
  }
  function handleClickOutside(e) {
    if (!node.current.contains(e.target)) {
      handleClose();
    }
  }

  function handleClose() {
    onClose && onClose();
    setOpen(false);
  }

  function recursiveMap(children, fn) {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      if (child.props.children) {
        child = React.cloneElement(child, {
          children: recursiveMap(child.props.children, fn),
        });
      }

      return fn(child);
    });
  }

  return (
    <div ref={node} className="dropdown">
      <button className="dropdown-button" onClick={(e) => setOpen(!open)}>
        {buttonIcon && <img src={buttonIcon} alt="menu icon" />}
        {buttonText && buttonText}
      </button>
      {open && (
        <div className="dropdown-menu">
          {recursiveMap(children, (child) =>
            React.cloneElement(child, {
              onClick: () =>
                handleClick(child.props.onClick, !child.props.keepMenuOpen),
            })
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
