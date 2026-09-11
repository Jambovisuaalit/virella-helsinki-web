import Script from "next/script";

const bootstrap = `
window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};
window.va("beforeSend", function (event) {
  try {
    var url = new URL(event.url);
    if (url.pathname.indexOf("/admin") === 0) return null;
    url.search = "";
    url.hash = "";
    return Object.assign({}, event, { url: url.toString() });
  } catch (_) {
    return event;
  }
});
`;

export function VercelAnalytics() {
  if (process.env.VERCEL_ENV !== "production") return null;

  return (
    <>
      <Script id="virella-analytics-bootstrap" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
    </>
  );
}
