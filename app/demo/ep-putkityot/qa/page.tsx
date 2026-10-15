import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "EP Putkityöt — responsive QA" },
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440];

export default async function ResponsiveQa({ searchParams }: { searchParams: Promise<{ width?: string }> }) {
  const query = await searchParams;
  const requested = Number(query.width);
  const width = widths.includes(requested) ? requested : 390;
  return (
    <main style={{ background: "#e3e7e5", color: "#152c3b", minHeight: "100vh", padding: 20, overflow: "auto" }}>
      <nav aria-label="QA screen width" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        {widths.map(value => <a key={value} href={`?width=${value}`} aria-current={value === width ? "page" : undefined} style={{ padding: 10, background: value === width ? "#d9ee9a" : "white", color: "#152c3b" }}>{value} px</a>)}
      </nav>
      <p>Responsive QA · {width} px · vieritä esikatselun sisällä</p>
      <iframe title={`EP Putkityöt preview at ${width}px`} src="/demo/ep-putkityot" width={width} height={900} style={{ display: "block", border: 0, maxWidth: "none", margin: "20px auto", background: "#f5f4ee" }} />
    </main>
  );
}
