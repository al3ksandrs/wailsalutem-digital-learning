import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import '../css/availability-slider.css';

interface AvailabilitySliderProps {
  day: string;
  value?: number[];
  onChange?: (value: number[]) => void;
}

const AvailabilitySlider: React.FC<AvailabilitySliderProps> = ({
  day,
  value = [9, 17],
  onChange
}) => {
  const [range, setRange] = useState<number[]>(value);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    const val = newValue as number[];
    setRange(val);
    onChange && onChange(val);
  };

  const formatTimeLabel = (val: number) => {
    const hours = Math.floor(val);
    const minutes = Math.round((val % 1) * 60);
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minStr}`;
  };

  return (
        <div className="availability-slider-container">
            <div className="day-label">{day}</div>
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
                    />
                    <div className="selected-time">
                    {formatTimeLabel(range[0])} - {formatTimeLabel(range[1])}
                </div>
            </div>
        </div>
  );
};

export default AvailabilitySlider;
