"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cycles, maintenanceStatuses, orderCode, statuses } from "@/lib/crm/validation";

type Client={id:string;name:string;phone:string;email:string;company:string;created_at:string;project_count?:number;total_cents?:string;paid_cents?:string};
type Project={id:string;order_number:number;title:string;service:string;brief:string;status:string;price_cents:number;paid_cents:number;notes:string;maintenance_status:string;maintenance_fee_cents:number;maintenance_cycle:string;maintenance_start:string|null;maintenance_end:string|null;maintenance_next:string|null;maintenance_notes:string;version:number;created_at:string;submitted_contact:{name?:string;email?:string;company?:string;returning?:boolean}};
type History={id:string;order_number:number;action:string;created_at:string;detail:{status?:string;price?:number;paid?:number;maintenance?:string}};
type Detail={client:Client;projects:Project[];history:History[]};
type Due={id:string;order_number:number;title:string;maintenance_next:string;maintenance_fee_cents:number;name:string;phone:string};
type Overview={clients:Client[];stats:{clients:number;projects:number;new_requests:number;maintenance_due:number;outstanding_cents:string};due:Due[]};
const currency=(value:number|string=0)=>new Intl.NumberFormat("en-MY",{style:"currency",currency:"MYR"}).format(Number(value)/100);
const date=(value:string|null)=>value?new Date(value).toLocaleDateString("en-MY",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kuala_Lumpur"}):"—";
const decimal=(value:number)=>(value/100).toFixed(2);
const day=(value:string|null)=>value?.slice(0,10)||"";
async function api(url:string,options?:RequestInit){const r=await fetch(url,{...options,cache:"no-store"});if(r.status===401){window.location.assign("/admin/login");throw new Error("Session expired.");}const data=await r.json();if(!r.ok)throw new Error(data.error||"Request failed.");return data;}

function ProjectEditor({project,onSaved}:{project:Project;onSaved:()=>void}){
 const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [saved,setSaved]=useState(false);
 return <details className="crm-project" open={undefined}>
  <summary><span className="crm-order">#{orderCode(project.order_number)}</span><span className="crm-project-title"><strong>{project.title}</strong><small>{project.service} · {date(project.created_at)}</small></span><span className={`crm-badge badge-${project.status.toLowerCase().replaceAll(" ","-")}`}>{project.status}</span><span className="crm-project-price">{currency(project.price_cents)}</span><span aria-hidden="true">⌄</span></summary>
  <div className="crm-project-body">
   <div className="crm-brief"><span className="crm-eyebrow">CLIENT BRIEF</span><p>{project.brief}</p><small>Contact details are unverified until you confirm the request with the client.</small>
   {(project.submitted_contact.name||project.submitted_contact.email)&&<p className="crm-submitted">Submitted contact: {project.submitted_contact.name} {project.submitted_contact.email} {project.submitted_contact.company}</p>}</div>
   <form onSubmit={async(e)=>{e.preventDefault();if(busy)return;setBusy(true);setError("");setSaved(false);const f=new FormData(e.currentTarget);const v=(key:string)=>String(f.get(key)||"");try{await api(`/api/admin/projects/${project.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({version:project.version,title:v("title"),status:v("status"),price:v("price"),paid:v("paid"),notes:v("notes"),maintenanceStatus:v("maintenanceStatus"),maintenanceFee:v("maintenanceFee"),maintenanceCycle:v("maintenanceCycle"),maintenanceStart:v("maintenanceStart"),maintenanceEnd:v("maintenanceEnd"),maintenanceNext:v("maintenanceNext"),maintenanceNotes:v("maintenanceNotes")})});setSaved(true);onSaved();}catch(err){setError(err instanceof Error?err.message:"Unable to save.");}finally{setBusy(false);}}}>
    <fieldset disabled={busy}><div className="crm-form-grid">
     <label className="crm-span-2">Project name<input name="title" defaultValue={project.title} minLength={3} maxLength={160} required/></label>
     <label>Status<select name="status" defaultValue={project.status}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
     <label>Project price (MYR)<input name="price" type="number" step="0.01" min="0" max="9999999.99" defaultValue={decimal(project.price_cents)} required/></label>
     <label>Amount paid (MYR)<input name="paid" type="number" step="0.01" min="0" max="9999999.99" defaultValue={decimal(project.paid_cents)} required/></label>
     <div className="crm-balance"><small>CURRENT BALANCE</small><strong>{currency(project.price_cents-project.paid_cents)}</strong></div>
     <label className="crm-span-3">Project & payment notes<textarea name="notes" rows={3} maxLength={10000} defaultValue={project.notes} placeholder="Milestones, payment date / reference, delivery arrangements…"/></label>
    </div><div className="crm-subheading"><h3>Maintenance plan</h3><span>Manage the agreement and next service date</span></div>
    <div className="crm-form-grid">
     <label>Maintenance status<select name="maintenanceStatus" defaultValue={project.maintenance_status}>{maintenanceStatuses.map(s=><option key={s}>{s}</option>)}</select></label>
     <label>Fee per cycle (MYR)<input name="maintenanceFee" type="number" min="0" max="9999999.99" step="0.01" defaultValue={decimal(project.maintenance_fee_cents)} required/></label>
     <label>Billing cycle<select name="maintenanceCycle" defaultValue={project.maintenance_cycle}>{cycles.map(s=><option key={s}>{s}</option>)}</select></label>
     <label>Start date<input name="maintenanceStart" type="date" defaultValue={day(project.maintenance_start)}/></label>
     <label>End date (optional)<input name="maintenanceEnd" type="date" defaultValue={day(project.maintenance_end)}/></label>
     <label>Next due / service date<input name="maintenanceNext" type="date" defaultValue={day(project.maintenance_next)}/></label>
     <label className="crm-span-3">Maintenance scope & notes<textarea name="maintenanceNotes" rows={3} maxLength={5000} defaultValue={project.maintenance_notes} placeholder="Hosting, backups, support hours, renewal and service history…"/></label>
    </div><p className="crm-helper">Prices and payments are recorded manually. This workspace does not charge a client or send renewal messages.</p>
    <button className="crm-primary" disabled={busy}>{busy?"Saving…":"Save project & maintenance"}</button></fieldset>
    {error&&<p className="crm-error" role="alert">{error}</p>}{saved&&<p className="crm-success" role="status">Changes saved.</p>}
   </form>
  </div>
 </details>;
}

function ContactEditor({client,onSaved}:{client:Client;onSaved:()=>void}){
 const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
 return <details className="crm-contact-editor"><summary>Edit confirmed contact details</summary><form onSubmit={async(e)=>{e.preventDefault();setBusy(true);setMessage("");const f=new FormData(e.currentTarget);try{await api(`/api/admin/clients/${client.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:f.get("name"),email:f.get("email"),company:f.get("company")})});setMessage("Contact saved.");onSaved();}catch(err){setMessage(err instanceof Error?err.message:"Unable to save.");}finally{setBusy(false);}}}><div className="crm-form-grid"><label>Name<input name="name" defaultValue={client.name} minLength={2} maxLength={120} required/></label><label>Email<input name="email" type="email" defaultValue={client.email} maxLength={254}/></label><label>Company<input name="company" defaultValue={client.company} maxLength={160}/></label></div><button className="crm-secondary" disabled={busy}>{busy?"Saving…":"Save contact"}</button><p role="status">{message}</p></form></details>;
}

export function Dashboard(){
 const [overview,setOverview]=useState<Overview|null>(null);const [detail,setDetail]=useState<Detail|null>(null);const [selected,setSelected]=useState("");const [query,setQuery]=useState("");const [refresh,setRefresh]=useState(0);const [error,setError]=useState("");const [loading,setLoading]=useState(true);const [tab,setTab]=useState("clients");
 useEffect(()=>{const controller=new AbortController();api(`/api/admin/clients?q=${encodeURIComponent(query)}`,{signal:controller.signal}).then(setOverview).catch(err=>{if(!controller.signal.aborted)setError(err.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[query,refresh]);
 useEffect(()=>{if(!selected)return;const controller=new AbortController();api(`/api/admin/clients/${selected}`,{signal:controller.signal}).then(setDetail).catch(err=>{if(!controller.signal.aborted)setError(err.message);});return()=>controller.abort();},[selected,refresh]);
 const reload=()=>{setError("");setRefresh(v=>v+1);};
 return <main className="crm-dashboard">
  <aside className="crm-sidebar"><Link className="crm-brand" href="/">KZ <span>KASUZAZ<br/>TECHNOLOGY</span></Link><p className="crm-eyebrow">YOUR WORKSPACE</p><button className={tab==="clients"?"active":""} onClick={()=>{setTab("clients");setSelected("");setDetail(null);}}>◈ &nbsp; Clients & projects</button><button className={tab==="maintenance"?"active":""} onClick={()=>{setTab("maintenance");setSelected("");}}>◇ &nbsp; Maintenance</button><a href="/" target="_blank" rel="noopener noreferrer">↗ &nbsp; View website</a><div className="crm-sidebar-bottom"><span className="crm-live-dot"/> Private admin workspace<small>Melaka, Malaysia</small></div></aside>
  <div className="crm-main"><header className="crm-topbar"><span>CLIENT STUDIO <i>/</i> {selected?"CLIENT PROFILE":tab.toUpperCase()}</span><div><button onClick={reload} className="crm-secondary">Refresh</button><button className="crm-secondary" onClick={async()=>{try{await api("/api/admin/session",{method:"DELETE"});window.location.assign("/admin/login");}catch(err){setError(err instanceof Error?err.message:"Unable to sign out.");}}}>Sign out</button></div></header>
   {error&&<div className="crm-error" role="alert">{error} <button className="crm-secondary" onClick={reload}>Try again</button></div>}
   {selected?<>
    <button className="crm-back" onClick={()=>{setSelected("");setDetail(null);}}>← All clients</button>
    {!detail?<p className="crm-empty">Loading client…</p>:<><div className="crm-heading"><div><p className="crm-eyebrow">ONE CLIENT. EVERY PROJECT.</p><h1>{detail.client.name}</h1><p>{detail.client.company||"Individual client"} · Client since {date(detail.client.created_at)}</p></div><a className="crm-primary" href={`https://wa.me/${detail.client.phone.replace("+","")}`} target="_blank" rel="noopener noreferrer">Open WhatsApp ↗</a></div>
     <div className="crm-contact-strip"><a href={`tel:${detail.client.phone}`}>{detail.client.phone}</a>{detail.client.email&&<a href={`mailto:${detail.client.email}`}>{detail.client.email}</a>}<span>{detail.projects.length} projects</span></div>
     <ContactEditor client={detail.client} onSaved={reload}/>
     <div className="crm-section-title"><h2>Project history</h2><span>Click an order to manage pricing, payments and maintenance.</span></div>
     {detail.projects.map(p=><ProjectEditor key={p.id} project={p} onSaved={reload}/>)}
     <div className="crm-section-title"><h2>Activity timeline</h2><span>Latest 100 events</span></div><div className="crm-timeline">{detail.history.map(h=><article key={h.id}><i/><div><strong>#{orderCode(h.order_number)} · {h.action}</strong><p>{date(h.created_at)}{h.detail.status?` · ${h.detail.status} · Price ${currency(h.detail.price)} · Paid ${currency(h.detail.paid)} · Maintenance ${h.detail.maintenance}`:""}</p></div></article>)}</div>
    </>}
   </>:<>
    <div className="crm-heading"><div><p className="crm-eyebrow">KASUZAZ TECHNOLOGY / OPERATIONS</p><h1>{tab==="clients"?"Good work starts here.":"Keep every project cared for."}</h1><p>{tab==="clients"?"Every client, every order and every next step. All together.":"Upcoming and overdue maintenance, organised by the next due date."}</p></div><span className="crm-date">{new Date().toLocaleDateString("en-MY",{day:"numeric",month:"long",year:"numeric"})}</span></div>
    <div className="crm-stats"><article><span>CLIENTS</span><strong>{overview?.stats.clients??"—"}</strong><small>Unique phone numbers</small></article><article><span>PROJECTS</span><strong>{overview?.stats.projects??"—"}</strong><small>{overview?.stats.new_requests??0} new requests</small></article><article><span>PROJECT BALANCE</span><strong className="crm-money">{overview?currency(overview.stats.outstanding_cents):"—"}</strong><small>Excludes cancelled projects</small></article><article><span>MAINTENANCE DUE</span><strong>{overview?.stats.maintenance_due??"—"}</strong><small>Due today or overdue</small></article></div>
    {tab==="clients"?<section className="crm-panel"><div className="crm-panel-heading"><div><h2>Client directory</h2><p>One phone number. One client record.</p></div><form className="crm-search" onSubmit={e=>{e.preventDefault();setLoading(true);setError("");setQuery(String(new FormData(e.currentTarget).get("search")||""));setRefresh(v=>v+1);}}><input name="search" aria-label="Search clients" placeholder="Name, phone, project or order #" defaultValue={query}/><button className="crm-secondary">Search</button></form></div>
     {loading?<p className="crm-empty">Loading your workspace…</p>:overview?.clients.length?<div className="crm-table-wrap"><table><thead><tr><th>CLIENT</th><th>PHONE</th><th>PROJECTS</th><th>QUOTED</th><th>PAID</th><th/></tr></thead><tbody>{overview.clients.map(c=><tr key={c.id}><td><strong>{c.name}</strong><small>{c.company||c.email||"Contact awaiting confirmation"}</small></td><td>{c.phone}</td><td>{c.project_count}</td><td>{currency(c.total_cents)}</td><td>{currency(c.paid_cents)}</td><td><button className="crm-open" aria-label={`Open ${c.name}`} onClick={()=>{setDetail(null);setSelected(c.id);setError("");}}>View →</button></td></tr>)}</tbody></table><p className="crm-helper">Showing up to 200 matching clients. Search to narrow the list.</p></div>:<div className="crm-empty"><span>◈</span><h3>{query?"No matching clients":"Your client directory is ready."}</h3><p>{query?"Try a phone number or a four-digit order number.":"New website requests will appear here automatically."}</p><a href="/#contact" className="crm-secondary" target="_blank" rel="noopener noreferrer">Open request form ↗</a></div>}
    </section>:<section className="crm-panel"><div className="crm-panel-heading"><div><h2>Maintenance schedule</h2><p>Overdue plans and the next 30 days. Fees shown per billing cycle.</p></div></div>{overview?.due.length?<div className="crm-table-wrap"><table><thead><tr><th>ORDER / PROJECT</th><th>CLIENT</th><th>NEXT DUE</th><th>FEE</th><th/></tr></thead><tbody>{overview.due.map(d=><tr key={d.id}><td><strong>#{orderCode(d.order_number)} · {d.title}</strong></td><td>{d.name}<small>{d.phone}</small></td><td>{date(d.maintenance_next)}</td><td>{currency(d.maintenance_fee_cents)}</td><td><button className="crm-open" onClick={()=>{setQuery(orderCode(d.order_number));setTab("clients");}}>Find client →</button></td></tr>)}</tbody></table></div>:<div className="crm-empty"><span>◇</span><h3>No maintenance due.</h3><p>Set an active plan and next due date inside any project.</p></div>}</section>}
   </>}
   <footer className="crm-footer">KASUZAZ Client Studio · Prices in MYR · Order references 0001–9999</footer>
  </div>
 </main>;
}
