/** schema.org JSON-LD for search engines (Dentist / LocalBusiness). */
import { site, offices, weekdays, type Office, type Weekday } from '../data/site';

const dayNames: Record<Weekday, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

const orgId = `${site.url}/#organization`;

export function officeSchema(o: Office) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${site.url}${o.path}#dentist`,
    name: `${site.name} (${o.city})`,
    url: `${site.url}${o.path}`,
    image: `${site.url}/og-image.png`,
    telephone: `+1-${o.phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: o.street,
      addressLocality: o.locality,
      addressRegion: o.region,
      postalCode: o.postalCode,
      addressCountry: 'US',
    },
    hasMap: o.mapsUrl,
    ...(o.hours && {
      openingHoursSpecification: weekdays.flatMap((d) => {
        const span = o.hours![d];
        return span ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: dayNames[d], opens: span[0], closes: span[1] }] : [];
      }),
    }),
    parentOrganization: { '@id': orgId },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/icon-512.png`,
    email: site.email,
    slogan: site.tagline,
    founder: { '@type': 'Person', name: site.dentist },
    subOrganization: offices.map((o) => ({ '@id': `${site.url}${o.path}#dentist` })),
  };
}
