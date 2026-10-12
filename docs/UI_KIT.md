# Virella shared UI kit

The existing dark palette, logo files, routes and section order remain in place.

- `styles/tokens.css` is the source of truth for semantic colors, Inter typography, control dimensions, card surfaces, floating layers and safe-area spacing.
- `styles/components.css` consumes those tokens for the shared buttons, headings, cards, price display, navigation states and mobile bars.
- `ButtonLink` and `BuyButton` share `.ui-button`; consent and public form buttons use the same classes.
- `Card`, home service cards and social pricing cards share `.ui-card` and `.ui-service-card`.
- `PriceDisplay` handles numeric prices, already formatted catalogue labels and quotation-only prices. Prices and commercial terms still come from the existing product configuration.
- The mobile purchase bar reserves space through the footer. WhatsApp moves above the reserve. Open navigation, consent decisions and active forms hide conflicting floating controls.
- Preview robots and deployment targets are unchanged.

## Review gate

`scripts/ui-kit-qa.mjs` captures before/after views at 320×568, 390×844 and 1440×900. It covers the homepage, social service, Instagram, LinkedIn, Landing + SEO, Conversion Fix and intake, plus card, selected-channel, menu, consent and mobile-footer states.

The baseline is the quotation-only correction commit `c222996a204dec750ea290047a74ca40d4e0ad97` from PR #44. The UI PR includes that dependency until it is merged separately. No new price or service decision is made by this UI change.

Automated assertions cover viewport bounds, 44 px action targets, common color/radius values, unchanged section IDs, headings and logo source, keyboard dismissal/focus restoration and floating-action separation. Existing responsive and offer-flow checks remain enabled.

Final visual approval of the three required widths is a user review step; a passing automated run is not that approval.
