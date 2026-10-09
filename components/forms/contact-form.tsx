"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type ContactFormProps = {
  children: ReactNode;
  initialError?: string;
};

function errorMessage(error: string) {
  return error === "invalid"
    ? "Tarkista pakolliset kentät ja sähköpostiosoite. Kirjoittamasi tiedot ovat edelleen lomakkeella."
    : "Lähetys ei onnistunut. Kirjoittamasi tiedot ovat edelleen lomakkeella. Yritä uudelleen tai ota yhteyttä sivun alareunan yhteystiedoilla.";
}

export function ContactForm({ children, initialError }: ContactFormProps) {
  const router = useRouter();
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [error, setError] = useState(initialError
    ? initialError === "invalid"
      ? "Tarkista pakolliset kentät ja sähköpostiosoite ja yritä uudelleen."
      : "Lähetys ei onnistunut. Yritä uudelleen tai ota yhteyttä sivun alareunan yhteystiedoilla."
    : "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;

    const formData = new FormData(event.currentTarget);
    busy.current = true;
    setPending(true);
    setError("");
    setSimulated(false);
    let navigating = false;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result: { ok?: boolean; simulated?: boolean; error?: string; redirect?: string } = await response.json();

      if (response.ok && result.ok && result.simulated === true) {
        setSimulated(true);
        return;
      }

      if (!response.ok || !result.ok || !result.redirect?.startsWith("/aloita?")) {
        setError(errorMessage(result.error ?? "send"));
        return;
      }

      router.push(result.redirect);
      navigating = true;
    } catch {
      setError(errorMessage("send"));
    } finally {
      if (!navigating) {
        busy.current = false;
        setPending(false);
      }
    }
  }

  return (
    <form action="/api/contact" method="post" onSubmit={submit} className="space-y-5" aria-label="Aloituspyyntö" aria-busy={pending}>
      {children}
      {simulated ? <p role="status" className="rounded-xl border border-border bg-surface p-4 text-sm font-semibold">TESTI onnistui Preview-ympäristössä: lomake validoitiin. Sähköpostia ei lähetetty eikä asiakasliidiä tallennettu.</p> : null}
      {error ? <p role="alert" className="rounded-xl border border-action/20 bg-action/5 p-4 text-sm font-semibold text-action">{error}</p> : null}
      <button type="submit" disabled={pending} className="min-h-12 w-full rounded-full bg-action px-5 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-70 sm:w-auto">
        {pending ? "Lähetetään…" : "Lähetä aloituspyyntö"}
      </button>
      <p role="status" className="sr-only">{pending ? "Aloituspyyntöä lähetetään." : ""}</p>
    </form>
  );
}
