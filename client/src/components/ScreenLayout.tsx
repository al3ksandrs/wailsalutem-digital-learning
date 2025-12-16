import React from 'react';
import type { ReactNode } from 'react';
import '../css/screen-layout.css';

interface ScreenLayoutProps {
  greeting?: string;
  leftContent: ReactNode;
  rightContent: ReactNode;
  rightTitle?: string;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ 
  greeting, 
  leftContent, 
  rightContent,
  rightTitle 
}) => {
  return (
    <div className="layout-container">
      {greeting && (
        <div className="layout-header">
          <h1 className="layout-greeting">{greeting}</h1>
        </div>
      )}

      {rightTitle && (
        <div className="layout-right-title">
          <h2 className="section-title">{rightTitle}</h2>
        </div>
      )}

      {/* Left content */}
      <div className="layout-left">
        {leftContent}
      </div>

      {/* Right content */}
      <div className="layout-right">
        {rightContent}
      </div>
    </div>
  );
};

export default ScreenLayout;