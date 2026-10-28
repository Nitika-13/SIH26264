
# Product: AICTE Complaint Monitoring Dashboard (SIH26264)

Problem statement: Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells.

## Users

1. Complainant (student, parent, teacher): files and tracks complaints, mostly on mobile.
2. Officer (AICTE cell staff): reviews and acts on cases, mostly on desktop.
3. Senior officer / Chairman's Office: receives escalations, views analytics.
4. Admin: manages users, colleges and cells.

## Cells (routing targets)

Anti-Ragging Cell, Approvals Bureau, Finance & Refunds Cell, Regional Office, Legal Cell.

## Statuses

Submitted, Under Review, Notice Sent, Resolved, Escalated.

## Core flow

1. Complaint submission with attachments (receipts, emails, screenshots).
2. Automatic routing to the correct cell using AI, with a keyword-rule fallback.
3. Officer reviews, contacts the college, updates status and notes.
4. Complainant tracks live status, officer notes and stage. A public tracking page works by complaint ID.
5. SLA of 15 days. Overdue cases auto-escalate to senior management.
6. Leadership analytics: complaints by college, category and cell; delays by cell; repeat offenders.

## Principles

- Transparency: every action is written to an audit trail.
- Plain language for complainants; dense and fast for officers.
- Multilingual: English, Hindi, Telugu.

## Out of scope for the prototype

Native mobile app (use a responsive PWA), real AICTE login, real SMS/WhatsApp.
