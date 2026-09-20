import { Search, MoreHorizontal } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SectionReveal from '../../components/SectionReveal';
import Pill from '../../components/Pill';

const rows=[['Aarav Mehta','aarav@example.com','Monthly','Active'],['Maya Rao','maya@example.com','Yearly','Active'],['Rohan Das','rohan@example.com','Monthly','Past due'],['Nisha Shah','nisha@example.com','Yearly','Active'],['Dev Kapoor','dev@example.com','Monthly','Cancelled']];
export default function AdminUsers(){return <div><PageHeader eyebrow="ADMIN · USERS" title="Member management." body="View and manage profiles, subscriptions, and score activity."/><div className="container"><SectionReveal><div className="panel glass-card"><div className="toolbar-inline"><div className="search"><Search size={16}/><input placeholder="Search members..."/></div><Pill>1,684 total</Pill></div><div className="table-wrap"><table><thead><tr><th>User</th><th>Plan</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}><td><strong>{r[0]}</strong><span>{r[1]}</span></td><td>{r[2]}</td><td><Pill tone={r[3]==='Active'?'green':'orange'}>{r[3]}</Pill></td><td><button className="icon-btn"><MoreHorizontal size={17}/></button></td></tr>)}</tbody></table></div></div></SectionReveal></div></div>}
