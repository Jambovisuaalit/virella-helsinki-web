/** YTJ registration evidence was supplied by the business owner on 2026-10-11.
 * The official YTJ excerpt lists only "Verohallinnon perustiedot" since 2025-11-24,
 * with no entry for Arvonlisäverovelvollisten rekisteri.
 * This is owner-supplied documentary evidence, NOT an independent live API check.
 * VAT exemption eligibility still needs turnover checks for both 2025 and 2026
 * against the EUR 20,000 per-calendar-year threshold, plus other VAT grounds.
 */
export const taxConfig = {
  vatRegistered: false,
  registrationStatusVerified: true, // Verified against owner-supplied YTJ extract, not a live lookup.
  registrationEvidence: "YTJ-ote käyttäjän toimittamana 11.10.2026: voimassa vain Verohallinnon perustiedot 24.11.2025 alkaen",
  exemptionEligibilityVerified: false, // 2025 and 2026 turnover and special VAT obligations unverified.
  publicMessage: "ALV-käsittely vahvistetaan kirjallisessa tarjouksessa. Toimitetun YTJ-otteen mukaan yritys ei ole ALV-rekisterissä.",
} as const;
