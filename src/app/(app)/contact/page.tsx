import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

const countries = [
  { name: 'USA', flag: 'usa.png' },
  { name: 'Mexico', flag: 'mexico.png' },
  { name: 'India', flag: 'india-flag.png' },
  { name: 'Singapore', flag: 'singapore.png' },
  { name: 'Ukraine', flag: 'ukraine.png' },
];

const offices = [
  { city: 'New York, NY', address: '345 E. 37th Street, Suite 202A\nNew York, NY 10016', phone: '+1 (212) 688-6950', fax: '(212) 931-8530' },
  { city: 'Fort Lauderdale, FL', address: '3333 W. Commercial Bl, Suite 113\nFt. Lauderdale, FL 33309', phone: '+1 (844) 333-2777' },
  { city: 'Los Angeles, CA', address: '30300 Agoura Rd. Suite 140\nAgoura Hills, CA 91301', phone: '+1 (844) 333-2777', fax: '(310) 606-2154' },
  { city: 'San Jose, CA', address: '929 Berryessa Rd, Suite 20\nSan Jose, CA 95133', phone: '+1 (408) 618-6005' },
  { city: 'San Diego, CA', address: '5830 Oberlin Dr. Suite 300\nSan Diego, CA 92121', phone: '+1 (818) 442-5203' },
  { city: 'Monterey Park, CA', address: '1111 Corporate Center Dr Suite 304\nMonterey Park, CA 91754', phone: '+1 (310) 504-3444' },
  { city: 'Phoenix, AZ', address: '3231 S. Country Club Way, Unit 111\nTempe, AZ 85282', phone: '+1 (480) 466-0900' },
  { city: 'Dallas, TX', address: '5717 Legacy Dr, Ste 2059\nPlano, TX 75024', phone: '+1 (844) 333-2777' },
  { city: 'Cleveland, OH', address: '30575 Bainbridge Rd, Suite 106\nSolon, OH 44139', phone: '+1 (844) 333-2777' },
];

const phoneLines = [
  { region: 'USA', number: '+1 (844) 333-2777' },
  { region: 'Mexico', number: '+1 (844) 333-2777' },
  { region: 'India', number: '(+91) 1724946000' },
];

const emailLines = [
  { label: 'General inquiries', address: 'hr@programming.com' },
  { label: 'Request a quote', address: 'info@programming.com' },
  { label: 'Careers', address: 'career@programming.com' },
];

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Programming.com / Contact</p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[var(--text)]">Find us in your vicinity.</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">Local teams, global reach. Find an office or get in touch with the right team.</p>
        </div>
        <a href="mailto:info@programming.com" className="inline-flex w-fit items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          Contact our team <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </header>

      <section aria-label="Our locations" className="mb-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-b border-[var(--line)] pb-6">
        <span className="mr-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Where we work</span>
        {countries.map((country) => (
          <div key={country.name} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
            <img
              className="h-5 w-7 rounded-sm border border-[var(--line)] object-cover"
              src={`https://www.programming.com/assets/img/${country.flag}`}
              alt=""
              aria-hidden="true"
            />
            {country.name}
          </div>
        ))}
      </section>

      <section aria-labelledby="offices-heading" className="mb-12">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
            <MapPin size={19} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">United States</p>
            <h2 id="offices-heading" className="text-xl font-semibold text-[var(--text)]">Our offices</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((office, index) => (
            <article key={office.city} className="min-h-48 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]/50">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-[var(--text)]">{office.city}</h3>
                <span className="font-mono text-xs text-[var(--muted)]">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <address className="mb-4 whitespace-pre-line text-sm not-italic leading-6 text-[var(--muted)]">{office.address}</address>
              <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--line)] pt-3 text-sm">
                <a className="inline-flex items-center gap-2 font-medium text-[var(--accent)] hover:underline" href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}>
                  <Phone size={14} aria-hidden="true" /> {office.phone}
                </a>
                {office.fax && <span className="text-[var(--muted)]">Fax: {office.fax}</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Contact details" className="grid gap-8 border-t border-[var(--line)] py-8 md:grid-cols-2 md:gap-12">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
              <Phone size={18} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold text-[var(--text)]">Call us</h2>
          </div>
          <dl className="divide-y divide-[var(--line)]">
            {phoneLines.map((line) => (
              <div key={line.region} className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-[var(--muted)]">{line.region}</dt>
                <dd><a className="text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)]" href={`tel:${line.number.replace(/[^+\d]/g, '')}`}>{line.number}</a></dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#c45b45]/10 text-[#a84434]">
              <Mail size={18} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold text-[var(--text)]">Email</h2>
          </div>
          <dl className="divide-y divide-[var(--line)]">
            {emailLines.map((line) => (
              <div key={line.address} className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-[var(--muted)]">{line.label}</dt>
                <dd><a className="text-sm font-semibold text-[var(--accent)] hover:underline" href={`mailto:${line.address}`}>{line.address}</a></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="mt-2 flex flex-col justify-between gap-3 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)] sm:flex-row sm:items-center">
        <p className="font-semibold text-[var(--text)]">Programming the Future</p>
        <p>© Copyright. All Rights Reserved <span className="mx-2 text-[var(--line)]">|</span> <a href="https://www.programming.com/privacy_policy.aspx" className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--text)]">Privacy Policy</a></p>
      </footer>
    </main>
  );
}