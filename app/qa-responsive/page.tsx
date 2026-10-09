import type { Metadata } from "next";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function ResponsiveQA({ searchParams }: { searchParams: Promise<{ widths?: string }> }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  const params = await searchParams;
  const widths = (params.widths ?? "320,360,375,390,430,768,1024,1280,1440").split(",").map(Number).filter((width) => Number.isInteger(width) && width >= 320 && width <= 1600).slice(0, 9);
  return <main style={{ display: "flex", gap: 24, padding: 16, width: "max-content", alignItems: "start" }}>
    {widths.map((width) => <section key={width}><h1 style={{ padding: 8 }}>{width} px</h1><iframe title={`Landing page ${width} px`} src="/" width={width} height={1100} style={{ border: "1px solid #ccc" }} /></section>)}
  </main>;
}
