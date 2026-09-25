import Link from "next/link";
import { LoginForm } from "./login-form";
export default function LoginPage(){return <main className="crm-login"><Link href="/" className="crm-brand">KZ <span>KASUZAZ TECHNOLOGY</span></Link><div className="crm-login-card"><p className="crm-eyebrow">PRIVATE WORKSPACE</p><h1>Client Studio.</h1><p>Manage your clients, projects and ongoing care in one place.</p><LoginForm/></div><p className="crm-login-note">Authorised administrator access only.</p></main>;}
