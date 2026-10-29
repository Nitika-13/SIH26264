import { Cell, College, Complaint, CaseUpdate, NotificationRow } from './types';
import { routeComplaintKeywords } from './routing';

export const INITIAL_CELLS: Cell[] = [
  { id: 1, name: 'Anti-Ragging Cell', sla_days: 7 },
  { id: 2, name: 'Approvals Bureau', sla_days: 15 },
  { id: 3, name: 'Finance & Refunds Cell', sla_days: 15 },
  { id: 4, name: 'Regional Office', sla_days: 15 },
  { id: 5, name: 'Legal Cell', sla_days: 15 },
];

export const INITIAL_COLLEGES: College[] = [
  { id: 1, name: 'Sunrise Institute of Technology', state: 'Telangana', region: 'South', aicte_id: '1-10928374' },
  { id: 2, name: 'Greenfield Engineering College', state: 'Karnataka', region: 'South', aicte_id: '1-20938475' },
  { id: 3, name: 'Lakeview Polytechnic', state: 'Maharashtra', region: 'West', aicte_id: '1-30948586' },
  { id: 4, name: 'Apex School of Management', state: 'Delhi', region: 'North', aicte_id: '1-40958697' },
  { id: 5, name: 'Nova College of Pharmacy', state: 'Uttar Pradesh', region: 'North', aicte_id: '1-50968708' },
  { id: 6, name: 'Heritage Institute of Engineering', state: 'West Bengal', region: 'East', aicte_id: '1-60978819' },
  { id: 7, name: 'Riverbend Technical Campus', state: 'Gujarat', region: 'West', aicte_id: '1-70988920' },
  { id: 8, name: 'Himalaya Institute of Technology', state: 'Uttarakhand', region: 'North', aicte_id: '1-80999031' },
];

// Seeded pseudo-random number generator (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COMPLAINT_TEMPLATES = [
  {
    text: "I cancelled my admission before the cut-off date, but the institute refused to refund my caution deposit and tuition fee of Rs 85,000 despite multiple written requests.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "The institute is offering an unapproved artificial intelligence diploma without AICTE accreditation, putting our future at risk.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "Senior students in the boys hostel have been subjecting first-year students to severe mental harassment, bullying and late-night physical tasks for the past two weeks.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "Computer science labs have non-functional systems and lack licensed compilers. Regular faculty have not taken practical classes this semester.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "College management is withholding my original 10th and 12th certificates after I completed my degree, demanding an illegal processing fine.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "The accounts office charged double exam fees and development fees not listed in the approved AICTE prospectus, without providing official receipts.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "Hostel building has serious electrical safety hazards with exposed wiring in corridors and non-potable water supplied to student rooms.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "The placement cell made false claims of 100% placement with marquee employers in promotional brochures, but zero campus recruitment drives were held.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "Admission cancelled in August before seat allocation closure, but the refund has not been credited back to the parent account after five months.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "The engineering programme's affiliation lapsed two years ago, but management admitted 120 new candidates under misleading claims.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "Post-matric state scholarship funds credited to the institute for eligible reserved category students have not been disbursed to beneficiaries.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "The management advertised fake NAAC A+ accreditation status and forged regulatory approvals in newspapers to attract new admissions.",
    lang: 'en' as const,
    trans: undefined
  },
  {
    text: "मैंने प्रवेश रद्द करने का आवेदन अंतिम तिथि से पहले जमा कर दिया था, लेकिन कॉलेज ने अभी तक मेरी 85,000 रुपये की फीस और धरोहर राशि वापस नहीं की है।",
    lang: 'hi' as const,
    trans: "I submitted my admission cancellation application before the deadline, but the college has not yet refunded my fee of Rs 85,000 and security deposit."
  },
  {
    text: "संस्थान द्वारा संचालित कंप्यूटर साइंस का डिप्लोमा पाठ्यक्रम एआईसीटीई द्वारा मान्यता प्राप्त नहीं है, छात्रों को धोखे में रखा गया है।",
    lang: 'hi' as const,
    trans: "The Computer Science diploma course run by the institute is not approved by AICTE; students have been kept in the dark."
  },
  {
    text: "మా కళాశాలలో కంప్యూటర్ ల్యాబ్ మరియు లైబ్రరీ వసతులు సరిగ్గా లేవు, ప్రాక్టికల్ పరీక్షలు నిర్వహించడానికి అవసరమైన పరికరాలు లేవు.",
    lang: 'te' as const,
    trans: "In our college, computer lab and library facilities are not proper, and there is no equipment required to conduct practical examinations."
  }
];

export function generateSeedData(): {
  complaints: Complaint[];
  case_updates: CaseUpdate[];
  notifications_log: NotificationRow[];
} {
  const rng = mulberry32(26264);
  const now = new Date();

  const complaints: Complaint[] = [];
  const case_updates: CaseUpdate[] = [];
  const notifications_log: NotificationRow[] = [];

  // 70 complaints over the last 24 days
  for (let i = 0; i < 70; i++) {
    const codeNum = 1001 + i;
    const code = `AICTE-26-${codeNum.toString().padStart(5, '0')}`;
    const id = `cmp_${codeNum}`;

    // Days ago between 1 and 24
    const daysAgo = Math.floor(rng() * 24);
    const createdDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(rng() * 36000000));
    const created_at = createdDate.toISOString();

    // Select college: skew heavily to Sunrise Institute (id: 1)
    let college_id = 1;
    const colRand = rng();
    if (colRand > 0.35) {
      // 35% chance of Sunrise (college 1), 65% spread among 2-8
      college_id = 2 + Math.floor(rng() * 7);
    }

    // Select template: skew toward fee refund for Sunrise to feed repeat offender
    let tmplIdx = Math.floor(rng() * COMPLAINT_TEMPLATES.length);
    if (college_id === 1 && rng() < 0.6) {
      tmplIdx = 0; // fee refund
    }
    const template = COMPLAINT_TEMPLATES[tmplIdx];

    // Determine student ownership: demo student owns 3 specific cases (e.g. index 2, 8, 14)
    let complainant_id = `usr_complainant_${100 + (i % 30)}`;
    if (i === 2) complainant_id = 'usr_student_01'; // Under Review
    if (i === 8) complainant_id = 'usr_student_01'; // Notice Sent
    if (i === 14) complainant_id = 'usr_student_01'; // Submitted

    const routing = routeComplaintKeywords(template.text);
    const cell = INITIAL_CELLS.find(c => c.id === routing.cell_id)!;

    // Calculate due date based on cell SLA
    const dueDate = new Date(createdDate.getTime() + cell.sla_days * 24 * 60 * 60 * 1000);
    const due_date = dueDate.toISOString();

    // Determine status:
    // ~20% Submitted, 30% Under Review, 20% Notice Sent, 22% Resolved, rest Escalated (only those truly past due)
    let status: Complaint['status'] = 'Submitted';
    if (i === 2) {
      status = 'Under Review';
    } else if (i === 8) {
      status = 'Notice Sent';
    } else if (i === 14) {
      status = 'Submitted';
    } else {
      const sRand = rng();
      const isPastDue = now.getTime() > dueDate.getTime();
      if (sRand < 0.20) {
        status = 'Submitted';
      } else if (sRand < 0.50) {
        status = 'Under Review';
      } else if (sRand < 0.70) {
        status = 'Notice Sent';
      } else if (sRand < 0.92) {
        status = 'Resolved';
      } else {
        status = isPastDue ? 'Escalated' : 'Under Review';
      }
    }

    let resolved_at: string | null = null;
    if (status === 'Resolved') {
      const resDate = new Date(createdDate.getTime() + (2 + Math.floor(rng() * (cell.sla_days - 2))) * 24 * 60 * 60 * 1000);
      resolved_at = resDate.toISOString();
    }

    const words = template.text.trim().split(/\s+/).slice(0, 12);
    const summary = words.join(' ') + '...';

    const attachments = i % 2 === 0 ? [
      {
        id: `att_${codeNum}_1`,
        complaint_id: id,
        file_name: `acknowledgement_receipt_${codeNum}.pdf`,
        file_path: `/uploads/receipt_${codeNum}.pdf`,
        mime_type: 'application/pdf',
        size: 245000 + Math.floor(rng() * 800000)
      }
    ] : [];

    const complaint: Complaint = {
      id,
      code,
      complainant_id,
      college_id,
      cell_id: cell.id,
      category: routing.category,
      urgency: routing.urgency,
      summary,
      original_text: template.text,
      translated_text: template.trans,
      language: template.lang,
      status,
      routed_by: i % 3 === 0 ? 'rules' : 'ai',
      created_at,
      due_date,
      resolved_at,
      attachments
    };

    complaints.push(complaint);

    // Initial "Received" case update
    case_updates.push({
      id: `upd_${codeNum}_0`,
      complaint_id: id,
      actor_id: 'system',
      actor_role: 'system',
      actor_name: 'System',
      action: 'Complaint received',
      note: `Grievance registered and routed to ${cell.name}. Due date set to ${cell.sla_days} days.`,
      new_status: 'Submitted',
      visible_to_complainant: true,
      created_at: created_at
    });

    if (complaint.routed_by === 'ai') {
      case_updates.push({
        id: `upd_${codeNum}_ai`,
        complaint_id: id,
        actor_id: 'system',
        actor_role: 'system',
        actor_name: 'AI Routing Engine',
        action: `Routed by AI to ${cell.name}`,
        note: `Categorised under ${routing.category} based on semantic understanding.`,
        visible_to_complainant: true,
        created_at: new Date(createdDate.getTime() + 1200).toISOString()
      });
    }

    if (status === 'Under Review' || status === 'Notice Sent' || status === 'Resolved' || status === 'Escalated') {
      const revDate = new Date(createdDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();
      case_updates.push({
        id: `upd_${codeNum}_1`,
        complaint_id: id,
        actor_id: 'usr_officer_03',
        actor_role: 'officer',
        actor_name: 'Meera Iyer',
        action: 'Case accepted for review',
        note: 'Assigned to scrutiny desk. Preliminary evaluation of documents underway.',
        old_status: 'Submitted',
        new_status: 'Under Review',
        visible_to_complainant: true,
        created_at: revDate
      });
    }

    if (status === 'Notice Sent' || status === 'Resolved' || status === 'Escalated') {
      const noticeDate = new Date(createdDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
      case_updates.push({
        id: `upd_${codeNum}_2`,
        complaint_id: id,
        actor_id: 'usr_officer_03',
        actor_role: 'officer',
        actor_name: 'Meera Iyer',
        action: 'Notice sent to college seeking an explanation within 7 days',
        note: 'Official notice issued to the Principal and Registrar via registered email.',
        old_status: 'Under Review',
        new_status: 'Notice Sent',
        visible_to_complainant: true,
        created_at: noticeDate
      });

      notifications_log.push({
        id: `notif_${codeNum}`,
        complaint_id: id,
        channel: 'email',
        recipient: `registrar@${INITIAL_COLLEGES.find(c => c.id === college_id)?.name.toLowerCase().replace(/[^a-z]/g, '')}.ac.in`,
        message: `Notice regarding complaint ${code} filed against your institution. You are requested to furnish comments within 7 days.`,
        sent_at: noticeDate
      });
    }

    if (status === 'Resolved') {
      case_updates.push({
        id: `upd_${codeNum}_3`,
        complaint_id: id,
        actor_id: 'usr_officer_03',
        actor_role: 'officer',
        actor_name: 'Meera Iyer',
        action: 'College replied with compliance proof. Case closed.',
        note: 'Verified refund credit receipt submitted by institution. Complainant satisfied.',
        old_status: 'Notice Sent',
        new_status: 'Resolved',
        visible_to_complainant: true,
        created_at: resolved_at || created_at
      });
    }

    if (status === 'Escalated') {
      const escDate = new Date(dueDate.getTime() + 1000).toISOString();
      case_updates.push({
        id: `upd_${codeNum}_4`,
        complaint_id: id,
        actor_id: 'system',
        actor_role: 'system',
        actor_name: 'SLA Monitor',
        action: "Escalated to the Chairman's Office",
        note: `Statutory SLA of ${cell.sla_days} days breached. Auto-escalated for executive intervention.`,
        old_status: 'Notice Sent',
        new_status: 'Escalated',
        visible_to_complainant: true,
        created_at: escDate
      });
    }
  }

  // Cross-bureau overlap detection calculation across complaints
  // Detect cases relating to the same institution handled across different cells or parallel active complaints
  for (const c of complaints) {
    const sameCollegeOtherCases = complaints.filter(
      other => other.id !== c.id &&
               other.college_id === c.college_id &&
               other.status !== 'Resolved'
    );
    if (sameCollegeOtherCases.length > 0) {
      c.overlap_alert = true;
      c.overlap_case_ids = sameCollegeOtherCases.map(o => o.code);
      const diffCells = new Set(sameCollegeOtherCases.map(o => o.cell_id));
      diffCells.add(c.cell_id);
      c.overlap_reasons = [
        `Same AICTE Permanent ID (${INITIAL_COLLEGES.find(col => col.id === c.college_id)?.aicte_id})`,
        diffCells.size > 1 ? `Multi-Bureau handling across ${diffCells.size} different cells` : 'Multiple concurrent active complaints for same campus',
        `Related category & active review timeline`
      ];
    }
  }

  return { complaints, case_updates, notifications_log };
}
