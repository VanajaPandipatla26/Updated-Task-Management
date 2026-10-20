'use client';

import { useState } from 'react';
import { Download, FileText, Landmark, Receipt } from 'lucide-react';

type DocumentField = { label: string; value: string };
type PayrollDocument = {
  id: string;
  title: string;
  subtitle: string;
  filename: string;
  fields: DocumentField[];
};

const employee = 'Alex Morgan';
const employeeId = 'EMP-001';

const letters: PayrollDocument[] = [
  {
    id: 'offer', title: 'Offer Letter', subtitle: 'Employment offer and proposed terms', filename: 'offer-letter.html',
    fields: [
      { label: 'Employee', value: employee }, { label: 'Position', value: 'Software Developer' },
      { label: 'Employment type', value: 'Full-time' }, { label: 'Proposed start date', value: 'November 2, 2026' },
      { label: 'Annual compensation', value: 'USD 86,400' }, { label: 'Offer valid through', value: 'October 30, 2026' },
    ],
  },
  {
    id: 'appointment', title: 'Appointment Letter', subtitle: 'Confirmation of appointment and employment details', filename: 'appointment-letter.html',
    fields: [
      { label: 'Employee', value: employee }, { label: 'Employee ID', value: employeeId },
      { label: 'Position', value: 'Software Developer' }, { label: 'Employment type', value: 'Full-time' },
      { label: 'Date of joining', value: 'November 2, 2026' }, { label: 'Reporting to', value: 'Engineering Manager' },
    ],
  },
  {
    id: 'compensation', title: 'Compensation Letter', subtitle: 'Current compensation details', filename: 'compensation-letter.html',
    fields: [
      { label: 'Employee', value: employee }, { label: 'Employee ID', value: employeeId },
      { label: 'Position', value: 'Software Developer' }, { label: 'Annual base salary', value: 'USD 86,400' },
      { label: 'Monthly base salary', value: 'USD 7,200' }, { label: 'Effective date', value: 'November 2, 2026' },
    ],
  },
];

const payslips: PayrollDocument[] = [
  ['2026-01', 'January 2026', 'January 30, 2026'],
  ['2026-02', 'February 2026', 'February 27, 2026'],
  ['2026-03', 'March 2026', 'March 31, 2026'],
  ['2026-04', 'April 2026', 'April 30, 2026'],
  ['2026-05', 'May 2026', 'May 29, 2026'],
  ['2026-06', 'June 2026', 'June 30, 2026'],
].map(([id, period, payDate]) => ({
  id, title: `Payslip · ${period}`, subtitle: `Salary statement for ${period}`, filename: `payslip-${id}.html`,
  fields: [
    { label: 'Employee', value: employee }, { label: 'Employee ID', value: employeeId },
    { label: 'Pay period', value: period }, { label: 'Pay date', value: payDate },
    { label: 'Gross pay', value: 'USD 7,200' }, { label: 'Income tax', value: 'USD 1,080' },
    { label: 'Other deductions', value: 'USD 120' }, { label: 'Net pay', value: 'USD 6,000' },
  ],
}));

const payrollTabs = [
  { id: 'official-letter', label: 'Official letter', icon: FileText, title: 'Official letters' },
  { id: 'tax-payroll', label: 'Tax-payroll', icon: Landmark, title: 'Tax & payroll documents' },
  { id: 'payslip', label: 'Payslip', icon: Receipt, title: 'Payslips' },
] as const;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] ?? character);
}

function documentHtml(document: PayrollDocument) {
  const fields = document.fields.map(({ label, value }) => `
    <div class="field"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(document.title)}</title>
<style>
  @page{size:A4;margin:22mm}*{box-sizing:border-box}body{margin:0;color:#172321;font:15px/1.6 Arial,sans-serif}
  main{max-width:760px;margin:48px auto;padding:48px;border:1px solid #d8e0dc}
  .brand{color:#147d64;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
  h1{margin:10px 0 4px;font-size:28px}.subtitle{margin:0 0 32px;color:#53615c}
  dl{margin:0}.field{display:grid;grid-template-columns:190px 1fr;gap:20px;padding:14px 0;border-top:1px solid #e2e8e4}
  dt{color:#53615c}dd{margin:0;font-weight:600}.footer{margin-top:42px;color:#53615c;font-size:12px}
  @media print{main{margin:0;padding:0;border:0}}
</style></head><body><main><p class="brand">Task Dashboard · People Operations</p>
<h1>${escapeHtml(document.title)}</h1><p class="subtitle">${escapeHtml(document.subtitle)}</p>
<dl>${fields}</dl><p class="footer">Generated from the payroll workspace. Sample payroll data.</p></main></body></html>`;
}

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<(typeof payrollTabs)[number]['id']>('payslip');
  const [letterId, setLetterId] = useState(letters[0].id);
  const [payslipId, setPayslipId] = useState(payslips[0].id);
  const activeContent = payrollTabs.find((tab) => tab.id === activeTab) ?? payrollTabs[2];
  const ActiveIcon = activeContent.icon;
  const selectedDocument = activeTab === 'official-letter'
    ? letters.find((document) => document.id === letterId)
    : activeTab === 'payslip'
      ? payslips.find((document) => document.id === payslipId)
      : undefined;

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = payrollTabs.findIndex((tab) => tab.id === activeTab);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % payrollTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + payrollTabs.length) % payrollTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = payrollTabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = payrollTabs[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`payroll-tab-${nextTab.id}`)?.focus();
  }

  function downloadSelected() {
    if (!selectedDocument) return;
    const link = document.createElement('a');
    link.href = `data:text/html;charset=utf-8,${encodeURIComponent(documentHtml(selectedDocument))}`;
    link.download = selectedDocument.filename;
    document.body.append(link);
    link.click();
    link.remove();
  }

  const recordCount = activeTab === 'official-letter' ? `${letters.length} templates`
    : activeTab === 'payslip' ? `${payslips.length} sample records` : 'No records';

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] print:hidden">
        <div className="flex max-w-full gap-1 overflow-x-auto" role="tablist" aria-label="Documents">
          {payrollTabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`payroll-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="payroll-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)] ${selected ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'}`}
              >
                <Icon size={17} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={downloadSelected}
          disabled={!selectedDocument}
          title="Download selected document"
          className="mb-2 inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={16} aria-hidden="true" />
          Download
        </button>
      </div>

      <section
        id="payroll-panel"
        role="tabpanel"
        aria-labelledby={`payroll-tab-${activeContent.id}`}
        className="min-h-80 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8"
      >
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-[var(--accent)]/10 text-[var(--accent)]">
              <ActiveIcon size={21} aria-hidden="true" />
            </span>
            <div>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">{activeContent.title}</h2>
            </div>
          </div>
          <span className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]">{recordCount}</span>
        </div>

        {selectedDocument ? (
          <div className="space-y-6">
            <label className="block max-w-sm text-sm font-semibold text-[var(--text)]">
              {activeTab === 'official-letter' ? 'Letter type' : 'Pay period'}
              <select
                className="mt-2 block w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-normal"
                aria-label={activeTab === 'official-letter' ? 'Letter type' : 'Pay period'}
                value={activeTab === 'official-letter' ? letterId : payslipId}
                onChange={(event) => activeTab === 'official-letter'
                  ? setLetterId(event.target.value)
                  : setPayslipId(event.target.value)}
              >
                {(activeTab === 'official-letter' ? letters : payslips).map((document) => (
                  <option key={document.id} value={document.id}>{document.title}</option>
                ))}
              </select>
            </label>

            <article aria-label="Document preview" className="mx-auto max-w-3xl border border-[var(--line)] bg-white p-6 text-[var(--text)] shadow-sm sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Task Dashboard · People Operations</p>
              <h3 className="mt-3 text-2xl font-semibold">{selectedDocument.title}</h3>
              <p className="mt-1 border-b border-[var(--line)] pb-6 text-sm text-[var(--muted)]">{selectedDocument.subtitle}</p>
              <dl className="divide-y divide-[var(--line)]">
                {selectedDocument.fields.map((field) => (
                  <div key={field.label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
                    <dt className="text-sm text-[var(--muted)]">{field.label}</dt>
                    <dd className="m-0 text-sm font-semibold">{field.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]">Sample payroll data</p>
            </article>
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center py-8 text-center">
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[var(--bg)] text-[var(--muted)]">
              <ActiveIcon size={22} aria-hidden="true" />
            </span>
            <h3 className="text-base font-semibold text-[var(--text)]">No tax-payroll records</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Tax documents will appear here when available.</p>
          </div>
        )}
      </section>
    </main>
  );
}
