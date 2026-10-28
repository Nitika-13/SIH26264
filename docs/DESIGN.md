


# DESIGN.md: "Daftar-Setu"

Concept: a well-kept government register (warm paper, dark ink, one saffron rule) under the crisp navy utility strip people already know from official portals. Calm, trustworthy, clearly Indian through typography and structure, not clip art.

## Principles

1. Clarity first. One main action per screen. Plain verbs, sentence case.
2. Indian by type and structure: bilingual labels, Devanagari and Telugu capable fonts, a tricolour hairline, a jaali line pattern on dividers and empty states only.
3. Density follows the user. Roomy and mobile-first for complainants. Compact and fast for officers and leadership.
4. Status is never colour alone. Always icon plus text.
5. Accessibility is a feature: WCAG AA contrast, visible focus, full keyboard use, working text-size control.

## Colour tokens

```css
:root{
  --paper:#F7F3EA;      /* page background */
  --surface:#FFFFFF;    /* tables, forms, drawers */
  --ink:#17213B;        /* body text */
  --muted:#4F596E;      /* secondary text */
  --line:#D9D2C3;       /* borders, rules */
  --navy:#0B2A5B;       /* utility strip, primary buttons, header */
  --on-navy:#FFFFFF;
  --kesari:#E8890C;     /* fills and rules ONLY, text on it is --ink. Never use as text colour. */
  --kesari-soft:#FBE7C6;
  --focus:#1F4FB4;      /* 3px focus ring, offset 2px */
  --flag-green:#138808; /* tricolour hairline only */

  --st-submitted:#4F596E;  --st-submitted-bg:#ECEAE4;
  --st-review:#1F4FB4;     --st-review-bg:#E3EBFA;
  --st-notice:#8A5A00;     --st-notice-bg:#FBEBCF;
  --st-resolved:#1E6B4F;   --st-resolved-bg:#DDEFE7;
  --st-escalated:#B3321F;  --st-escalated-bg:#F7DDD8;
}
```

Verify contrast with a checker before release. Light theme only for the prototype.

## Typography

Google Fonts link (confirm each family exists with Devanagari and Telugu on fonts.google.com; fall back to Noto Sans for a missing script):
`family=Eczar:wght@500;600;700&family=Anek+Latin:wght@400;500;600;700&family=Anek+Devanagari:wght@400;500;600;700&family=Anek+Telugu:wght@400;500;600;700`

- Display and H1 and H2: `"Eczar","Anek Devanagari","Anek Telugu",Georgia,serif`, weight 600.
- Everything else (body, tables, forms, buttons): `"Anek Latin","Anek Devanagari","Anek Telugu",system-ui,sans-serif`.
- All numbers, dates and IDs: `font-variant-numeric: tabular-nums`.

| Token   | Size / line          | Use                                     |
| ------- | -------------------- | --------------------------------------- |
| display | 44/48 (mobile 32/38) | landing headline only                   |
| h1      | 32/38 (mobile 26/32) | page titles                             |
| h2      | 24/30                | section titles                          |
| h3      | 18/26, sans 600      | card and panel titles                   |
| body    | 16/24                | default, never below 16 on mobile forms |
| small   | 14/20                | table cells, helper text                |
| caption | 12.5/16              | metadata                                |

Text-size control in the utility strip scales the root size to 100%, 112%, 125% and remembers the choice.

## Spacing, shape, depth

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64. Nothing off the scale.
- Radius: 4px for inputs, buttons, panels. 2px for status badges. 0 for tables.
- No gradients, glows, blobs, glass or heavy shadows. Depth is a 1px `--line` border. One soft shadow allowed on the officer drawer and toasts.
- Max content width 1120px. Officer and leadership screens may go to 1360px.

## Signature elements

1. **Tricolour hairline:** a 3px bar at the very top of every page (kesari, white, flag-green thirds).
2. **Utility strip** (navy, 36px): left "भारत सरकार | Government of India" style line reading "Grievance portal · शिकायत पोर्टल", skip to main content, text size A- A A+, language switch (English / हिन्दी), login or account. These must really work.
3. **Wordmark:** text only, "AICTE Complaint Monitor" in Eczar with a small kesari square mark. Do not use the State Emblem or the AICTE logo in the prototype.
4. **Kesari rule:** a 3px kesari underline beneath page titles, 48px wide.
5. **Jaali pattern:** a thin diagonal line pattern (`repeating-linear-gradient`, 1px lines in `--line`) used only on dividers and empty states.
6. **Ledger timeline:** case history is a dated ledger, a left rule with entries "Day, date · actor · action · note". Not chat bubbles.

## Layout by audience

- **Public and complainant (mobile first):** asymmetric landing. Left: display headline and one sentence. Right: a plain "Track by complaint ID" box above a primary "File a complaint" button. Below: a 4-step "What happens next" list as a vertical numbered ledger (not cards). Filing is a single column, one section per question, with a "Step 2 of 4" note.
- **Officer (desktop first):** left filter rail (cell, status, college, overdue), centre table sorted by due date, right drawer for case detail with tabs: Complaint, History, Similar cases. Table rows are 40px, sticky header.
- **Leadership:** a ledger strip of five large figures, then ranked horizontal bars and one trend line, in a strict two-column layout with unequal widths (7/5). No grid of identical cards.
- Never use a three-column grid of identical rounded cards anywhere.

## Components

- **Status badge:** 2px radius, text plus a leading icon (circle outline, magnifier, envelope, check, alert triangle for the five statuses), using the `--st-*` pair.
- **Days-left chip:** "9 days left", "Due today", "3 days overdue" (escalated colour). Resolved shows "Closed".
- **Buttons:** primary navy with white text, secondary outline navy, kesari only for the single highest-emphasis call to action on a page, with ink text. Min height 44px.
- **Inputs:** 44px height, visible label above (never placeholder-only), error text below with an icon.
- **Table:** 14px text, zebra off, 1px bottom borders, row hover `--kesari-soft`.
- **Empty, loading, error:** each has a message in plain language and a next action. Empty states use the jaali pattern.
- **Toast:** bottom centre, 4 seconds, role="status".

## Bilingual labels (English · Hindi). Have a Hindi speaker check these.

File a complaint · शिकायत दर्ज करें
Track complaint · शिकायत की स्थिति देखें
My complaints · मेरी शिकायतें
Complaint ID · शिकायत संख्या
Status · स्थिति
Submitted · प्रस्तुत
Under review · समीक्षाधीन
Notice sent · नोटिस भेजा गया
Resolved · निस्तारित
Escalated · उच्च स्तर पर भेजा गया
Days left · शेष दिन
Login · लॉग इन
Skip to main content · मुख्य सामग्री पर जाएँ

Only the utility strip, navigation and the labels above are translated in the interface. Complaint text is translated by Gemini, not by the UI.

## Copy rules

Plain verbs, sentence case, short sentences. Say "Your complaint has been sent to the Finance and Refunds Cell", not "Your request has been successfully submitted". Banned words: seamless, empower, unlock, leverage, revolutionise, streamline.

## Never

Inter, Roboto, Arial, Space Grotesk, Poppins. Purple or blue gradients. Glow, blobs, glass. Cartoon illustrations. Emoji as icons (use a single line-icon set such as Lucide). Lorem ipsum. Placeholder-only labels. Colour-only status. Three identical rounded cards in a row. Default shadcn or Tailwind component styling.

## Accessibility checklist

Skip link works. Focus ring visible on every control. Tab order follows reading order. Tables have header scope. Form errors are announced. Touch targets at least 44px. Works at 375px, 768px and 1280px. Respect `prefers-reduced-motion`; use almost no motion.
