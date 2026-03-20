import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

// ── SVG Assets ──────────────────────────────────────────────

const KetupatsBackground = () => (
  <div className="bg-decorations" aria-hidden="true">
    {[
      { x: '5%', y: '8%', size: 60, rot: 15, delay: 0 },
      { x: '90%', y: '5%', size: 45, rot: -20, delay: 0.8 },
      { x: '3%', y: '60%', size: 50, rot: 30, delay: 1.5 },
      { x: '92%', y: '55%', size: 55, rot: -10, delay: 0.4 },
      { x: '8%', y: '88%', size: 40, rot: 45, delay: 2 },
      { x: '88%', y: '85%', size: 48, rot: -35, delay: 1.2 },
      { x: '50%', y: '2%', size: 35, rot: 0, delay: 0.6 },
    ].map((k, i) => (
      <div
        key={i}
        className="bg-ketupat"
        style={{
          left: k.x, top: k.y,
          animationDelay: `${k.delay}s`,
          animationDuration: `${3 + (i % 3)}s`,
        }}
      >
        <KetupatSVG size={k.size} rotation={k.rot} opacity={0.12} />
      </div>
    ))}
  </div>
);

const KetupatSVG = ({ size = 50, rotation = 0, opacity = 1, color = '#2ecc71' }) => {
  const s = size;
  const half = s / 2;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ transform: `rotate(${rotation}deg)`, opacity }}>
      {/* Diamond body */}
      <path
        d="M50 5 L95 50 L50 95 L5 50 Z"
        fill="none"
        stroke={color}
        strokeWidth="3"
      />
      {/* Inner grid lines - horizontal */}
      <line x1="5" y1="50" x2="95" y2="50" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <line x1="14" y1="30" x2="86" y2="30" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="14" y1="70" x2="86" y2="70" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Inner grid lines - vertical */}
      <line x1="50" y1="5" x2="50" y2="95" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <line x1="30" y1="14" x2="30" y2="86" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="70" y1="14" x2="70" y2="86" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Corner rope ties */}
      <circle cx="50" cy="5" r="4" fill={color} opacity="0.8" />
      <circle cx="95" cy="50" r="4" fill={color} opacity="0.8" />
      <circle cx="50" cy="95" r="4" fill={color} opacity="0.8" />
      <circle cx="5" cy="50" r="4" fill={color} opacity="0.8" />
    </svg>
  );
};

const MoonSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" className="moon-svg">
    <defs>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffe066" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="40" cy="40" r="38" fill="url(#moonGlow)" />
    <path
      d="M 55 15 A 25 25 0 1 0 55 65 A 18 18 0 1 1 55 15 Z"
      fill="#f4c430"
      opacity="0.9"
    />
    <circle cx="30" cy="28" r="3" fill="#ffe066" opacity="0.5" />
    <circle cx="42" cy="22" r="2" fill="#ffe066" opacity="0.4" />
  </svg>
);

const LanternSVG = ({ color = '#2ecc71', small = false }) => {
  const scale = small ? 0.6 : 1;
  return (
    <svg width={50 * scale} height={80 * scale} viewBox="0 0 50 80">
      {/* String */}
      <line x1="25" y1="0" x2="25" y2="10" stroke="#c9952a" strokeWidth="2" />
      {/* Top cap */}
      <rect x="12" y="10" width="26" height="6" rx="3" fill={color} opacity="0.9" />
      {/* Body */}
      <rect x="8" y="16" width="34" height="44" rx="6" fill={color} opacity="0.25" />
      <rect x="8" y="16" width="34" height="44" rx="6" fill="none" stroke={color} strokeWidth="2" />
      {/* Ribs */}
      {[25, 35, 45].map((y, i) => (
        <line key={i} x1="8" y1={y} x2="42" y2={y} stroke={color} strokeWidth="1" opacity="0.4" />
      ))}
      {/* Glow */}
      <rect x="14" y="22" width="22" height="32" rx="4" fill="#ffe066" opacity="0.15" />
      {/* Bottom cap */}
      <rect x="12" y="60" width="26" height="6" rx="3" fill={color} opacity="0.9" />
      {/* Tassel */}
      <line x1="25" y1="66" x2="25" y2="78" stroke="#c9952a" strokeWidth="2" />
      <circle cx="25" cy="79" r="2" fill="#f4c430" />
    </svg>
  );
};

const StarField = () => {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 2 + 2,
  }));
  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// ── Wheel Component ──────────────────────────────────────────

// Normal wheel: has SPIN 2x slot
const SEGMENTS_NORMAL = [
  { label: '20K',    value: 20000,  color: '#1b3d1b', accent: '#ff6b35', isBonus: false },
  { label: '50K',    value: 50000,  color: '#0f2d1e', accent: '#39ff8b', isBonus: false },
  { label: '100K',   value: 100000, color: '#1a4a2a', accent: '#f4c430', isBonus: false },
  { label: 'SPIN 2x',value: 0,      color: '#3a1a0a', accent: '#ff6b35', isBonus: true  },
];

// Bonus wheel: no SPIN 2x, replaced with 20K
const SEGMENTS_BONUS = [
  { label: '20K',  value: 20000,  color: '#1b3d1b', accent: '#ff6b35', isBonus: false },
  { label: '50K',  value: 50000,  color: '#0f2d1e', accent: '#39ff8b', isBonus: false },
  { label: '100K', value: 100000, color: '#1a4a2a', accent: '#f4c430', isBonus: false },
  { label: '20K',  value: 20000,  color: '#1b3d1b', accent: '#ff6b35', isBonus: false },
];

const NUM_SEGMENTS = 4;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;

function formatRupiah(val) {
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(0)}JT`;
  if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}K`;
  return `Rp ${val}`;
}

const SpinWheel = ({ onResult, spinsLeft, spinning, setSpinning, totalRotation, setTotalRotation, segments, isBonusMode }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const drawWheel = useCallback((rotation = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(cx, cy) - 10;

    ctx.clearRect(0, 0, W, H);

    // Outer glow ring
    const glowColor = isBonusMode ? 'rgba(255,107,53,0.5)' : 'rgba(46,204,113,0.5)';
    const outerGrad = ctx.createRadialGradient(cx, cy, radius - 5, cx, cy, radius + 15);
    outerGrad.addColorStop(0, glowColor);
    outerGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
    ctx.fillStyle = outerGrad;
    ctx.fill();

    segments.forEach((seg, i) => {
      const startAngle = (rotation + i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
      const endAngle = startAngle + SEGMENT_ANGLE * (Math.PI / 180);
      const midAngle = startAngle + (SEGMENT_ANGLE / 2) * (Math.PI / 180);

      // Segment fill - bonus slot gets special treatment
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      if (seg.isBonus) {
        grad.addColorStop(0, '#4a1a08');
        grad.addColorStop(1, '#1a0800');
      } else {
        grad.addColorStop(0, seg.color);
        grad.addColorStop(1, '#060e08');
      }
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Segment border
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.strokeStyle = seg.accent;
      ctx.lineWidth = seg.isBonus ? 3 : 2;
      ctx.globalAlpha = seg.isBonus ? 1 : 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // For bonus slot: draw star/burst decoration
      if (seg.isBonus) {
        const bx = cx + (radius * 0.72) * Math.cos(midAngle);
        const by = cy + (radius * 0.72) * Math.sin(midAngle);
        ctx.save();
        ctx.translate(bx, by);
        ctx.fillStyle = '#ff6b35';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      } else {
        // Ketupat decoration at segment edge
        const ketupatX = cx + (radius * 0.78) * Math.cos(midAngle);
        const ketupatY = cy + (radius * 0.78) * Math.sin(midAngle);
        ctx.save();
        ctx.translate(ketupatX, ketupatY);
        ctx.rotate(midAngle + Math.PI / 4);
        ctx.strokeStyle = seg.accent;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;
        const ks = 8;
        ctx.beginPath();
        ctx.moveTo(0, -ks);
        ctx.lineTo(ks, 0);
        ctx.lineTo(0, ks);
        ctx.lineTo(-ks, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // Label text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowColor = seg.accent;
      ctx.shadowBlur = seg.isBonus ? 20 : 12;

      if (seg.isBonus) {
        ctx.font = 'bold 14px Tajawal, sans-serif';
        ctx.fillStyle = '#ff6b35';
        ctx.fillText('SPIN', 0, -(radius * 0.62));
        ctx.fillText('2x', 0, -(radius * 0.50));
        ctx.font = '10px Tajawal, sans-serif';
        ctx.fillStyle = '#ffaa88';
        ctx.shadowBlur = 0;
        ctx.fillText('🎰🎰', 0, -(radius * 0.38));
      } else {
        ctx.font = 'bold 18px Tajawal, sans-serif';
        ctx.fillStyle = seg.accent;
        ctx.fillText(seg.label, 0, -(radius * 0.58));
        ctx.font = '11px Tajawal, sans-serif';
        ctx.fillStyle = '#aad4b5';
        ctx.shadowBlur = 0;
        const small = seg.value >= 1000 ? (seg.value / 1000) + 'rb' : seg.value;
        ctx.fillText('Rp ' + small, 0, -(radius * 0.43));
      }

      ctx.restore();
    });

    // Center hub
    const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
    hubGrad.addColorStop(0, isBonusMode ? '#7a2a10' : '#1a7a40');
    hubGrad.addColorStop(1, '#0a1a0f');
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = isBonusMode ? '#ff6b35' : '#2ecc71';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = 'bold 13px Tajawal, sans-serif';
    ctx.fillStyle = '#f4c430';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#f4c430';
    ctx.shadowBlur = 10;
    ctx.fillText('DIRS', cx, cy - 8);
    ctx.fillText('THR', cx, cy + 8);
    ctx.shadowBlur = 0;

  }, [segments, isBonusMode]);

  useEffect(() => {
    drawWheel(totalRotation);
  }, [drawWheel, totalRotation]);

  const spin = () => {
    if (spinning || spinsLeft <= 0) return;
    setSpinning(true);

    const extraSpins = 5 + Math.floor(Math.random() * 4);
    const randomStop = Math.floor(Math.random() * 360);
    const targetAngle = totalRotation + extraSpins * 360 + randomStop;

    const duration = 4000 + Math.random() * 1500;
    const startTime = performance.now();
    const startAngle = totalRotation;

    const easeOut = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const currentAngle = startAngle + (targetAngle - startAngle) * eased;

      setTotalRotation(currentAngle);
      drawWheel(currentAngle);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setTotalRotation(targetAngle);
        drawWheel(targetAngle);

        // Segment i starts at (rotation + i*45 - 90)°. Pointer is at -90°.
        // Segment at pointer: i = floor(-targetAngle / 45) mod 8
        const segIndex = ((Math.floor(-targetAngle / SEGMENT_ANGLE)) % NUM_SEGMENTS + NUM_SEGMENTS) % NUM_SEGMENTS;
        const result = segments[segIndex];

        setTimeout(() => {
          setSpinning(false);
          onResult(result);
        }, 500);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  return (
    <div className="wheel-wrapper">
      <div className="pointer">
        <svg width="40" height="50" viewBox="0 0 40 50">
          <defs>
            <filter id="pointerGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <polygon points="2,2 38,2 20,48" fill="#f4c430" filter="url(#pointerGlow)" />
          <polygon points="2,2 38,2 20,48" fill="none" stroke="#ffe066" strokeWidth="1.5" />
          <circle cx="20" cy="38" r="6" fill="#f4c430" />
        </svg>
      </div>

      {spinning && (
        <>
          <div className="pulse-ring r1" />
          <div className="pulse-ring r2" />
        </>
      )}

      <canvas
        ref={canvasRef}
        width={380}
        height={380}
        className={`wheel-canvas ${spinning ? 'spinning' : ''}`}
        onClick={spin}
      />

      <button
        className={`spin-btn ${spinning ? 'disabled' : ''} ${spinsLeft === 0 ? 'exhausted' : ''} ${isBonusMode ? 'bonus-mode' : ''}`}
        onClick={spin}
        disabled={spinning || spinsLeft === 0}
      >
        {spinning ? (
          <span>🌀 Berputar...</span>
        ) : spinsLeft === 0 ? (
          <span>✅ Selesai</span>
        ) : isBonusMode ? (
          <span>🎰🎰 BONUS SPIN! ({spinsLeft} tersisa)</span>
        ) : (
          <span>🎰 PUTAR! ({spinsLeft} tersisa)</span>
        )}
      </button>
    </div>
  );
};

// ── Confetti ─────────────────────────────────────────────────

const Confetti = ({ active }) => {
  if (!active) return null;
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    color: ['#2ecc71', '#f4c430', '#ff6b35', '#39ff8b', '#ffe066'][i % 5],
    size: 6 + Math.random() * 8,
  }));
  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// ── Result Modal ──────────────────────────────────────────────

const ResultModal = ({ results, onClose, spinsLeft, isBonusMode, gotBonus }) => {
  const isComplete = spinsLeft === 0;
  const total = results.reduce((a, r) => a + r.value, 0);
  const lastResult = results[results.length - 1];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-card ${gotBonus ? 'bonus-flash' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-decoration">
          <KetupatSVG size={35} rotation={15} color="#f4c430" />
          <KetupatSVG size={35} rotation={-15} color="#2ecc71" />
        </div>

        {gotBonus ? (
          // Just got SPIN 2x
          <>
            <div className="modal-title bonus-title">🎰🎰 SPIN 2x! 🎰🎰</div>
            <p className="modal-sub">Beruntung banget! Kamu dapat</p>
            <div className="modal-bonus-badge">2 Spin Bonus!</div>
            <p className="modal-sub" style={{ marginTop: 12 }}>
              Wheel berubah — tanpa SPIN 2x lagi.<br />Semua nominal akan dijumlah!
            </p>
          </>
        ) : isComplete ? (
          // All done
          <>
            <div className="modal-title">🎊 Selamat! 🎊</div>
            <p className="modal-sub">Total THR kamu:</p>
            <div className="modal-total">{formatRupiah(total)}</div>
            <div className="modal-results-list">
              {results.map((r, i) => (
                <div key={i} className="modal-result-item">
                  <span>{isBonusMode && i > 0 ? `Bonus ${i}` : `Spin ${i + 1}`}</span>
                  <span className="result-amount" style={{ color: SEGMENTS_NORMAL.find(s => s.value === r.value)?.accent || '#2ecc71' }}>
                    {formatRupiah(r.value)}
                  </span>
                </div>
              ))}
            </div>
            <p className="modal-blessing">تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ</p>
            <p className="modal-blessing-id">Taqabbalallahu minna wa minkum 🌙</p>
          </>
        ) : (
          // Mid-game result
          <>
            <div className="modal-spin-num">{isBonusMode ? `Bonus Spin ${results.length - 1}` : `Spin ${results.length}`}</div>
            <div className="modal-single-result" style={{ color: SEGMENTS_NORMAL.find(s => s.value === lastResult?.value)?.accent || '#2ecc71' }}>
              {formatRupiah(lastResult?.value || 0)}
            </div>
            <p className="modal-sub">
              {isBonusMode
                ? `Masih ada ${spinsLeft} bonus spin lagi! 🎰`
                : `Masih ada ${spinsLeft} spin lagi! 🎯`}
            </p>
          </>
        )}

        <button className="modal-btn" onClick={onClose}>
          {isComplete ? '🌙 Tutup' : gotBonus ? '🎰 Mulai Bonus Spin!' : '🎰 Lanjut!'}
        </button>
      </div>
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────

export default function App() {
  // spinsLeft: how many spins remain
  // isBonusMode: wheel has switched to SEGMENTS_BONUS
  // gotBonus: flag to show "you got SPIN 2x" modal
  // results: all nominal results (SPIN 2x itself is not stored, only nominals)
  const [spinsLeft, setSpinsLeft] = useState(1);
  const [isBonusMode, setIsBonusMode] = useState(false);
  const [gotBonus, setGotBonus] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [totalRotation, setTotalRotation] = useState(0);

  const currentSegments = isBonusMode ? SEGMENTS_BONUS : SEGMENTS_NORMAL;
  // total spins in current session for display
  const totalSpins = isBonusMode ? 3 : 1; // 1 normal, or 1 normal + 2 bonus

  const handleResult = (result) => {
    if (result.isBonus) {
      // Got SPIN 2x — switch to bonus mode, grant 2 bonus spins
      setIsBonusMode(true);
      setSpinsLeft(2);
      setGotBonus(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3500);
      setTimeout(() => setShowModal(true), 600);
    } else {
      const newResults = [...results, result];
      setResults(newResults);
      const newSpinsLeft = spinsLeft - 1;
      setSpinsLeft(newSpinsLeft);
      setGotBonus(false);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3500);
      setTimeout(() => setShowModal(true), 600);
    }
  };

  const handleReset = () => {
    setSpinsLeft(1);
    setIsBonusMode(false);
    setGotBonus(false);
    setResults([]);
    setShowModal(false);
    setConfetti(false);
    setTotalRotation(0);
  };

  const total = results.reduce((a, r) => a + r.value, 0);
  const isDone = spinsLeft === 0;

  return (
    <div className="app">
      <StarField />
      <KetupatsBackground />

      <div className="lanterns" aria-hidden="true">
        <div className="lantern l1"><LanternSVG color="#2ecc71" /></div>
        <div className="lantern l2"><LanternSVG color="#f4c430" /></div>
        <div className="lantern l3"><LanternSVG color="#2ecc71" small /></div>
        <div className="lantern l4"><LanternSVG color="#f4c430" small /></div>
      </div>

      <Confetti active={confetti} />

      {/* Header */}
      <header className="header">
        <div className="header-moon"><MoonSVG /></div>
        <div className="header-content">
          <div className="arabic-text">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <h1 className="main-title">DIRS THR</h1>
          <div className="subtitle">🌙 Gacha Nominal THR Lebaran 1446 H 🌙</div>
        </div>
        <div className="header-decorations">
          <KetupatSVG size={40} rotation={20} color="#f4c430" opacity={0.7} />
          <KetupatSVG size={30} rotation={-10} color="#2ecc71" opacity={0.6} />
        </div>
      </header>

      <div className="ornament-line">
        <span>✦</span><span>◆</span><span>✦</span><span>◆</span><span>✦</span>
      </div>

      {/* Bonus mode banner */}
      {isBonusMode && (
        <div className="bonus-banner">
          🎰🎰 MODE BONUS AKTIF — Wheel berubah! SPIN 2x tidak ada lagi 🎰🎰
        </div>
      )}

      {/* Main wheel */}
      <main className="main-content">
        <SpinWheel
          onResult={handleResult}
          spinsLeft={spinsLeft}
          spinning={spinning}
          setSpinning={setSpinning}
          totalRotation={totalRotation}
          setTotalRotation={setTotalRotation}
          segments={currentSegments}
          isBonusMode={isBonusMode}
        />
      </main>

      {/* Running results */}
      {results.length > 0 && (
        <section className="results-section">
          <div className="results-header">🎁 Hasil Spin</div>
          <div className="results-row">
            {results.map((r, i) => (
              <div key={i} className="result-chip">
                <span className="result-chip-num">{i === 0 ? 'Spin 1' : `Bonus ${i}`}</span>
                <span className="result-chip-val" style={{ color: SEGMENTS_NORMAL.find(s => s.value === r.value)?.accent || '#2ecc71' }}>
                  {formatRupiah(r.value)}
                </span>
              </div>
            ))}
            {results.length >= 2 && (
              <div className="result-chip total-chip">
                <span className="result-chip-num">TOTAL</span>
                <span className="result-chip-val gold">{formatRupiah(total)}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {isDone && (
        <div className="reset-section">
          <button className="reset-btn" onClick={handleReset}>
            🔄 Putar Ulang
          </button>
        </div>
      )}

      <div className="ornament-line">
        <span>✦</span><span>◆</span><span>✦</span><span>◆</span><span>✦</span>
      </div>

      <footer className="footer">
        <div className="footer-decorations">
          <KetupatSVG size={25} rotation={15} color="#2ecc71" opacity={0.4} />
          <KetupatSVG size={20} rotation={-20} color="#f4c430" opacity={0.3} />
          <KetupatSVG size={25} rotation={10} color="#2ecc71" opacity={0.4} />
        </div>
        <p>Selamat Hari Raya Idul Fitri 1446 H</p>
        <p className="footer-sub">Minal Aidin Wal Faizin 🌙⭐</p>
      </footer>

      {showModal && (
        <ResultModal
          results={results}
          onClose={() => setShowModal(false)}
          spinsLeft={spinsLeft}
          isBonusMode={isBonusMode}
          gotBonus={gotBonus}
        />
      )}
    </div>
  );
}