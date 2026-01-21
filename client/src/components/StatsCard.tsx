import React from 'react';
import '../css/stats-card.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = 'neutral',
  color = 'blue' 
}) => {
  return (
    <div className={`stats-card border-${color}`}>
      <div className="stats-card-content">
        <div className="stats-info">
          <h3 className="stats-title">{title}</h3>
          <p className="stats-value">{value}</p>
          {trend && (
            <span className={`stats-trend trend-${trendDirection}`}>
              {trend}
            </span>
          )}
        </div>
        <div className={`stats-icon-container bg-${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;