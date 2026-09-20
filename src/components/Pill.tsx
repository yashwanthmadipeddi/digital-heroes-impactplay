export default function Pill({ children, tone = 'green' }: { children: React.ReactNode; tone?: 'green' | 'orange' | 'slate' }) { return <span className={`pill pill-${tone}`}>{children}</span>; }
