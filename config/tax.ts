/** YTJ registration evidence was supplied by the business owner on 2026-10-11.
 * The official YTJ excerpt lists only "Verohallinnon perustiedot" since 2025-11-24,
 * with no entry for Arvonlisäverovelvollisten rekisteri.
 * This is owner-supplied documentary evidence, NOT an independent live API check.
 * The owner explicitly reconfirmed on 2026-10-11 that the sole proprietorship is not VAT liable.
 * Turnover reconciliation and monitoring against the EUR 20,000 per-calendar-year
 * threshold remain separate ongoing accounting controls.
 */
export const taxConfig = {
  vatRegistered: false,
  registrationStatusVerified: true, // Verified against owner-supplied YTJ extract, not a live lookup.
  registrationEvidence: "YTJ-ote käyttäjän toimittamana 11.10.2026: voimassa vain Verohallinnon perustiedot 24.11.2025 alkaen",
  exemptionEligibilityVerified: true, // Owner's 2026-10-11 confirmation; not an independent OmaVero check.
  confirmationSource: "Yrittäjän nimenomainen vahvistus 11.10.2026: ei ALV-velvollinen",
  publicMessage: "Arvonlisäveroa ei veloiteta vähäisen liiketoiminnan perusteella.",
} as const;
