import { useMemo } from 'react';
import { getProgressData, getWpmStats } from '../wpmHistory';

export default function WpmGraph() {
  const data = useMemo(() => getProgressData(30), []);
  const stats = useMemo(() => getWpmStats(), []);

  if (data.length < 2) {
    return (
      <div className="wpm-graph-container">
        <h3>📈 Progress Chart</h3>
        <p className="graph-placeholder">
          Complete more typing tests to see your progress chart!
        </p>
      </div>
    );
  }

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxWpm = Math.max(...data.map(d => d.wpm), 50);
  const minWpm = Math.min(...data.map(d => d.wpm), 0);
  const wpmRange = maxWpm - minWpm || 1;

  const xScale = (index) => padding.left + (index / (data.length - 1)) * chartWidth;
  const yScale = (wpm) => padding.top + chartHeight - ((wpm - minWpm) / wpmRange) * chartHeight;

  // Generate path for the line
  const linePath = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.wpm);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate area path
  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  // Y-axis ticks
  const yTicks = [0, 25, 50, 75, 100].filter(t => t <= maxWpm + 10);

  return (
    <div className="wpm-graph-container">
      <h3>📈 Progress Chart</h3>
      
      <div className="wpm-stats-row">
        <div className="stat-box">
          <span className="stat-label">Average</span>
          <span className="stat-value">{stats.average} WPM</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Best</span>
          <span className="stat-value">{stats.best} WPM</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Trend</span>
          <span className={`stat-value ${stats.trend >= 0 ? 'positive' : 'negative'}`}>
            {stats.trend >= 0 ? '↗️' : '↘️'} {Math.abs(stats.trend)} WPM
          </span>
        </div>
      </div>

      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="wpm-graph"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {yTicks.map(tick => (
          <line
            key={tick}
            x1={padding.left}
            y1={yScale(tick)}
            x2={width - padding.right}
            y2={yScale(tick)}
            stroke="#e5e5e5"
            strokeDasharray="4"
          />
        ))}

        {/* Area under the line */}
        <path
          d={areaPath}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#2f6df5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(d.wpm)}
            r="5"
            fill="#2f6df5"
            stroke="#fff"
            strokeWidth="2"
          >
            <title>{d.date}: {d.wpm} WPM ({d.accuracy}% accuracy)</title>
          </circle>
        ))}

        {/* Y-axis labels */}
        {yTicks.map(tick => (
          <text
            key={tick}
            x={padding.left - 10}
            y={yScale(tick) + 4}
            textAnchor="end"
            fontSize="12"
            fill="#666"
          >
            {tick}
          </text>
        ))}

        {/* X-axis labels (show first, middle, last) */}
        {[0, Math.floor(data.length / 2), data.length - 1].map(i => (
          <text
            key={i}
            x={xScale(i)}
            y={height - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#666"
          >
            {data[i].date}
          </text>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2f6df5" />
            <stop offset="100%" stopColor="#2f6df5" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
