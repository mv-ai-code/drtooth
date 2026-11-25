/**
 * Services shown on the home page and office pages.
 * `icon` keys map to drawings in src/components/ServiceIcon.astro.
 */
export interface Service {
  title: string;
  description: string;
  icon: string;
  group: 'general' | 'restorative' | 'implants' | 'technology' | 'aesthetic';
}

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
    description: 'A custom permanent crown in a single visit with CEREC CAD/CAM technology.', // VERIFY: which offices
    icon: 'cerec',
    group: 'technology',
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
