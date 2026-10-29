import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { College, Complaint } from '../lib/types';
import { Select } from '../components/Select';
import { Textarea } from '../components/Textarea';
import { FileDrop, UploadedFile } from '../components/FileDrop';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { formatDate } from '../lib/time';

const SAMPLES = [
  {
    label: '-- Select a sample grievance to test --',
    text: '',
    collegeId: 1
  },
  {
    label: 'Hindi: Fee & caution deposit refund (फीस व धरोहर राशि वापसी)',
    text: 'मैंने प्रवेश रद्द करने का आवेदन अंतिम तिथि से पहले जमा कर दिया था, लेकिन कॉलेज ने अभी तक मेरी 85,000 रुपये की फीस और धरोहर राशि वापस नहीं की है।',
    collegeId: 1 // Sunrise Institute
  },
  {
    label: 'Hindi: Unapproved diploma course (मान्यता विहीन पाठ्यक्रम)',
    text: 'संस्थान द्वारा संचालित कंप्यूटर साइंस का डिप्लोमा पाठ्यक्रम एआईसीटीई द्वारा मान्यता प्राप्त नहीं है, छात्रों को धोखे में रखा गया है।',
    collegeId: 3 // Lakeview Polytechnic
  },
  {
    label: 'Telugu: Inadequate computer labs & library (ప్రయోగశాల మరియు గ్రంథాలయ లోపాలు)',
    text: 'మా కళాశాలలో కంప్యూటర్ ల్యాబ్ మరియు లైబ్రరీ వసతులు సరిగ్గా లేవు, ప్రాక్టికల్ పరీక్షలు నిర్వహించడానికి అవసరమైన పరికరాలు లేవు.',
    collegeId: 2 // Greenfield Engineering
  },
  {
    label: 'English: Ragging & bullying in hostel premises',
    text: 'Senior students in the boys hostel have been subjecting first-year students to severe mental harassment and late-night physical tasks for the past two weeks.',
    collegeId: 1
  }
];

export const FileComplaint: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('1');
  const [complaintText, setComplaintText] = useState<string>('');
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.listColleges().then(setColleges);
  }, []);

  const handleSampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    if (!isNaN(idx) && SAMPLES[idx] && SAMPLES[idx].text) {
      setComplaintText(SAMPLES[idx].text);
      setSelectedCollegeId(String(SAMPLES[idx].collegeId));
      if (errors.text) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.text;
          return next;
        });
      }
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedCollegeId) {
      errs.college = 'Please select the technical institution.';
    }
    if (!complaintText.trim() || complaintText.trim().length < 20) {
      errs.text = 'Please enter at least 20 characters describing the grievance.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createComplaint({
        college_id: parseInt(selectedCollegeId, 10),
        original_text: complaintText,
        files
      });
      setSubmittedComplaint(created);
    } catch (err: any) {
      setErrors({ form: err.message || 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    if (submittedComplaint) {
      navigator.clipboard.writeText(submittedComplaint.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const selectedCollege = colleges.find((c) => c.id === parseInt(selectedCollegeId, 10));

  // If successfully submitted, show the confirmation screen
  if (submittedComplaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-left space-y-6">
        <div className="p-8 border border-line rounded bg-surface shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#DDEFE7] text-[#1E6B4F] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-muted tracking-wider">
                Submission Confirmed · पावती
              </span>
              <h1 className="text-2xl font-display font-bold text-navy mt-0.5">
                Complaint Registered
              </h1>
            </div>
          </div>

          <div className="p-4 bg-paper rounded border border-line space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted uppercase font-semibold">Complaint Tracking ID</span>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1 text-xs text-navy font-medium hover:underline p-1"
                aria-label="Copy complaint tracking ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#1E6B4F]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>
            <div className="text-3xl font-display font-bold text-navy tracking-wider tabular-nums">
              {submittedComplaint.code}
            </div>
            <p className="text-xs text-muted">
              Keep this reference safe. A tracking receipt has been recorded in your profile.
            </p>
          </div>

          <div className="space-y-3 divide-y divide-line text-sm">
            <div className="pt-2 flex justify-between items-center">
              <span className="text-muted">Target Bureau / Cell</span>
              <div className="text-right">
                <span className="font-semibold text-ink">
                  {submittedComplaint.cell_id === 1 ? 'Anti-Ragging Cell' :
                   submittedComplaint.cell_id === 2 ? 'Approvals Bureau' :
                   submittedComplaint.cell_id === 3 ? 'Finance & Refunds Cell' :
                   submittedComplaint.cell_id === 4 ? 'Regional Office' : 'Legal Cell'}
                </span>
                <div className="inline-flex items-center gap-1 text-[11px] text-[#1E6B4F] ml-2 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>Routed by {submittedComplaint.routed_by === 'ai' ? 'AI Engine' : 'Rules'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-muted">Statutory Deadline (SLA)</span>
              <span className="font-semibold text-navy tabular-nums">
                {formatDate(submittedComplaint.due_date)}
              </span>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-muted">Institution</span>
              <span className="font-medium text-ink text-right">
                {selectedCollege?.name} ({selectedCollege?.aicte_id})
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link to={`/case/${submittedComplaint.code}`} className="flex-1">
              <Button variant="primary" fullWidth>
                <span>Track this complaint</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/my" className="flex-1">
              <Button variant="secondary" fullWidth>
                View all my complaints
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-left space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">File a Grievance</h1>
        <div className="kesari-rule my-3" />
        <p className="text-sm text-muted">
          Submit your complaint with supporting documentation. It will be evaluated and routed under statutory AICTE response guidelines.
        </p>
      </div>

      {errors.form && (
        <div className="p-4 rounded bg-[#F7DDD8] text-[#B3321F] border border-[#E8B6AD] text-sm" role="alert">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Institution */}
        <Section
          stepNumber={1}
          totalSteps={4}
          title="Institution Information"
          description="Identify the AICTE approved college or university campus."
        >
          <Select
            id="college_select"
            label="College or Polytechnic"
            required
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            error={errors.college}
            options={colleges.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.state}, ${c.region} Region) · AICTE ID: ${c.aicte_id}`
            }))}
          />
        </Section>

        {/* Step 2: What happened */}
        <Section
          stepNumber={2}
          totalSteps={4}
          title="What happened"
          description="Explain the specific issue, chronological events, and any communication with the college."
        >
          <div className="mb-4">
            <label htmlFor="sample_complaint_select" className="text-xs font-semibold text-navy uppercase tracking-wider block mb-1">
              Try a sample complaint (Bilingual Demo)
            </label>
            <select
              id="sample_complaint_select"
              onChange={handleSampleChange}
              className="w-full text-xs min-h-[40px] px-3 py-1.5 rounded bg-paper border border-line text-ink cursor-pointer"
            >
              {SAMPLES.map((s, idx) => (
                <option key={idx} value={idx}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            id="complaint_text"
            label="Detailed Statement"
            required
            rows={5}
            placeholder="State exactly what occurred, including dates, monetary amounts, or relevant department names..."
            value={complaintText}
            onChange={(e) => {
              setComplaintText(e.target.value);
              if (errors.text && e.target.value.trim().length >= 20) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.text;
                  return next;
                });
              }
            }}
            currentCount={complaintText.length}
            minChars={20}
            error={errors.text}
          />
        </Section>

        {/* Step 3: Documents */}
        <Section
          stepNumber={3}
          totalSteps={4}
          title="Supporting Documents"
          description="Upload receipts, notice copies, email exchanges, or prospectus extracts."
        >
          <FileDrop files={files} onFilesChange={setFiles} />
        </Section>

        {/* Step 4: Review and Submit */}
        <Section
          stepNumber={4}
          totalSteps={4}
          title="Review and Affirmation"
          description="Check your details before the complaint is officially assigned to an AICTE Bureau."
        >
          <div className="bg-paper p-4 rounded border border-line space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted">Selected Institution:</span>
              <span className="font-semibold text-ink text-right">{selectedCollege?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">AICTE Permanent ID:</span>
              <span className="font-mono text-ink text-right">{selectedCollege?.aicte_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Attached Documents:</span>
              <span className="font-medium text-ink tabular-nums">{files.length} file(s)</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="kesari"
            size="default"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                <span>Routing grievance via AI…</span>
              </span>
            ) : (
              <span>Submit complaint · शिकायत प्रस्तुत करें</span>
            )}
          </Button>
          <p className="text-xs text-center text-muted mt-2">
            By submitting, you certify that all information is accurate to the best of your knowledge.
          </p>
        </Section>
      </form>
    </div>
  );
};
