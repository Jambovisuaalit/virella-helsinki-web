const WHATSAPP_URL = "https://wa.me/message/DJTG6ZBCZXXEF1";

/**
 * Public, user-supplied WhatsApp Business short link.
 * Icon stays recognizable without introducing a new CTA color to Virella's UI.
 */
export function WhatsAppContact() {
  return (
    <a
      className="virella-whatsapp-button"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Avaa WhatsApp-keskustelu (avautuu uuteen välilehteen)"
      title="Ota yhteyttä WhatsAppissa"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        aria-hidden="true"
        className="virella-whatsapp-icon shrink-0"
      >
        <path d="M20.15 11.6a8.15 8.15 0 0 1-12.16 7.12L3.5 20l1.3-4.49A8.15 8.15 0 1 1 20.15 11.6Z" />
        <path d="M8.9 8.1c.16-.28.33-.34.56-.34h.44c.16 0 .31.1.39.28l.85 1.82c.09.18.07.37-.06.53l-.6.68c.47 1 1.29 1.8 2.31 2.32l.67-.63c.15-.13.33-.16.53-.07l1.78.87c.19.09.28.23.28.4v.42c0 .24-.05.4-.34.56-.57.32-1.2.45-1.83.28a8.02 8.02 0 0 1-5.28-5.27c-.18-.62-.05-1.27.3-1.85Z" />
      </svg>
      <span className="hidden text-sm font-semibold tracking-normal sm:inline">WhatsApp</span>
    </a>
  );
}
