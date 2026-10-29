import { Language, RoutedBy, Urgency } from './types';

export interface RouteResult {
  cell_id: number;
  cell_name: string;
  category: string;
  urgency: Urgency;
  routed_by: RoutedBy;
  language: Language;
  summary: string;
  translated_text?: string;
}

export const SAMPLE_DICTIONARY: Record<string, { en: string; category: string }> = {
  "मैंने प्रवेश रद्द करने का आवेदन अंतिम तिथि से पहले जमा कर दिया था, लेकिन कॉलेज ने अभी तक मेरी 85,000 रुपये की फीस और धरोहर राशि वापस नहीं की है।": {
    en: "I submitted my admission cancellation application before the deadline, but the college has not yet refunded my fee of Rs 85,000 and security deposit.",
    category: "Fee refund"
  },
  "संस्थान द्वारा संचालित कंप्यूटर साइंस का डिप्लोमा पाठ्यक्रम एआईसीटीई द्वारा मान्यता प्राप्त नहीं है, छात्रों को धोखे में रखा गया है।": {
    en: "The Computer Science diploma course run by the institute is not approved by AICTE; students have been kept in the dark.",
    category: "Unapproved course"
  },
  "మా కళాశాలలో కంప్యూటర్ ల్యాబ్ మరియు లైబ్రరీ వసతులు సరిగ్గా లేవు, ప్రాక్టికల్ పరీక్షలు నిర్వహించడానికి అవసరమైన పరికరాలు లేవు.": {
    en: "In our college, computer lab and library facilities are not proper, and there is no equipment required to conduct practical examinations.",
    category: "Infrastructure & Labs"
  },
  "Senior students in the boys hostel have been subjecting first-year students to severe mental harassment and late-night physical tasks for the past two weeks.": {
    en: "Senior students in the boys hostel have been subjecting first-year students to severe mental harassment and late-night physical tasks for the past two weeks.",
    category: "Ragging & Harassment"
  }
};

export function detectLanguage(text: string): Language {
  // Check for Telugu unicode range: \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return 'te';
  }
  // Check for Devanagari unicode range: \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }
  return 'en';
}

export function generateSummary(text: string): string {
  const words = text.trim().split(/\s+/).slice(0, 12);
  let summary = words.join(' ');
  if (summary.length < text.length) {
    summary += '...';
  }
  return summary;
}

export function routeComplaintKeywords(text: string): { cell_id: number; cell_name: string; category: string; urgency: Urgency } {
  const lower = text.toLowerCase();

  // 1. ragg|bully|bullied|abus|torment|रैगिंग -> Anti-Ragging Cell, urgency high
  if (/ragg|bully|bullied|abus|torment|रैगिंग/i.test(lower)) {
    return {
      cell_id: 1,
      cell_name: 'Anti-Ragging Cell',
      category: 'Ragging & Harassment',
      urgency: 'high'
    };
  }

  // 2. unapproved|not approved|approval|affiliat|recogni|मान्यता -> Approvals Bureau
  if (/unapproved|not approved|approval|affiliat|recogni|मान्यता/i.test(lower)) {
    return {
      cell_id: 2,
      cell_name: 'Approvals Bureau',
      category: 'Approval & Affiliation',
      urgency: 'normal'
    };
  }

  // 3. fee|refund|deposit|scholarship|fine|फीस|वापसी|रिफंड -> Finance & Refunds Cell
  if (/fee|refund|deposit|scholarship|fine|फीस|वापसी|रिफंड/i.test(lower)) {
    return {
      cell_id: 3,
      cell_name: 'Finance & Refunds Cell',
      category: 'Fee refund',
      urgency: 'normal'
    };
  }

  // 4. hostel|lab|faculty|infrastructure|classroom|library -> Regional Office
  if (/hostel|lab|faculty|infrastructure|classroom|library/i.test(lower)) {
    return {
      cell_id: 4,
      cell_name: 'Regional Office',
      category: 'Infrastructure & Labs',
      urgency: 'normal'
    };
  }

  // 5. otherwise -> Legal Cell
  return {
    cell_id: 5,
    cell_name: 'Legal Cell',
    category: 'Legal & Governance',
    urgency: 'normal'
  };
}

export function routeWithAi(text: string): RouteResult {
  const kw = routeComplaintKeywords(text);
  const lang = detectLanguage(text);
  const summary = generateSummary(text);
  
  let translated_text: string | undefined = undefined;
  if (lang !== 'en') {
    const dictMatch = Object.entries(SAMPLE_DICTIONARY).find(([sample]) => text.includes(sample.substring(0, 20)));
    if (dictMatch) {
      translated_text = dictMatch[1].en;
    } else {
      translated_text = 'Automatic translation will appear here once the Gemini service is connected.';
    }
  }

  return {
    cell_id: kw.cell_id,
    cell_name: kw.cell_name,
    category: kw.category,
    urgency: kw.urgency,
    routed_by: 'ai',
    language: lang,
    summary,
    translated_text
  };
}
