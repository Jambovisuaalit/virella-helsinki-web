import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function ResponsiveQA({searchParams}: {searchParams: Promise<{widths?: string}>}) {
  if (process.env.VERCEL_ENV === "production") notFound();
  const params = await searchParams;
  const widths = (params.widths || "320,390,430").split(",").map(Number).filter(w => w >= 320 && w <= 1600).slice(0,9);
  return <main style={{padding: 12, display:"flex", gap:16, alignItems:"start", width:"max-content"}}>
    {widths.map(width => <section key={width}><h1 style={{fontSize:16,margin:"0 0 12px"}}>{width} px</h1><iframe title={width + " px preview"} src="/" width={width} height="840" style={{display:"block",border:"1px solid #ccd"}} /></section>)}
  </main>;
}