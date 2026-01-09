import React, { useEffect, useState } from 'react';

interface ContextMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  onClose: () => void;
  position: { x: number; y: number };
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ items, onClose, position }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleClickOutside = () => {
      setIsVisible(false);
      setTimeout(onClose, 150); // Delay closing to allow fade-out animation
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  // Calculate position to prevent menu from going off-screen
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      // Adjust X position if menu goes off right edge
      if (position.x + menuRect.width > viewportWidth) {
        adjustedX = viewportWidth - menuRect.width - 5;
      }

      // Adjust Y position if menu goes off bottom edge
      if (position.y + menuRect.height > viewportHeight) {
        adjustedY = viewportHeight - menuRect.height - 5;
      }

      // Prevent menu from going off left/top edges
      adjustedX = Math.max(5, adjustedX);
      adjustedY = Math.max(5, adjustedY);

      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    }
  }, [position]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-gray-800 border border-gray-700 rounded shadow-lg py-1 min-w-[160px] max-w-xs"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        transform: 'translateY(0)',
      }}
    >
      <ul className="divide-y divide-gray-700">
        {items.map((item, index) => (
          <li key={index}>
            <button
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                item.danger ? 'text-red-400 hover:text-red-300' : 'text-gray-200'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};