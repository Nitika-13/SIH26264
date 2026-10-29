/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper, #F7F3EA)',
        surface: 'var(--surface, #FFFFFF)',
        ink: 'var(--ink, #17213B)',
        muted: 'var(--muted, #4F596E)',
        line: 'var(--line, #D9D2C3)',
        navy: 'var(--navy, #0B2A5B)',
        'on-navy': 'var(--on-navy, #FFFFFF)',
        kesari: 'var(--kesari, #E8890C)',
        'kesari-soft': 'var(--kesari-soft, #FBE7C6)',
        focus: 'var(--focus, #1F4FB4)',
        'flag-green': 'var(--flag-green, #138808)',

        'st-submitted': 'var(--st-submitted, #4F596E)',
        'st-submitted-bg': 'var(--st-submitted-bg, #ECEAE4)',
        'st-review': 'var(--st-review, #1F4FB4)',
        'st-review-bg': 'var(--st-review-bg, #E3EBFA)',
        'st-notice': 'var(--st-notice, #8A5A00)',
        'st-notice-bg': 'var(--st-notice-bg, #FBEBCF)',
        'st-resolved': 'var(--st-resolved, #1E6B4F)',
        'st-resolved-bg': 'var(--st-resolved-bg, #DDEFE7)',
        'st-escalated': 'var(--st-escalated, #B3321F)',
        'st-escalated-bg': 'var(--st-escalated-bg, #F7DDD8)',
      },
      fontFamily: {
        display: ['"Eczar"', '"Anek Devanagari"', '"Anek Telugu"', 'Georgia', 'serif'],
        body: ['"Anek Latin"', '"Anek Devanagari"', '"Anek Telugu"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        badge: '2px',
        table: '0px',
      },
      maxWidth: {
        content: '1120px',
        wide: '1360px',
      }
    },
  },
  plugins: [],
}
