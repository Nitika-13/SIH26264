# BUILD_ALL: complete clickable prototype on mock data

You are building the full "AICTE Complaint Monitor" (SIH26264) in one pass, in phases. Everything runs on in-browser mock data. A later step will swap the mock layer for Supabase, so the data layer must be built exactly as specified in section 4.

## 0. Rules (read first)
1. Read AGENTS.md, docs/DESIGN.md, docs/PRODUCT.md and docs/DATA_MODEL.md before writing code. docs/DESIGN.md is law: tokens, fonts, layout rules, banned items. Do not delete or overwrite anything in docs/ or AGENTS.md, except you may update docs/PROGRESS.md.
2. Do not add features that are not in this file. Do not refactor between phases. Do not run long self-checking or test loops: run `npm run build` once at the end of each phase and fix only real errors.
3. Hand-build all components with Tailwind and the design tokens. No UI kit, no default shadcn, no component library. Allowed dependencies: react, react-dom, react-router-dom, tailwindcss, lucide-react, recharts. Nothing else.
4. All text is real, specific, plain English. No lorem ipsum. No emoji as icons. Banned words: seamless, empower, unlock, leverage, streamline.
5. After each phase, append one line to docs/PROGRESS.md (what is done, what is mocked) and print "PHASE n COMPLETE". Keep going to the next phase without asking. The code must be in a runnable state at the end of every phase, so that work is saved if my quota ends.

## 1. Stack and structure
Vite + React + TypeScript + Tailwind + react-router. Create the app in the repo root.
```
src/
  main.tsx, App.tsx, routes.tsx
  styles/tokens.css, styles/index.css
  lib/types.ts, lib/api.ts, lib/mockApi.ts, lib/mockData.ts, lib/i18n.ts, lib/session.ts, lib/time.ts, lib/routing.ts
  components/ (Button, Input, Select, Textarea, FileDrop, StatusBadge, DaysLeft, DataTable, LedgerTimeline, Toast, EmptyState, Tabs, Drawer, UtilityStrip, SiteHeader, TricolourBar, Kpi, BarList, Section)
  pages/ (Landing, Login, FileComplaint, MyComplaints, CaseDetail, Track, OfficerInbox, Leadership, DesignGallery, NotFound)
public/manifest.webmanifest, public/sw.js, public/icons/
```

## 2. Design (implement docs/DESIGN.md exactly; this is a summary, DESIGN.md wins)
- Palette: paper #F7F3EA, surface #FFFFFF, ink #17213B, muted #4F596E, line #D9D2C3, navy #0B2A5B, kesari #E8890C (fills and rules only, never as text colour), kesari-soft #FBE7C6, focus #1F4FB4, flag-green #138808. Status pairs: submitted #4F596E on #ECEAE4, under review #1F4FB4 on #E3EBFA, notice sent #8A5A00 on #FBEBCF, resolved #1E6B4F on #DDEFE7, escalated #B3321F on #F7DDD8.
- Fonts via Google Fonts: Eczar (headings, 600) and Anek Latin, Anek Devanagari, Anek Telugu (body). Fallback stacks as in DESIGN.md. Tabular numerals on all figures, dates and IDs.
- Signature elements: 3px tricolour bar at the very top; 36px navy utility strip with working skip link, text size A- A A+ (100%, 112%, 125%, persisted), English/हिन्दी toggle for the bilingual labels in DESIGN.md (persisted), and an account menu; text-only wordmark "AICTE Complaint Monitor" with a small kesari square mark (no emblem, no AICTE logo); 3px by 48px kesari rule under page titles; jaali diagonal-line pattern only on dividers and empty states; ledger-style history timeline.
- Radius 4px (badges 2px, tables 0). No gradients, glows, blobs, glass or heavy shadows. Min control height 44px. Visible 3px focus ring. Light theme only.
- Never use a row of three identical rounded cards.

## 3. Mock data (src/lib/mockData.ts)
Use a seeded pseudo-random generator so data is the same every load.
- cells (id, name, sla_days): 1 Anti-Ragging Cell 7; 2 Approvals Bureau 15; 3 Finance & Refunds Cell 15; 4 Regional Office 15; 5 Legal Cell 15.
- colleges (id, name, state, region): Sunrise Institute of Technology (Telangana, South); Greenfield Engineering College (Karnataka, South); Lakeview Polytechnic (Maharashtra, West); Apex School of Management (Delhi, North); Nova College of Pharmacy (Uttar Pradesh, North); Heritage Institute of Engineering (West Bengal, East); Riverbend Technical Campus (Gujarat, West); Himalaya Institute of Technology (Uttarakhand, North). Skew complaints so Sunrise has the most (this feeds the repeat-offender alert).
- users: student@demo.test (Aarav Sharma, complainant), officer@demo.test (Meera Iyer, officer, cell 3), leadership@demo.test (R. K. Nair, senior). Also two more officers for other cells (Anti-Ragging: Kavita Menon; Approvals: Imran Qureshi) for the inbox demo.
- 70 complaints created over the last 24 days of the simulated calendar, drawn from 12 realistic complaint texts (fee refunds, unapproved course, ragging, faculty and labs, withheld certificates, double fee, unsafe hostel, placement promise, cancelled admission with deposit not returned, lapsed affiliation, scholarship withheld, fake NAAC claim). Route each with the routing rules in section 5. Give them statuses: about 20% Submitted, 30% Under Review, 20% Notice Sent, 22% Resolved, the rest Escalated (only those truly past due). The demo student owns 3 of them (one Under Review, one Notice Sent, one Submitted).
- Complaint fields (snake_case, same names as the database): id, code ("AICTE-26-" + 5 digits starting 01001), complainant_id, college_id, cell_id, category, urgency ('low'|'normal'|'high'), summary, original_text, translated_text, language, status, routed_by ('rules'|'ai'), created_at, due_date, resolved_at, attachments[].
- case_updates (id, complaint_id, actor_id, actor_role, action, note, old_status, new_status, visible_to_complainant, created_at): every complaint gets a "Received" entry; non-Submitted ones get realistic officer entries ("Case accepted for review", "Notice sent to college seeking an explanation within 7 days", "College replied with a refund receipt. Case closed.").
- notifications_log (id, complaint_id, channel 'email', recipient, message, sent_at) entries for each Notice Sent.

## 4. Data layer contract (src/lib/api.ts and mockApi.ts). Do not deviate.
All pages import ONLY from src/lib/api.ts. api.ts exports an interface `Api` and a single `api` object. Implement it in mockApi.ts. All methods are async and take 150 to 400 ms (small delay for realism). Mock state lives in memory and is persisted to localStorage under the key "sih26264-mock-v1"; a "Reset demo data" action clears it.
```
signIn(email): Promise<Session>            // mock: any of the 5 demo emails, no password check
signOut(): Promise<void>
getSession(): Session | null
listColleges(): Promise<College[]>
listCells(): Promise<Cell[]>
createComplaint(input:{college_id:number, original_text:string, files:{name:string,size:number,type:string}[]}): Promise<Complaint>
listMyComplaints(): Promise<Complaint[]>
getComplaintByCode(code:string): Promise<ComplaintDetail>   // complaint + updates + attachments + college + cell
trackByCode(code:string): Promise<PublicTrack|null>          // limited public fields: code,status,cell,college,created_at,due_date,timeline[{action,at}]
listCases(filter:{cell_id?:number,status?:string,college_id?:number,overdueOnly?:boolean}): Promise<CaseRow[]>
updateCase(id:string, patch:{status?:Status,note?:string,notice?:boolean}): Promise<void>  // writes case_updates, notifications_log when notice, sets resolved_at, permission-checked by role and cell
similarCases(id:string): Promise<CaseRow[]>                  // same college and category, last 30 days
listNotifications(): Promise<NotificationRow[]>
getKpis(): Promise<{total,open_cases,resolved,escalated,sla_breach_pct,avg_resolution_days}>
getByCollege(): Promise<{college,state,total,open_cases,escalated}[]>
getByCell(): Promise<{cell,total,open_cases,escalated,avg_resolution_days}[]>
getByCategory(): Promise<{category,total}[]>
getTrend(): Promise<{week,total}[]>
getRepeatOffenders(): Promise<{college,category,cases_30d}[]>   // 3+ in 30 days
escalateOverdue(): Promise<number>
simulateDays(n:number): Promise<number>                          // shifts every open due_date back n days, then escalates; senior only
resetDemo(): Promise<void>
```
Permissions in the mock: a complainant sees only their own complaints; an officer sees only their cell; senior sees all; throw a typed error otherwise. The audit trail is append-only: no function edits or deletes case_updates.
Time: src/lib/time.ts exports `now()` (real clock) so simulateDays works by moving due dates, not the clock.

## 5. Routing (src/lib/routing.ts)
Keyword routing, case-insensitive, evaluated in this order:
1. ragg|bully|bullied|abus|torment|रैगिंग -> Anti-Ragging Cell, urgency high
2. unapproved|not approved|approval|affiliat|recogni|मान्यता -> Approvals Bureau
3. fee|refund|deposit|scholarship|fine|फीस|वापसी|रिफंड -> Finance & Refunds Cell
4. hostel|lab|faculty|infrastructure|classroom|library -> Regional Office
5. otherwise -> Legal Cell
due_date = created_at + the cell's sla_days.
"AI step" simulation in createComplaint: after the keyword result, wait 1.2 s, then set routed_by='ai', write a one-line English summary (first 12 words, tidied), detect language (Devanagari range -> 'hi', Telugu range -> 'te', else 'en'), and for hi/te text set translated_text from a small dictionary of the sample complaints in section 6. If not in the dictionary, set translated_text to "Automatic translation will appear here once the Gemini service is connected." Add a case_updates entry "Routed by AI to <cell>". The confirmation page must show a short "Routing…" state, then the final cell with a small label "Routed by AI" or "Routed by keyword rules".

## 6. Pages (build exactly these routes)
Public layout: tricolour bar, utility strip, header (wordmark + navigation + login or account), main (id="main"), footer with the bilingual line and "Demo prototype. All data is fictional."

1. `/` Landing.
2. `/login` Three large "Continue as" rows.
3. `/file` (complainant only) Single column, four labelled sections.
4. `/my` Table of the user's complaints.
5. `/case/:code` Header with ID and StatusBadge. Two columns (7/5 unequal).
6. `/track` Public. Enter an ID.
7. `/officer` (officer, senior) Left filter rail, Centre DataTable, Right Drawer.
8. `/leadership` (senior only) Top ledger strip of five figures, ranked horizontal bars, weekly trend line chart.
9. `/design` Component gallery showing every component in every state.
10. `*` NotFound.

## 7. Demo controls (senior only, in the utility strip account menu)
"Simulate 16 days passing", "Run escalation check", "Reset demo data", and "Switch role" list.

## 8. Components behaviour
StatusBadge, DaysLeft, LedgerTimeline, Toast, All forms, i18n.

## 9. Responsiveness and accessibility
Mobile first, 375, 768, 1280px.

## 10. PWA
manifest.webmanifest, minimal sw.js.

## 11. Phases
Phase 1: scaffold, tokens, fonts, shell, all components, types, api.ts, mockApi, mockData, routing.ts, i18n, `/design`, login and guards. Run `npm run build` once.
Phase 2: Landing, FileComplaint, MyComplaints, CaseDetail, Track.
Phase 3: OfficerInbox with drawer, actions, notifications panel.
Phase 4: Leadership with charts, demo controls, simulateDays.
Phase 5: polish pass, PWA, README, .env.example.
