import React from 'react';
import '../css/achievement.css';

interface AchievementProps {
  title: string;
  description: string;
  badgeSrc: string;
  progress: number;
  maxProgress?: number;
}

const Achievement: React.FC<AchievementProps> = ({
  title,
  description,
  badgeSrc,
  progress,
  maxProgress = 100,
}) => {
  const progressPercent = Math.min(Math.max(progress, 0), maxProgress) / maxProgress * 100;

  return (
    <div className="achievement-container">
      <img src={badgeSrc} alt={title} className="achievement-badge" />
      <div className="achievement-info">
        <div className="achievement-title">{title}</div>
        <div className="achievement-description">{description}</div>
        <div className="achievement-progress-wrapper">
          <div className="achievement-progress-bar">
            <div
              className="achievement-progress"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="achievement-progress-text">{Math.round(progressPercent)}%</div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
