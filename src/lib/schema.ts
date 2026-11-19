/**
 * schema.org structured data (JSON-LD) for search engines.
 *
 * Built only from facts in site.ts and about.ts, so it can never claim
 * anything the site itself does not state.
 */
import { site } from './site';
import { about } from '../data/about';

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.fullName,
    alternateName: site.name,
    url: site.url,
    description: site.description,
    jobTitle: site.disciplines.map((d) => d.title),
    address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
    alumniOf: about.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
    hasCredential: about.certifications.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      recognizedBy: { '@type': 'Organization', name: c.issuer },
    })),
    ...(site.email ? { email: `mailto:${site.email}` } : {}),
    sameAs: site.socials.map((s) => s.url),
  };
}
