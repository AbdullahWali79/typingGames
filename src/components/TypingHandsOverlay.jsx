import { useMemo } from 'react';

// Touch typing finger mapping
const FINGER_MAP = {
  // Left hand
  'q': 'lp', 'a': 'lp', 'z': 'lp',
  'w': 'lr', 's': 'lr', 'x': 'lr',
  'e': 'lm', 'd': 'lm', 'c': 'lm',
  'r': 'li', 'f': 'li', 'v': 'li', 't': 'li', 'g': 'li', 'b': 'li',
  '`': 'lp', '1': 'lp', '2': 'lr', '3': 'lm', '4': 'li', '5': 'li',
  'tab': 'lp', 'caps': 'lp', 'shift-left': 'lp', 'ctrl-left': 'lp',
  
  // Right hand
  'y': 'ri', 'h': 'ri', 'n': 'ri', 'u': 'ri', 'j': 'ri', 'm': 'ri',
  'i': 'rm', 'k': 'rm', ',': 'rm', '<': 'rm',
  'o': 'rr', 'l': 'rr', '.': 'rr', '>': 'rr',
  'p': 'rp', ';': 'rp', '/': 'rp', '[': 'rp', ']': 'rp', "'": 'rp', '\\': 'rp',
  '6': 'ri', '7': 'ri', '8': 'rm', '9': 'rr', '0': 'rp', '-': 'rp', '=': 'rp',
  'backspace': 'rp', 'enter': 'rp', 'shift-right': 'rp', 'ctrl-right': 'rp',
  
  // Space - either thumb
  ' ': 'thumb'
};

// Key positions for hand positioning (approximate % positions on keyboard)
const KEY_POSITIONS = {
  // Numbers row
  '`': { x: 5, row: 0 }, '1': { x: 10, row: 0 }, '2': { x: 16, row: 0 }, '3': { x: 22, row: 0 },
  '4': { x: 28, row: 0 }, '5': { x: 34, row: 0 }, '6': { x: 40, row: 0 }, '7': { x: 46, row: 0 },
  '8': { x: 52, row: 0 }, '9': { x: 58, row: 0 }, '0': { x: 64, row: 0 },
  '-': { x: 70, row: 0 }, '=': { x: 76, row: 0 }, 'backspace': { x: 86, row: 0 },
  
  // Top row (QWERTY)
  'tab': { x: 7, row: 1 }, 'q': { x: 14, row: 1 }, 'w': { x: 21, row: 1 }, 'e': { x: 28, row: 1 },
  'r': { x: 35, row: 1 }, 't': { x: 42, row: 1 }, 'y': { x: 49, row: 1 }, 'u': { x: 56, row: 1 },
  'i': { x: 63, row: 1 }, 'o': { x: 70, row: 1 }, 'p': { x: 77, row: 1 },
  '[': { x: 84, row: 1 }, ']': { x: 91, row: 1 }, '\\': { x: 96, row: 1 },
  
  // Home row (ASDF)
  'caps': { x: 8, row: 2 }, 'a': { x: 16, row: 2 }, 's': { x: 24, row: 2 }, 'd': { x: 32, row: 2 },
  'f': { x: 40, row: 2 }, 'g': { x: 48, row: 2 }, 'h': { x: 56, row: 2 }, 'j': { x: 64, row: 2 },
  'k': { x: 72, row: 2 }, 'l': { x: 80, row: 2 }, ';': { x: 88, row: 2 },
  "'": { x: 94, row: 2 }, 'enter': { x: 98, row: 2 },
  
  // Bottom row (ZXCV)
  'shift-left': { x: 10, row: 3 }, 'z': { x: 19, row: 3 }, 'x': { x: 28, row: 3 },
  'c': { x: 37, row: 3 }, 'v': { x: 46, row: 3 }, 'b': { x: 55, row: 3 },
  'n': { x: 64, row: 3 }, 'm': { x: 73, row: 3 }, ',': { x: 81, row: 3 },
  '.': { x: 88, row: 3 }, '/': { x: 95, row: 3 }, 'shift-right': { x: 99, row: 3 },
  
  // Space row
  'ctrl-left': { x: 8, row: 4 }, 'alt-left': { x: 18, row: 4 },
  ' ': { x: 50, row: 4 },
  'alt-right': { x: 82, row: 4 }, 'ctrl-right': { x: 92, row: 4 }
};

function getFingerForChar(char) {
  if (!char) return null;
  const lower = char.toLowerCase();
  return FINGER_MAP[lower] || null;
}

function getKeyPosition(char) {
  if (!char) return null;
  return KEY_POSITIONS[char.toLowerCase()] || KEY_POSITIONS[char] || null;
}

export default function TypingHandsOverlay({ nextChar, justPressedChar }) {
  const activeFinger = useMemo(() => getFingerForChar(nextChar), [nextChar]);
  const pressedFinger = useMemo(() => getFingerForChar(justPressedChar), [justPressedChar]);
  const nextKeyPos = useMemo(() => getKeyPosition(nextChar), [nextChar]);

  // Calculate finger positions based on the next key
  const getFingerPosition = (finger) => {
    // If we have a specific key position, position the finger above it
    if (nextKeyPos && activeFinger === finger) {
      return {
        x: nextKeyPos.x,
        y: 20 + (nextKeyPos.row * 18), // Position above the key
        extended: true
      };
    }
    
    // Default positions (home row resting position)
    const defaults = {
      'lp': { x: 16, y: 65, extended: false },
      'lr': { x: 24, y: 62, extended: false },
      'lm': { x: 32, y: 60, extended: false },
      'li': { x: 40, y: 60, extended: false },
      'lt': { x: 35, y: 75, extended: false },
      'ri': { x: 56, y: 60, extended: false },
      'rm': { x: 64, y: 60, extended: false },
      'rr': { x: 72, y: 62, extended: false },
      'rp': { x: 80, y: 65, extended: false },
      'rt': { x: 65, y: 75, extended: false },
      'thumb': { x: 50, y: 75, extended: false }
    };
    return defaults[finger] || { x: 50, y: 70, extended: false };
  };

  const fingers = ['lp', 'lr', 'lm', 'li', 'lt', 'rt', 'ri', 'rm', 'rr', 'rp'];
  
  const isLeft = activeFinger && activeFinger.startsWith('l');
  const isRight = activeFinger && activeFinger.startsWith('r');

  return (
    <div className="typing-hands-overlay">
      <svg viewBox="0 0 100 90" className="hands-svg" preserveAspectRatio="xMidYMax meet">
        <defs>
          {/* Hand skin gradient */}
          <linearGradient id="handSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5d0a9" />
            <stop offset="50%" stopColor="#e8b896" />
            <stop offset="100%" stopColor="#d4a078" />
          </linearGradient>
          
          {/* Active finger glow */}
          <radialGradient id="activeGlow">
            <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ff6b6b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
          </radialGradient>
          
          {/* Pressed finger color */}
          <linearGradient id="pressedSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#51cf66" />
            <stop offset="100%" stopColor="#37b24d" />
          </linearGradient>
        </defs>
        
        {/* Draw left hand fingers */}
        {['lp', 'lr', 'lm', 'li', 'lt'].map(finger => {
          const pos = getFingerPosition(finger);
          const isActive = activeFinger === finger;
          const isPressed = pressedFinger === finger;
          
          return (
            <FingerSVG
              key={finger}
              x={pos.x}
              y={pos.y}
              isLeft={true}
              isActive={isActive}
              isPressed={isPressed}
              extended={pos.extended}
            />
          );
        })}
        
        {/* Draw right hand fingers */}
        {['ri', 'rm', 'rr', 'rp', 'rt'].map(finger => {
          const pos = getFingerPosition(finger);
          const isActive = activeFinger === finger;
          const isPressed = pressedFinger === finger;
          
          return (
            <FingerSVG
              key={finger}
              x={pos.x}
              y={pos.y}
              isLeft={false}
              isActive={isActive}
              isPressed={isPressed}
              extended={pos.extended}
            />
          );
        })}
        
        {/* Thumb for space */}
        {(activeFinger === 'thumb' || pressedFinger === 'thumb') && (
          <FingerSVG
            x={50}
            y={75}
            isLeft={false}
            isActive={activeFinger === 'thumb'}
            isPressed={pressedFinger === 'thumb'}
            extended={activeFinger === 'thumb'}
            isThumb={true}
          />
        )}
      </svg>
      
      {/* Instruction hint */}
      {activeFinger && nextChar && (
        <div className="hand-hint">
          Use your <strong>{getFingerName(activeFinger)}</strong> for
          <span className="key-badge">{nextChar === ' ' ? 'Space' : nextChar}</span>
        </div>
      )}
    </div>
  );
}

function FingerSVG({ x, y, isLeft, isActive, isPressed, extended, isThumb }) {
  // Finger extends upward when active
  const length = isThumb ? 8 : (extended ? 20 : 12);
  const width = isThumb ? 4 : 3.5;
  
  // Calculate finger shape
  const tipY = y - length;
  const baseY = y;
  
  return (
    <g className={`overlay-finger ${isActive ? 'active' : ''} ${isPressed ? 'pressed' : ''}`}>
      {/* Glow effect for active finger */}
      {isActive && (
        <circle
          cx={x}
          cy={tipY}
          r="6"
          fill="url(#activeGlow)"
          className="finger-glow"
        />
      )}
      
      {/* Finger body */}
      <path
        d={isThumb ? `
          M ${x - width} ${baseY}
          Q ${x - width/2} ${tipY + 4} ${x} ${tipY}
          Q ${x + width/2} ${tipY + 4} ${x + width} ${baseY}
          Z
        ` : `
          M ${x - width/2} ${baseY}
          Q ${x - width/3} ${(baseY + tipY)/2} ${x - width/4} ${tipY + 3}
          Q ${x} ${tipY} ${x + width/4} ${tipY + 3}
          Q ${x + width/3} ${(baseY + tipY)/2} ${x + width/2} ${baseY}
          Z
        `}
        fill={isPressed ? 'url(#pressedSkin)' : 'url(#handSkin)'}
        stroke={isActive ? '#ff6b6b' : isPressed ? '#37b24d' : '#c9956c'}
        strokeWidth={isActive ? 0.5 : 0.3}
      />
      
      {/* Finger tip */}
      <ellipse
        cx={x}
        cy={tipY}
        rx={width/2}
        ry={2}
        fill={isPressed ? '#69db7c' : isActive ? '#ff8787' : '#f5d0a9'}
        stroke={isActive ? '#ff6b6b' : isPressed ? '#51cf66' : '#c9956c'}
        strokeWidth="0.3"
      />
      
      {/* Finger nail */}
      <ellipse
        cx={x}
        cy={tipY - 0.5}
        rx={width/3}
        ry={1}
        fill="rgba(255,255,255,0.4)"
      />
    </g>
  );
}

function getFingerName(fingerCode) {
  const names = {
    'lp': 'Left Pinky',
    'lr': 'Left Ring',
    'lm': 'Left Middle',
    'li': 'Left Index',
    'lt': 'Left Thumb',
    'ri': 'Right Index',
    'rm': 'Right Middle',
    'rr': 'Right Ring',
    'rp': 'Right Pinky',
    'rt': 'Right Thumb',
    'thumb': 'Thumb'
  };
  return names[fingerCode] || fingerCode.toUpperCase();
}
