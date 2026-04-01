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

// Get finger for a character
function getFingerForChar(char) {
  if (!char) return null;
  const lower = char.toLowerCase();
  return FINGER_MAP[lower] || null;
}

// Finger positions (percentage-based)
const FINGER_POSITIONS = {
  // Left hand (on home row)
  left: {
    lp: { x: 15, y: 65, angle: -20 },   // Pinky
    lr: { x: 25, y: 55, angle: -10 },   // Ring
    lm: { x: 35, y: 50, angle: 0 },     // Middle
    li: { x: 45, y: 50, angle: 5 },     // Index
    lt: { x: 55, y: 75, angle: 15 }     // Thumb
  },
  // Right hand (on home row)
  right: {
    ri: { x: 55, y: 50, angle: -5 },    // Index
    rm: { x: 65, y: 50, angle: 0 },     // Middle
    rr: { x: 75, y: 55, angle: 10 },    // Ring
    rp: { x: 85, y: 65, angle: 20 },    // Pinky
    rt: { x: 45, y: 75, angle: -15 }    // Thumb
  }
};

export default function TypingHands({ nextChar, justPressedChar, isVisible = true }) {
  const activeFinger = useMemo(() => {
    return getFingerForChar(nextChar);
  }, [nextChar]);

  const pressedFinger = useMemo(() => {
    return getFingerForChar(justPressedChar);
  }, [justPressedChar]);

  if (!isVisible) return null;

  const isLeftFinger = activeFinger && activeFinger.startsWith('l');
  const isRightFinger = activeFinger && activeFinger.startsWith('r');
  
  const leftHandActive = isLeftFinger || activeFinger === 'thumb';
  const rightHandActive = isRightFinger || activeFinger === 'thumb';

  return (
    <div className="typing-hands-container">
      <svg viewBox="0 0 100 80" className="typing-hands-svg">
        {/* Left Hand */}
        <g className={`hand left-hand ${leftHandActive ? 'active' : ''}`}>
          {/* Palm */}
          <ellipse cx="35" cy="60" rx="20" ry="15" className="palm" />
          
          {/* Fingers - Left Hand */}
          {/* Pinky (LP) */}
          <Finger 
            x={20} y={45} 
            length={12} 
            angle={-30}
            isActive={activeFinger === 'lp'}
            isPressed={pressedFinger === 'lp'}
            label="LP"
          />
          
          {/* Ring (LR) */}
          <Finger 
            x={28} y={38} 
            length={15} 
            angle={-10}
            isActive={activeFinger === 'lr'}
            isPressed={pressedFinger === 'lr'}
            label="LR"
          />
          
          {/* Middle (LM) */}
          <Finger 
            x={36} y={35} 
            length={17} 
            angle={0}
            isActive={activeFinger === 'lm'}
            isPressed={pressedFinger === 'lm'}
            label="LM"
          />
          
          {/* Index (LI) */}
          <Finger 
            x={45} y={38} 
            length={15} 
            angle={10}
            isActive={activeFinger === 'li'}
            isPressed={pressedFinger === 'li'}
            label="LI"
          />
          
          {/* Thumb (LT) */}
          <Finger 
            x={48} y={55} 
            length={10} 
            angle={45}
            width={4}
            isActive={activeFinger === 'thumb' || activeFinger === 'lt'}
            isPressed={pressedFinger === 'thumb' || pressedFinger === 'lt'}
            label="LT"
          />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="leftHandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8e8b8" />
            <stop offset="50%" stopColor="#f4d03f" />
            <stop offset="100%" stopColor="#d4ac0d" />
          </linearGradient>
          <linearGradient id="rightHandGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8e8b8" />
            <stop offset="50%" stopColor="#f4d03f" />
            <stop offset="100%" stopColor="#d4ac0d" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Right Hand */}
        <g className={`hand right-hand ${rightHandActive ? 'active' : ''}`}>
          {/* Palm */}
          <ellipse cx="65" cy="60" rx="20" ry="15" className="palm" />
          
          {/* Fingers - Right Hand */}
          {/* Index (RI) */}
          <Finger 
            x={55} y={38} 
            length={15} 
            angle={-10}
            isActive={activeFinger === 'ri'}
            isPressed={pressedFinger === 'ri'}
            label="RI"
          />
          
          {/* Middle (RM) */}
          <Finger 
            x={64} y={35} 
            length={17} 
            angle={0}
            isActive={activeFinger === 'rm'}
            isPressed={pressedFinger === 'rm'}
            label="RM"
          />
          
          {/* Ring (RR) */}
          <Finger 
            x={72} y={38} 
            length={15} 
            angle={10}
            isActive={activeFinger === 'rr'}
            isPressed={pressedFinger === 'rr'}
            label="RR"
          />
          
          {/* Pinky (RP) */}
          <Finger 
            x={80} y={45} 
            length={12} 
            angle={30}
            isActive={activeFinger === 'rp'}
            isPressed={pressedFinger === 'rp'}
            label="RP"
          />
          
          {/* Thumb (RT) */}
          <Finger 
            x={52} y={55} 
            length={10} 
            angle={-45}
            width={4}
            isActive={activeFinger === 'thumb' || activeFinger === 'rt'}
            isPressed={pressedFinger === 'thumb' || pressedFinger === 'rt'}
            label="RT"
          />
        </g>
      </svg>
      
      <div className="hands-instruction">
        {activeFinger ? (
          <>
            <span className="finger-hint">
              Use your <strong>{getFingerName(activeFinger)}</strong> for 
              <span className="next-key"> "{nextChar}"</span>
            </span>
          </>
        ) : (
          <span className="finger-hint">Place your fingers on the home row (ASDF JKL;)</span>
        )}
      </div>
    </div>
  );
}

function Finger({ x, y, length, angle, width = 3, isActive, isPressed, label }) {
  // Calculate end point
  const rad = (angle * Math.PI) / 180;
  const endX = x + Math.sin(rad) * length;
  const endY = y - Math.cos(rad) * length;
  
  // Control point for slight curve
  const cpX = x + Math.sin(rad) * (length * 0.5);
  const cpY = y - Math.cos(rad) * (length * 0.3);

  return (
    <g className={`finger ${isActive ? 'active' : ''} ${isPressed ? 'pressed' : ''}`}>
      {/* Finger shape */}
      <path
        d={`M ${x - width/2} ${y} 
            Q ${cpX} ${cpY} ${endX} ${endY}
            Q ${cpX + width/2} ${cpY + width/2} ${x + width/2} ${y} Z`}
        className="finger-body"
      />
      
      {/* Finger tip (highlight when active) */}
      <circle
        cx={endX}
        cy={endY}
        r={width}
        className="finger-tip"
      />
      
      {/* Finger label (small, subtle) */}
      <text
        x={x}
        y={y + 3}
        className="finger-label"
        textAnchor="middle"
        fontSize="3"
      >
        {label}
      </text>
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
