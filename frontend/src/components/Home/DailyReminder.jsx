import { useState, useEffect } from 'react';

export default function DailyReminder({ hasCompletedDaily }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Start warning after 18:00
      if (hour >= 18 && !hasCompletedDaily) {
        setIsLate(true);
        
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        
        const diffMs = midnight - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        setTimeLeft(
          `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`
        );
      } else {
        setIsLate(false);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [hasCompletedDaily]);

  if (!isLate) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
      <div style={{ fontSize: 24 }}>⏰</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Não perca sua ofensiva!</p>
        <p style={{ margin: '2px 0 0', fontSize: 12, opacity: 0.9 }}>
          Complete sua lição diária para salvar o dia.
        </p>
      </div>
      <div style={{
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '6px 10px',
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 14,
        fontVariantNumeric: 'tabular-nums'
      }}>
        {timeLeft}
      </div>
    </div>
  );
}
