import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

type StatProps = {
  value: number;
  suffix?: string;
  label: string;
};

export default function Stat({ value, suffix = '', label }: StatProps) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 70, damping: 20 });
  const rounded = useTransform(spring, (latest) => Math.round(latest).toLocaleString());
  const [displayValue, setDisplayValue] = useState('0');

  useMotionValueEvent(rounded, 'change', (latest) => {
    setDisplayValue(latest);
  });

  useEffect(() => {
    count.set(value);
  }, [count, value]);

  return (
    <div className="stat">
      <motion.div className="stat-value">{displayValue}{suffix}</motion.div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
