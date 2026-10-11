export const taxConfig = {
  vatRegistered: false,
  registrationStatusVerified: false, // Verify via YTJ/OmaVero before binding customer documents.
  publicMessage: "Arvonlisäveroa ei veloiteta vähäisen liiketoiminnan perusteella. ALV-asema tarkistetaan ennen sitovan tarjouksen lähettämistä.",
} as const;
