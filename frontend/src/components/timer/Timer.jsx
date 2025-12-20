import { Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

const calcTimeLeft = (targetIso) => {
  const target = Date.parse(targetIso);
  const now = Date.now();
  const total = Math.max(0, target - now);

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
};

const unitLabels = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

const Timer = ({ targetIso, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetIso));

  useEffect(() => {
    setTimeLeft(calcTimeLeft(targetIso));
    const t = setInterval(() => setTimeLeft(calcTimeLeft(targetIso)), 1000);
    return () => clearInterval(t);
  }, [targetIso]);

  const isFinished = timeLeft.total <= 0;

  const formatted = useMemo(() => {
    return {
      days: String(timeLeft.days).padStart(2, '0'),
      hours: String(timeLeft.hours).padStart(2, '0'),
      minutes: String(timeLeft.minutes).padStart(2, '0'),
      seconds: String(timeLeft.seconds).padStart(2, '0'),
    };
  }, [timeLeft]);

  if (isFinished) return;

  return (
    <div className={`w-fit justify-self-center rounded-xl p-4 backdrop-blur-[2px] border border-blue-950 ${className}`}>
      {!isFinished && (
        <div className="flex items-center mb-3">
          <div>
            <Typography>
              <h3 className="text-xl font-semibold">Registration starts in:</h3>
            </Typography>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {unitLabels.map((u) => (
          <div key={u.key} className="flex flex-col items-center justify-center py-4 px-2">
            <Typography className="gradient-text">
              <div className="text-4xl font-extrabold leading-none tracking-wider h-12 flex items-center">
                <span key={formatted[u.key]} className="block">
                  {formatted[u.key]}
                </span>
              </div>
              <Typography>
                <div className="text-xs mt-2 font-bold text-center">{u.label}</div>
              </Typography>
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timer;
