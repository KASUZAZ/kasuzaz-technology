"use client";

import { useRef, useState } from "react";
import { services } from "@/lib/crm/validation";

export function ProjectRequestForm() {
  const [returning,setReturning]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [order,setOrder]=useState("");
  const sending=useRef(false);
  const submission=useRef({body:"",key:""});

  if (order) return <div className="project-form request-receipt" role="status">
    <span className="receipt-check" aria-hidden="true">✓</span>
    <p className="section-kicker">Request received</p><h3>Your next project starts here.</h3>
    <p>Keep this order number for project discussions, collection and payment references.</p>
    <div className="receipt-order"><span>ORDER NUMBER</span><strong>{order}</strong></div>
    <p>Your request is saved. We will contact you to confirm the details and discuss pricing.</p>
    <a className="button button-primary" href={`https://wa.me/601124819812?text=${encodeURIComponent(`Hai KASUZAZ TECHNOLOGY, saya ingin bincang order #${order}.`)}`} target="_blank" rel="noopener noreferrer">Discuss on WhatsApp ↗</a>
    <button className="request-reset" type="button" onClick={()=>{setOrder("");submission.current={body:"",key:""};setReturning(true);}}>Request another project</button>
  </div>;

  return <form className="project-form" onSubmit={async(event)=>{
    event.preventDefault(); if(sending.current)return;
    const form=new FormData(event.currentTarget);
    const field=(name:string)=>String(form.get(name)||"").trim();
    const payload={returning,phone:field("phone"),name:returning?"":field("name"),email:returning?"":field("email"),company:returning?"":field("company"),service:returning?"Custom Systems":field("service"),title:field("title"),message:field("message"),consent:form.get("consent")==="on",website:field("website")};
    const body=JSON.stringify(payload);
    if(submission.current.body!==body)submission.current={body,key:crypto.randomUUID()};
    sending.current=true;setBusy(true);setError("");
    try{
      const response=await fetch("/api/requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...payload,requestKey:submission.current.key})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Unable to send. Please try again.");
      setOrder(data.order);
    }catch(err){setError(err instanceof Error?err.message:"Connection interrupted. Please try again.");}
    finally{sending.current=false;setBusy(false);}
  }}>
    <div className="request-modes" aria-label="Client type">
      <button type="button" aria-pressed={!returning} disabled={busy} onClick={()=>{setReturning(false);setError("");}}>New client</button>
      <button type="button" aria-pressed={returning} disabled={busy} onClick={()=>{setReturning(true);setError("");}}>Returning client</button>
    </div>
    <p className="request-intro">{returning?"Use the same phone number as your first request. Your new project will be grouped with your existing client record.":"Tell us about your project. We’ll save your request and give you a four-digit order number."}</p>
    <fieldset disabled={busy}>
      <div className="form-grid">
        <label><span>Phone / WhatsApp</span><input name="phone" type="tel" autoComplete="tel" placeholder="e.g. 011 2481 9812" maxLength={40} required /><small>Outside Malaysia? Include your country code.</small></label>
        {!returning&&<><label><span>Your name</span><input name="name" autoComplete="name" placeholder="Full name" minLength={2} maxLength={120} required /></label>
        <label><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" maxLength={254} required /></label>
        <label><span>Company (optional)</span><input name="company" autoComplete="organization" placeholder="Company or organisation" maxLength={160}/></label>
        <label><span>Required service</span><select name="service" defaultValue="" required><option value="" disabled>Select a solution</option>{services.map(s=><option key={s}>{s}</option>)}</select></label></>}
        <label><span>Project name</span><input name="title" placeholder="e.g. Company website" minLength={3} maxLength={160} required /></label>
      </div>
      <label><span>Tell us about the project</span><textarea name="message" rows={5} placeholder="What would you like to build? Include your goals and preferred timeline." minLength={10} maxLength={5000} required /></label>
      <div className="request-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="request-consent"><input type="checkbox" name="consent" required/><span>I agree that KASUZAZ TECHNOLOGY may store these details to manage my enquiry, projects and maintenance, and contact me about them. <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy notice</a></span></label>
      <button className="button button-primary form-submit" type="submit">{busy?"Saving your request…":"Send project request →"}</button>
    </fieldset>
    {error&&<p className="request-error" role="alert">{error}</p>}
    <p className="request-footnote">Your details and project history are private. A phone number alone does not provide access to client records.</p>
  </form>;
}
