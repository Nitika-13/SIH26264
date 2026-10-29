# AICTE OneView: Integrated Complaint Monitoring & Tracking Dashboard (SIH26264)

> **Official Problem Statement 26264:** Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells.
> **Theme:** Smart Automation / Software · **Department:** Regulation Bureau, AICTE

"One Institution. One Consolidated View." An integrated, single-window dashboard connecting institution-related complaint records across participating AICTE Bureaus and Cells (Regulation Bureau, Public Grievance Redressal Cell, Anti-Ragging Cell, Approvals Bureau, Finance & Refunds Cell, Regional Offices, Legal Cell).

---

## 1. Quick Start

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### Installation & Run
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

To run a production build:
```bash
npm run build
npm run preview
```

---

## 2. Demo User Accounts

No password required in demo prototype mode. You can sign in via `/login` or quickly switch roles anytime via the top-right account menu in the Navy Utility Strip:

| Role | Name | Email | Permissions / View |
|---|---|---|---|
| **Complainant** (Student/Parent) | Aarav Sharma | `student@demo.test` | Files grievances, tracks personal cases, submits documents |
| **Desk Officer** (Finance Cell) | Meera Iyer | `officer@demo.test` | Desk scrutiny for Cell 3, notice dispatch, case closure |
| **Desk Officer** (Anti-Ragging) | Kavita Menon | `ragging.officer@demo.test` | Anti-ragging cell cases, 7-day high-urgency SLA |
| **Desk Officer** (Approvals) | Imran Qureshi | `approvals.officer@demo.test` | Approvals bureau, affiliation & accreditation cases |
| **Leadership** (Chairman's Office) | R. K. Nair | `leadership@demo.test` | Multi-bureau analytics, SLA breach alerts, repeat offenders, simulation controls |

---

## 3. Key Capabilities & Innovation

### 1. Centralized Institution Profile (AICTE Permanent ID)
Consolidates the full history of complaints, regulatory actions, and status for each campus under a unique **AICTE Permanent ID** (e.g. `1-10928374`).

### 2. Cross-Bureau / Cell Overlap Detection Engine
- Automatically identifies when complaints concerning the same institution are received across multiple Bureaus/Cells (e.g., PGRC and RB).
- Displays explainable alerts: `“Potential Overlapping Cases – Coordination Required”`.
- Shows clear match evidence (same AICTE ID, related complaint categories, concurrent open review windows).
- Supports human-in-the-loop review, case linking, and joint inter-bureau coordination without deleting individual complaint identities.

### 3. Transparent Case Scrutiny & Ledger Timeline
- Immutable, chronological case audit ledger (`Date/Time · Officer · Action · Remark`).
- Bilingual grievance text support (English, Hindi, Telugu) with AI translation toggles.
- Formal notice dispatch dialog prefilled with statutory 7-day college explanation templates.

### 4. SLA Timelines & Automatic Escalation
- Strict response windows (7 days for Anti-Ragging, 15 days for standard Bureaus).
- Automatic auto-escalation to the Chairman's Office when deadlines expire.
- Interactive **"Simulate 16 days passing"** tool in the Senior menu to demonstrate automatic SLA breach handling.

### 5. Leadership Analytics & Repeat-Offender Surveillance
- Interactive Recharts weekly inflow trends with accessible data tables.
- Ranked horizontal bar lists of institutional complaint density.
- Real-time **Repeat-Offender Detection** flagging colleges with 3+ similar grievances in 30 days.

---

## 4. Design Standards ("Daftar-Setu")

Designed in strict compliance with `docs/DESIGN.md`:
- **Typography:** Eczar (headings, 600) and Anek Latin, Anek Devanagari, Anek Telugu (body). Tabular numerals on all dates, figures, and IDs.
- **Palette:** Warm paper `#F7F3EA`, crisp navy `#0B2A5B`, saffron/kesari `#E8890C` rule accents, and WCAG AA contrast status pairs.
- **Accessibility:** 36px Navy utility strip with working text size scaling (**A- A A+**: 100%, 112%, 125%), working skip link, visible 3px focus rings, keyboard row navigation (`ArrowUp`/`ArrowDown`/`Enter`), and bilingual English/हिन्दी interface toggle.
- **PWA:** Installable standalone web application with service worker caching.

---

## 5. Walkthrough & Verification Steps

1. **Submit a Grievance:**
   - Sign in as `student@demo.test`.
   - Go to `/file`.
   - Select the Hindi sample complaint for fee refund and attach a PDF receipt.
   - Click submit: observe the AI routing step, assignation to **Finance & Refunds Cell**, and receipt generation (`AICTE-26-XXXXX`).
2. **Public Tracking:**
   - Open `/track` and query the generated complaint ID.
   - View public action milestones and statutory deadlines (internal officer notes are protected).
3. **Officer Scrutiny & Notice Dispatch:**
   - Sign in as `officer@demo.test`.
   - Open `/officer`. The complaint appears in the desk inbox sorted by due date.
   - Click the row to open the scrutiny drawer. Toggle between Hindi original and English translation.
   - Click **Send Notice** to dispatch a formal 7-day explanation notice to the college.
4. **Leadership Analytics & Escalation Simulation:**
   - Sign in as `leadership@demo.test`.
   - Go to `/leadership`.
   - Inspect KPIs, ranked bar charts, repeat-offender alerts for Sunrise Institute, and weekly trend graphs.
   - Click **Simulate 16 Days**: due dates shift backward, statutory deadlines expire, and breached cases auto-escalate into the Chairman's review table.
   - Click **Reset Demo Data** to restore the default seeded state at any time.
