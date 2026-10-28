
# Data model (draft)

- profiles: id, full_name, role (complainant | officer | senior | admin), cell_id (nullable), language
- cells: id, name, sla_days
- colleges: id, name, state, region
- complaints: id (public complaint ID), complainant_id, college_id, cell_id, category, urgency, summary, original_text, translated_text, language, status, due_date, routed_by (ai | rules), created_at, resolved_at
- case_updates: id, complaint_id, actor_id, actor_role, action, note, old_status, new_status, created_at (append-only audit trail)
- attachments: id, complaint_id, file_path, file_name, mime_type, size
- notifications_log: id, complaint_id, channel, recipient, message, sent_at

Access rules (RLS): complainants see only their own complaints; officers see their cell's complaints; senior and admin see all.
