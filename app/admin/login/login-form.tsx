"use client";
import { useState } from "react";
export function LoginForm(){
 const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 return <form onSubmit={async(e)=>{e.preventDefault();if(busy)return;setBusy(true);setError("");const password=String(new FormData(e.currentTarget).get("password")||"");try{const r=await fetch("/api/admin/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});const data=await r.json();if(!r.ok)throw new Error(data.error);window.location.assign("/admin");}catch(err){setError(err instanceof Error?err.message:"Unable to sign in.");setBusy(false);}}}>
 <label>Admin password<input type="password" name="password" autoComplete="current-password" required maxLength={256}/></label><button className="crm-primary" disabled={busy}>{busy?"Signing in…":"Enter workspace →"}</button>{error&&<p role="alert" className="crm-error">{error}</p>}</form>;
}
