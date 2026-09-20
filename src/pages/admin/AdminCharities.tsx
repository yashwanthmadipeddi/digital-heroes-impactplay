import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../../components/PageHeader';
import SectionReveal from '../../components/SectionReveal';
import { loadDemoState } from '../../lib/demoData';

export default function AdminCharities(){const state=loadDemoState(true);return <div><PageHeader eyebrow="ADMIN · CHARITIES" title="Curate the impact directory." body="Add, edit, feature, and maintain charity content without touching application code."/><div className="container"><SectionReveal><div className="panel glass-card"><div className="toolbar-inline"><div><span className="eyebrow">DIRECTORY</span><h2>{state.charities.length} live causes</h2></div><button className="btn btn-primary" onClick={()=>toast.success('New charity form ready in the production implementation')}><Plus size={16}/> Add charity</button></div><div className="admin-charity-list">{state.charities.map(c=><div className="admin-charity-row" key={c.id}><img src={c.image_url} alt=""/><div><strong>{c.name}</strong><span>{c.impact_metric}</span></div><div className="row-actions"><button className="icon-btn" onClick={()=>toast('Edit charity') }><Pencil size={15}/></button><button className="icon-btn danger" onClick={()=>toast('Delete action guarded by confirmation in production')}><Trash2 size={15}/></button></div></div>)}</div></div></SectionReveal></div></div>}
