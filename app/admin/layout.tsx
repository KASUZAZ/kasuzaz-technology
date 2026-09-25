import type { Metadata } from "next";
import "./admin.css";
export const metadata: Metadata = { title:"Client Studio | KASUZAZ",robots:{index:false,follow:false} };
export default function AdminLayout({children}:{children:React.ReactNode}) {return <div className="crm-shell">{children}</div>;}
