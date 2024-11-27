import React, {useEffect, useState} from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';


function LineChart ({
  data,
  index,
}) {

  const colors = ["#f7b733" , "#3498db",  "#2ecc71"];
  const color = colors[index % colors.length];

  const gradientId = `colorValue-${index}`;

  const [currentValue, setCurrentValue] = useState(0);
  const [hasIncreased, setHasIncreased] = useState(false);

  useEffect(() => {
    const currentValue = data.info[data.info.length - 1].value;
    const lastValue = data.info[data.info.length - 2].value;

    setCurrentValue(currentValue);
    setHasIncreased(currentValue >= lastValue);
    
  }, [data])


  return (
    <div className="orders-card">
      <div className="header">
        <h3>{data.type}</h3>
        <div className="stats">
          <span className={`value ${hasIncreased ? "arrow-up" : "arrow-down"}`}>{currentValue}</span>
          { hasIncreased ? 
          <span className="arrow-up">▲</span> : 
          <span className="arrow-down">▼</span> } 
        </div>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={data.info}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" hide />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
