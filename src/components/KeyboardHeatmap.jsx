import { useMemo } from 'react';
import { getHeatmapData, getHeatmapColor, getHeatmapOpacity, getWeakestKeys, getStrongestKeys } from '../keyboardStats';

const KEYBOARD_LAYOUT = [
  [{ key: 'q', finger: 'lp' }, { key: 'w', finger: 'lr' }, { key: 'e', finger: 'lm' }, { key: 'r', finger: 'li' }, { key: 't', finger: 'li' }, { key: 'y', finger: 'ri' }, { key: 'u', finger: 'ri' }, { key: 'i', finger: 'rm' }, { key: 'o', finger: 'rr' }, { key: 'p', finger: 'rp' }],
  [{ key: 'a', finger: 'lp' }, { key: 's', finger: 'lr' }, { key: 'd', finger: 'lm' }, { key: 'f', finger: 'li' }, { key: 'g', finger: 'li' }, { key: 'h', finger: 'ri' }, { key: 'j', finger: 'ri' }, { key: 'k', finger: 'rm' }, { key: 'l', finger: 'rr' }],
  [{ key: 'z', finger: 'lp' }, { key: 'x', finger: 'lr' }, { key: 'c', finger: 'lm' }, { key: 'v', finger: 'li' }, { key: 'b', finger: 'li' }, { key: 'n', finger: 'ri' }, { key: 'm', finger: 'ri' }]
];

export default function KeyboardHeatmap() {
  const heatmapData = useMemo(() => getHeatmapData(), []);
  const weakestKeys = useMemo(() => getWeakestKeys(3), []);
  const strongestKeys = useMemo(() => getStrongestKeys(3), []);

  const hasData = Object.keys(heatmapData).length > 0;

  if (!hasData) {
    return (
      <div className="keyboard-heatmap-container">
        <h3>⌨️ Keyboard Heatmap</h3>
        <p className="heatmap-placeholder">
          Type more to see which keys you need to practice!
        </p>
      </div>
    );
  }

  return (
    <div className="keyboard-heatmap-container">
      <h3>⌨️ Keyboard Heatmap</h3>
      
      <div className="heatmap-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#17c79d' }}></span>
          <span>Excellent (95%+)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#4bc0ff' }}></span>
          <span>Good (80-94%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ffd84d' }}></span>
          <span>Okay (60-79%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ff5f8d' }}></span>
          <span>Needs Practice (&lt;60%)</span>
        </div>
      </div>

      <div className="heatmap-keyboard">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="heatmap-row">
            {row.map(({ key }) => {
              const data = heatmapData[key];
              const accuracy = data ? data.accuracy : null;
              const total = data ? data.total : 0;
              const bgColor = getHeatmapColor(accuracy);
              const opacity = getHeatmapOpacity(accuracy, total);

              return (
                <div
                  key={key}
                  className="heatmap-key"
                  style={{
                    backgroundColor: bgColor,
                    opacity: opacity,
                    color: accuracy && accuracy < 60 ? '#fff' : '#0f2f46'
                  }}
                  title={data ? `${key.toUpperCase()}: ${accuracy}% accurate (${total} presses)` : `${key.toUpperCase()}: No data`}
                >
                  {key.toUpperCase()}
                  {data && <span className="key-accuracy">{accuracy}%</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="heatmap-insights">
        {weakestKeys.length > 0 && (
          <div className="insight-box weak">
            <h4>💪 Practice These</h4>
            <div className="insight-keys">
              {weakestKeys.map(({ char, accuracy }) => (
                <span key={char} className="insight-key">
                  {char.toUpperCase()} ({accuracy}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {strongestKeys.length > 0 && (
          <div className="insight-box strong">
            <h4>⭐ Your Best Keys</h4>
            <div className="insight-keys">
              {strongestKeys.map(({ char, accuracy }) => (
                <span key={char} className="insight-key">
                  {char.toUpperCase()} ({accuracy}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
