/** Owner-confirmed VAT status on 11 October 2026; not an independent live registry check. */
export const taxConfig = {
  vatRegistered: false,
  registrationStatusVerified: true,
  registrationEvidence: "Yrittäjän vahvistus 11.10.2026 ja käyttäjän toimittama YTJ-ote",
  exemptionEligibilityVerified: true, // Owner confirmation, not an independent turnover audit.
  publicMessage: "Hintoihin ei lisätä arvonlisäveroa. Myyjä ei ole ALV-rekisterissä.",
} as const;
