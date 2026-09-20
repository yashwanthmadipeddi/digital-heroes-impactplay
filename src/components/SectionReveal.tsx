import { motion } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';

export default function SectionReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 45, filter: 'blur(9px)' }} animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
