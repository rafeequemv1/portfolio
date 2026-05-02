export interface AppProject {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  description: string;
  category: string;
  accentColor: string;
  comingSoon?: boolean;
  beta?: boolean;
  /** Card hero (e.g. `/portfolio/.../card-thumb.webp`) */
  thumbnailUrl?: string;
  /** Full-width images in the detail panel */
  galleryImageUrls?: string[];
  /** Hands-on / event entry — detail panel shows gallery; CTA uses `externalLinkLabel` */
  workshop?: boolean;
  externalLinkLabel?: string;
}

const ISF_AR_GALLERY = [
  '/portfolio/isf-ar/01-title-slide.webp',
  '/portfolio/isf-ar/02-classroom.webp',
  '/portfolio/isf-ar/03-mentoring.webp',
  '/portfolio/isf-ar/04-ar-applications.webp',
  '/portfolio/isf-ar/05-outdoor-ar.webp',
  '/portfolio/isf-ar/06-molecule-ar.webp',
  '/portfolio/isf-ar/07-einstein-ar.webp',
] as const;

const ANDHRA_VIZAG_SCI_ILLUST_GALLERY = [
  '/portfolio/andhra-vizag-sci-illust/01-overview.webp',
  '/portfolio/andhra-vizag-sci-illust/02-lab-session.webp',
  '/portfolio/andhra-vizag-sci-illust/03-technical-session.webp',
  '/portfolio/andhra-vizag-sci-illust/04-closing.webp',
  '/portfolio/andhra-vizag-sci-illust/05-campus-vizag.webp',
] as const;

const CDRI_VIDEO_GALLERY = ['/portfolio/cdri-video-lucknow/01-hybrid-session.webp'] as const;

const IRISE_IISER_PUNE_GALLERY = [
  '/portfolio/irise-iiser-pune/01-storytelling-illustration.webp',
  '/portfolio/irise-iiser-pune/02-lab-overview-cell.webp',
  '/portfolio/irise-iiser-pune/03-anatomy-demo.webp',
  '/portfolio/irise-iiser-pune/04-inkscape-podium.webp',
  '/portfolio/irise-iiser-pune/05-participant-hands-on.webp',
  '/portfolio/irise-iiser-pune/06-presenter-slide.webp',
] as const;

const KIEL_3D_SCI_ILLUST_GALLERY = [
  '/portfolio/kiel-3d-sci-illust/01-meet-grid-10.webp',
  '/portfolio/kiel-3d-sci-illust/02-meet-grid-9.webp',
] as const;

export const APP_PROJECTS: AppProject[] = [
  {
    id: 'isf-ar-2024',
    title: 'Augmented Reality Workshop at India Science Festival',
    url: 'https://www.indiasciencefest.org/',
    displayUrl: 'January 2024 · India Science Festival',
    description:
      'Hands-on AR for science communication: the talk “ARchitects of the Unseen”, classroom sessions, one-to-one mentoring on 3D workflows, outdoor marker demos, and mobile AR triggers from sketches and everyday objects.',
    category: 'Workshop',
    accentColor: '#B3E5FC',
    workshop: true,
    thumbnailUrl: '/portfolio/isf-ar/card-thumb.webp',
    galleryImageUrls: [...ISF_AR_GALLERY],
    externalLinkLabel: 'India Science Festival',
  },
  {
    id: 'au-vizag-sci-illust',
    title: 'Scientific Illustration Workshop at Andhra University, Vizag',
    url: 'https://www.andhrauniversity.edu.in/',
    displayUrl: 'Andhra University · Visakhapatnam',
    description:
      'A full-day computer-lab workshop on scientific illustration and molecular graphics: hybrid sessions with remote panelists, hands-on practice at every desk, whiteboard walkthroughs (including molecular movie tooling), and a closing felicitation with the hosts.',
    category: 'Workshop',
    accentColor: '#C8E6C9',
    workshop: true,
    thumbnailUrl: '/portfolio/andhra-vizag-sci-illust/card-thumb.webp',
    galleryImageUrls: [...ANDHRA_VIZAG_SCI_ILLUST_GALLERY],
    externalLinkLabel: 'Andhra University',
  },
  {
    id: 'cdri-video-lucknow',
    title: 'Science Video Production Workshop at CDRI, Lucknow',
    url: 'https://www.cdri.res.in/',
    displayUrl: 'CDRI · Lucknow',
    description:
      'Hybrid workshop on science video production—remote presentation to the CDRI auditorium with a live audience, covering planning, capture, and editing for clear research storytelling.',
    category: 'Workshop',
    accentColor: '#E1BEE7',
    workshop: true,
    thumbnailUrl: '/portfolio/cdri-video-lucknow/card-thumb.webp',
    galleryImageUrls: [...CDRI_VIDEO_GALLERY],
    externalLinkLabel: 'CDRI',
  },
  {
    id: 'irise-iiser-pune-2025',
    title: 'iRISE India Workshop at IISER Pune — Scientific Illustration',
    url: 'https://www.iiserpune.ac.in/engage/outreach-and-training/irise',
    displayUrl: 'September 2025 · IISER Pune',
    description:
      'Early-career researcher session on storytelling and illustration in science: vector workflows (Inkscape-style tools), figure composition, and hands-on practice with peers in the iRISE programme at IISER Pune.',
    category: 'Workshop',
    accentColor: '#A5D6A7',
    workshop: true,
    thumbnailUrl: '/portfolio/irise-iiser-pune/card-thumb.webp',
    galleryImageUrls: [...IRISE_IISER_PUNE_GALLERY],
    externalLinkLabel: 'iRISE at IISER Pune',
  },
  {
    id: 'kiel-3d-sci-illust',
    title: '3D Scientific Illustration Workshop at Kiel University',
    url: 'https://www.uni-kiel.de/en',
    displayUrl: 'April 2025 · Kiel University (online)',
    description:
      'Online workshop for graduate researchers on 3D scientific illustration: multi-participant video sessions, shared workflows, and discussion of figure quality for papers and talks.',
    category: 'Workshop',
    accentColor: '#B2DFDB',
    workshop: true,
    thumbnailUrl: '/portfolio/kiel-3d-sci-illust/card-thumb.webp',
    galleryImageUrls: [...KIEL_3D_SCI_ILLUST_GALLERY],
    externalLinkLabel: 'Kiel University',
  },
  { id: '13', title: 'SciDart Academy', url: 'https://scidart.com', displayUrl: 'scidart.com', description: 'An upskilling platform for scientists in visual communication and illustration.', category: 'Education', accentColor: '#FFD54F' },
  { id: '1', title: 'OpenScienceArt', url: 'https://openscienceart.com', displayUrl: 'openscienceart.com', description: 'A curated open-access library of high-fidelity scientific illustrations and vectors.', category: 'Library', accentColor: '#B2DFDB' },
  { id: '2', title: 'OceanOfPapers', url: 'https://oceanofpapers.com', displayUrl: 'oceanofpapers.com', description: 'Research paper search tool.', category: 'Tool', accentColor: '#BBDEFB', beta: true },
  { id: '3', title: 'PlantIcons', url: 'https://planticons.com', displayUrl: 'planticons.com', description: 'Library of plant illustrations.', category: 'Library', accentColor: '#C8E6C9', beta: true },
  { id: '4', title: 'SciIcons', url: 'https://sciicons.com', displayUrl: 'sciicons.com', description: 'Scientific icons and symbols.', category: 'Tool', accentColor: '#B3E5FC', beta: true },
  { id: '5', title: 'MolDraw', url: 'https://moldraw.com', displayUrl: 'moldraw.com', description: 'Minimalist chemical structure editor.', category: 'Tool', accentColor: '#E1BEE7', beta: true },
  { id: '6', title: 'PosterScientist', url: 'https://posterscientist.com', displayUrl: 'posterscientist.com', description: 'Grid-based tools for academic posters.', category: 'Tool', accentColor: '#FFE0B2', beta: true },
  { id: '7', title: 'MapMyPaper', url: 'https://mapmypaper.com', displayUrl: 'mapmypaper.com', description: 'Convert papers to mindmaps.', category: 'Visualisation', accentColor: '#FFCDD2', beta: true },
  { id: '11', title: 'KiwiTeach', url: 'https://kiwiteach.com', displayUrl: 'kiwiteach.com', description: 'Interactive educational tools for biology.', category: 'Tool', accentColor: '#D1C4E9', beta: true },
  { id: '8', title: 'LabCanvas', url: 'https://labcanvas.io', displayUrl: 'labcanvas.io', description: 'Scientific illustration studio.', category: 'Tool', accentColor: '#C5CAE9', beta: true },
  { id: '9', title: 'SciCommTalent', url: 'https://scicommtalent.com', displayUrl: 'scicommtalent.com', description: 'Community of science illustrators.', category: 'Community', accentColor: '#F8BBD0' },
  { id: '12', title: 'Upscholar', url: 'https://upscholar.co/', displayUrl: 'upscholar.co', description: 'Academic job board with CV & cover letter tools.', category: 'Career', accentColor: '#CFD8DC', beta: true },
  { id: '10', title: 'TeachSlides', url: 'https://teachslides.com', displayUrl: 'teachslides.com', description: 'AI presentation generator.', category: 'Tool', accentColor: '#FFF9C4', comingSoon: true },
];
