/**
 * Site content: edit this file to change practice details, offices, hours and copy.
 *
 * Items marked `VERIFY` came from the previous site and still need confirming with the
 * practice before launch (see README → "Open items").
 */

export const site = {
  name: 'Dr. Tooth Family and Implant Dentistry',
  shortName: 'Dr. Tooth',
  dentist: 'Dr. Victoria Vainer, DMD',
  tagline: 'Your smile is our passion.',
  url: 'https://drtooth.dental',
  email: 'Drtooth@drtooth.dental',
  description:
    'Family, implant and cosmetic dentistry in Bellevue and Mountlake Terrace, WA. Your smile is our passion.',

  /**
   * Google Apps Script web-app URL that receives appointment requests.
   * Must be deployed from the PRACTICE Google Workspace account (with the HIPAA BAA accepted),
   * never a personal account. See apps-script/README.md. Not a secret: it is a public endpoint.
   */
  formEndpoint:
    'https://script.google.com/macros/s/AKfycbx_pv7TnPqMaKClEmgg4i0OgrNfBb-3X-dh5vfa_2IERK4Q5npL6yUsK7yAR527_MHNUQ/exec',

  /** URL or path of the practice's HIPAA Notice of Privacy Practices (PDF or page). VERIFY: supply. */
  noticeOfPrivacyPracticesUrl: '',
} as const;

export const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type Weekday = (typeof weekdays)[number];
/** Opening and closing time per day in 24-hour "HH:MM"; `null` = closed. Keep in sync with the Google Business Profile. */
export type OfficeHours = Record<Weekday, [opens: string, closes: string] | null>;

export interface Office {
  id: 'bellevue' | 'mountlake-terrace';
  city: string;
  building: string;
  street: string;
  locality: string;
  region: 'WA';
  postalCode: string;
  phone: string;
  /** null = not provided; the site then shows "Call for current hours". */
  hours: OfficeHours | null;
  mapsUrl: string;
  path: string;
}

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const offices: Office[] = [
  {
    id: 'bellevue',
    city: 'Bellevue',
    building: 'Bel-Red Medical Center',
    street: '15710 NE 24th St, Suite D',
    locality: 'Bellevue',
    region: 'WA',
    postalCode: '98008',
    phone: '(425) 865-0411',
    hours: {
      Mon: ['09:00', '16:00'],
      Tue: ['09:00', '18:00'],
      Wed: ['09:00', '18:00'],
      Thu: ['09:00', '16:00'],
      Fri: ['09:00', '16:00'],
      Sat: null,
      Sun: null,
    },
    mapsUrl: maps('Dr. Tooth, 15710 NE 24th St Suite D, Bellevue, WA 98008'),
    path: '/bellevue/',
  },
  {
    id: 'mountlake-terrace',
    city: 'Mountlake Terrace',
    building: 'Terrace Village',
    street: '22002 64th Ave W',
    locality: 'Mountlake Terrace',
    region: 'WA',
    postalCode: '98043',
    phone: '(425) 775-6659',
    hours: {
      Mon: ['09:00', '18:00'],
      Tue: ['09:00', '18:00'],
      Wed: ['09:00', '14:00'],
      Thu: ['09:00', '18:00'],
      Fri: ['09:00', '14:00'],
      Sat: null,
      Sun: null,
    },
    mapsUrl: maps('Dr. Tooth, 22002 64th Ave W, Mountlake Terrace, WA 98043'),
    path: '/mountlake-terrace/',
  },
];

export const tel = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`;

/** Headline numbers. VERIFY all four with the practice; remove any that can't be substantiated. */
export const stats = [
  { value: '15+', label: 'Years of experience' }, // VERIFY
  { value: '5,000+', label: 'Patients cared for' }, // VERIFY
  { value: '2', label: 'Convenient locations' },
];

/** About-section highlights. VERIFY each claim. */
export const highlights = [
  {
    icon: 'award',
    title: 'Advanced training',
    text: 'Advanced training in implant and cosmetic dentistry.', // VERIFY (old site said "Board-certified dentists")
  },
  { icon: 'heart', title: 'Patient-centered', text: 'Your comfort and satisfaction come first.' },
  {
    icon: 'clock',
    title: 'Flexible scheduling',
    text: 'Ask about appointment times that fit your schedule.', // VERIFY (old site said "Evening and weekend appointments")
  },
  {
    icon: 'sparkle',
    title: 'Gentle care',
    text: 'Modern techniques focused on comfort.', // VERIFY (old site said "Pain-free procedures")
  },
] as const;
