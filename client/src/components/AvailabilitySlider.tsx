import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import '../css/availability-slider.css';

interface AvailabilitySliderProps {
  day: string;
  active: boolean;
  value?: number[];
  onChange?: (value: number[]) => void;
  onActiveChange?: (active: boolean) => void;
}
const AvailabilitySlider: React.FC<AvailabilitySliderProps> = ({
  day,
  active,
  value = [9, 17],
  onChange,
  onActiveChange,
}) => {
  const [range, setRange] = useState<number[]>(value);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (!active) return;

    const val = newValue as number[];
    setRange(val);
    onChange?.(val);
  };

  const formatTimeLabel = (val: number) => {
    const hours = Math.floor(val);
    const minutes = Math.round((val % 1) * 60);
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minStr}`;
  };

  return (
    <div
      className={`availability-slider-container ${
        active ? "" : "is-inactive"
      }`}
    >
      <div className="day-label">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => onActiveChange?.(e.target.checked)}
          />
          &nbsp;{day}
        </label>
      </div>

      <div className="slider-wrapper">
        <Slider
          className="availability-slider"
          value={range}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={formatTimeLabel}
          min={8}
          max={20}
          step={0.25}
          disabled={!active}
        />

        <div className="selected-time">
          {formatTimeLabel(range[0])} - {formatTimeLabel(range[1])}
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySlider;