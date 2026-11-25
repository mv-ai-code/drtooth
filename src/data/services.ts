/**
 * Services shown on the home page and office pages.
 * `icon` keys map to drawings in src/components/ServiceIcon.astro.
 *
 * To add a procedure video: put its three files in public/videos/ and add a `video` entry to the
 * service below. The card button, pop-up player and search-engine data are generated from it.
 */
export interface ServiceVideo {
  /** Shown above the transcript and used in the button's accessible name. */
  title: string;
  /** One sentence, for search engines (VideoObject). */
  description: string;
  src720: string;
  /** Used on screens 1280px and wider. */
  src1080: string;
  poster: string;
  /** ISO 8601, e.g. 'PT46S'. */
  duration: string;
  /** YYYY-MM-DD the video was first published on the site. */
  uploadDate: string;
  /** One line per step, shown under the video. */
  transcript: string[];
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  group: 'general' | 'restorative' | 'implants' | 'technology' | 'aesthetic';
  video?: ServiceVideo;
}

/** URL-safe id from a service title, e.g. 'Dental Implants' -> 'dental-implants'. */
export const serviceSlug = (s: Service) =>
  s.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const services: Service[] = [
  {
    title: 'Dental Fillings',
    description: 'Restore decayed teeth with natural-looking, tooth-colored fillings.', // VERIFY: old site also mentioned amalgam
    icon: 'filling',
    group: 'general',
  },
  {
    title: 'Root Canal Treatment',
    description: 'Root canal therapy to save infected teeth and relieve discomfort.',
    icon: 'rootcanal',
    group: 'general',
  },
  {
    title: 'Tooth Extraction',
    description: 'Gentle tooth removal when it is the right option, with careful aftercare.',
    icon: 'extraction',
    group: 'general',
  },
  {
    title: 'Dental Implants',
    description: 'Permanent tooth replacement that looks, feels and functions like natural teeth.',
    icon: 'implant',
    group: 'implants',
    video: {
      title: 'How dental implants work',
      description:
        'A 46-second narrated animation showing how a dental implant replaces a missing tooth, from placement and healing to the abutment and crown.',
      src720: '/videos/implant-explainer-720p.mp4',
      src1080: '/videos/implant-explainer-1080p.mp4',
      poster: '/videos/implant-explainer-poster.jpg',
      duration: 'PT46S',
      uploadDate: '2026-11-25',
      // Approved by Dr. Vainer; matches the narration.
      transcript: [
        'How dental implants work.',
        'Step one: the missing tooth. A gap can let nearby teeth shift, and the jawbone shrink over time.',
        'Step two: the implant. A small titanium post is placed in the jawbone, where the tooth root used to be.',
        'Step three: healing. Over the next few months, the bone grows around the implant, and anchors it firmly.',
        'Step four: the abutment. A small connector is attached to the implant, to hold the new tooth.',
        'Step five: the new crown. A custom crown is attached, shaped and shaded to match your natural teeth.',
        'Is a dental implant right for you? Book a consultation with Doctor Tooth, Family and Implant Dentistry.',
      ],
    },
  },
  {
    title: 'Bone Grafting',
    description: 'Rebuild bone to prepare your jaw for successful implant placement.',
    icon: 'bonegraft',
    group: 'implants',
  },
  {
    title: 'Prosthodontics',
    description: 'Custom dentures, bridges and full-mouth restorations.',
    icon: 'prosthodontics',
    group: 'restorative',
  },
  {
    title: 'Crowns',
    description: 'Durable, custom-made crowns to protect and restore damaged teeth.',
    icon: 'crown',
    group: 'restorative',
  },
  {
    title: 'Same-Day Crowns (CEREC)',
    description: 'A custom permanent crown in a single visit with CEREC CAD/CAM technology. Available at our Bellevue office.',
    icon: 'cerec',
    group: 'technology',
    video: {
      title: 'Same-day crowns with CEREC',
      description:
        'A 47-second narrated animation showing how a CEREC same-day crown is made in one visit, from tooth preparation and digital scan to design, milling and bonding.',
      src720: '/videos/cerec-crown-720p.mp4',
      src1080: '/videos/cerec-crown-1080p.mp4',
      poster: '/videos/cerec-crown-poster.jpg',
      duration: 'PT47S',
      uploadDate: '2026-11-25',
      // Matches the narration.
      transcript: [
        'Same-day crowns with CEREC.',
        'Step one: preparing the tooth. The damaged tooth is gently shaped to receive a crown, all in a single visit.',
        'Step two: the digital scan. A small camera scans the prepared tooth and its neighbors. No messy impressions.',
        'Step three: the design. Your crown is designed on the computer, to fit your bite precisely.',
        'Step four: milling. An in-office milling unit carves your crown from a solid ceramic block.',
        'Step five: your new crown. The permanent crown is bonded in place, all in one visit of about two hours.',
        'Same-day crowns are available at our Bellevue office. Book a consultation with Doctor Tooth, Family and Implant Dentistry.',
      ],
    },
  },
  {
    title: 'CBCT 3D Imaging',
    description: 'Cone beam 3D scans for precise diagnosis and implant planning.', // VERIFY: which offices
    icon: 'cbct',
    group: 'technology',
  },
  {
    title: 'Botox',
    description: 'Cosmetic Botox treatments for a refreshed, natural look.', // VERIFY: scope of practice
    icon: 'botox',
    group: 'aesthetic',
  },
  {
    title: 'Lip Filler',
    description: 'Lip enhancement for fuller, naturally balanced lips.', // VERIFY: scope of practice
    icon: 'lips',
    group: 'aesthetic',
  },
];
