export type UiLanguage = 'en' | 'hi';

const translations: Record<UiLanguage, Record<string, string>> = {
  en: {
    'portal.title': 'AICTE Complaint Monitor',
    'portal.tagline': 'Grievance portal · शिकायत पोर्टल',
    'portal.gov': 'Government of India',
    'skip.link': 'Skip to main content',
    'nav.home': 'Home',
    'nav.file': 'File a complaint',
    'nav.track': 'Track complaint',
    'nav.my': 'My complaints',
    'nav.officer': 'Officer inbox',
    'nav.leadership': 'Leadership',
    'nav.design': 'Design gallery',
    'nav.login': 'Login',
    'nav.logout': 'Sign out',

    'status.submitted': 'Submitted',
    'status.under_review': 'Under review',
    'status.notice_sent': 'Notice sent',
    'status.resolved': 'Resolved',
    'status.escalated': 'Escalated',

    'label.complaint_id': 'Complaint ID',
    'label.status': 'Status',
    'label.days_left': 'Days left',
    'label.college': 'Institution',
    'label.cell': 'Assigned cell',
    'label.filed_date': 'Filed on',
    'label.category': 'Category',
    'label.action': 'Action',

    'btn.file_complaint': 'File a complaint',
    'btn.track_complaint': 'Track complaint',
    'btn.submit': 'Submit complaint',
    'btn.back': 'Back',
    'btn.reset': 'Reset demo data',

    'footer.disclaimer': 'Demo prototype. All data is fictional.',
    'footer.bilingual': 'Integrated Dashboard for AICTE Complaint Monitoring'
  },
  hi: {
    'portal.title': 'एआईसीटीई शिकायत मॉनिटर',
    'portal.tagline': 'शिकायत पोर्टल · Grievance Portal',
    'portal.gov': 'भारत सरकार',
    'skip.link': 'मुख्य सामग्री पर जाएँ',
    'nav.home': 'मुख्य पृष्ठ',
    'nav.file': 'शिकायत दर्ज करें',
    'nav.track': 'शिकायत की स्थिति देखें',
    'nav.my': 'मेरी शिकायतें',
    'nav.officer': 'अधिकारी इनबॉक्स',
    'nav.leadership': 'वरिष्ठ समीक्षा',
    'nav.design': 'डिज़ाइन गैलरी',
    'nav.login': 'लॉग इन',
    'nav.logout': 'लॉग आउट',

    'status.submitted': 'प्रस्तुत',
    'status.under_review': 'समीक्षाधीन',
    'status.notice_sent': 'नोटिस भेजा गया',
    'status.resolved': 'निस्तारित',
    'status.escalated': 'उच्च स्तर पर भेजा गया',

    'label.complaint_id': 'शिकायत संख्या',
    'label.status': 'स्थिति',
    'label.days_left': 'शेष दिन',
    'label.college': 'संस्थान',
    'label.cell': 'संबद्ध प्रकोष्ठ',
    'label.filed_date': 'दर्ज की गई तिथि',
    'label.category': 'श्रेणी',
    'label.action': 'कार्रवाई',

    'btn.file_complaint': 'शिकायत दर्ज करें',
    'btn.track_complaint': 'शिकायत की स्थिति देखें',
    'btn.submit': 'शिकायत प्रस्तुत करें',
    'btn.back': 'वापस',
    'btn.reset': 'डेमो डेटा रीसेट करें',

    'footer.disclaimer': 'डेमो प्रोटोटाइप। सभी डेटा काल्पनिक है।',
    'footer.bilingual': 'एआईसीटीई शिकायत निगरानी हेतु एकीकृत डैशबोर्ड'
  }
};

let currentLang: UiLanguage = (localStorage.getItem('sih26264-lang') as UiLanguage) || 'en';

export function getUiLanguage(): UiLanguage {
  return currentLang;
}

export function setUiLanguage(lang: UiLanguage) {
  currentLang = lang;
  localStorage.setItem('sih26264-lang', lang);
  window.dispatchEvent(new Event('languagechange'));
}

export function t(key: string): string {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}
