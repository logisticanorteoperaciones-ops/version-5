
import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  data: ChartData[];
}

const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  if (total === 0) {
      return (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-neutral-black mb-2">{title}</h3>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 140 140">
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="transparent"
                        stroke="#E0E0E0"
                        strokeWidth="15"
                    />
                </svg>
                <div className="absolute text-center">
                    <span className="text-3xl font-bold text-neutral-dark">0</span>
                    <span className="text-sm text-gray-500 block">Total</span>
                </div>
            </div>
             <p className="text-sm text-gray-500 mt-4">No hay datos disponibles.</p>
          </div>
      )
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-neutral-black mb-2">{title}</h3>
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          {data.map((item) => {
            if (item.value === 0) return null;
            const percent = (item.value / total) * 100;
            const offset = circumference - (accumulatedPercent / 100) * circumference;
            accumulatedPercent += percent;
            return (
              <circle
                key={item.label}
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="15"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-neutral-dark">{total}</span>
            <span className="text-sm text-gray-500">Total</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map(item => (
          <div key={item.label} className="flex items-center text-sm">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
            <span>{item.label}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
