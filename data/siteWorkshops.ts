import type { Workshop } from '../types';

/**
 * Featured workshops shown on /workshops (merged with Supabase rows).
 * IDs must not collide with database UUIDs — use `site-` prefix.
 */
export const SITE_WORKSHOPS: Workshop[] = [
  {
    id: 'site-jncasr-sci-illust-2026',
    strand: 'illustration',
    title: 'Scientific Illustration Workshop (2 days) — JNCASR, Bangalore',
    date: '2026-03-15T09:30:00.000Z',
    location: 'Bangalore, India',
    institute: 'Jawaharlal Nehru Centre for Advanced Scientific Research (JNCASR)',
    mode: 'Offline',
    description:
      'Two-day programme at JNCASR on scientific illustration for research: seminar-hall sessions with live demos, hands-on practice on laptops (including 3D structural and crystal-lattice visuals), and workflows toward clear, publication-style figures.',
    status: 'Past',
    cover_image: '/workshops/jncasr/01-cover.webp',
    gallery_images: [
      '/workshops/jncasr/02-lectern.webp',
      '/workshops/jncasr/03-classroom.webp',
      '/workshops/jncasr/04-hall.webp',
    ],
    content: `
      <p>This two-day workshop at <strong>JNCASR, Bangalore</strong> focused on scientific illustration skills for students and researchers: from structuring a figure narrative to executing visuals on screen in a fully equipped seminar space.</p>
      <p>Sessions combined front-of-room instruction with extended laptop time so participants could follow along on molecular graphics, unit-cell views, and layout habits suited to journals and talks.</p>
      <p><a href="https://www.jncasr.ac.in" target="_blank" rel="noopener noreferrer">JNCASR — Jawaharlal Nehru Centre for Advanced Scientific Research</a></p>
    `,
  },
  {
    id: 'site-kiel-3d-sci-illust',
    strand: 'illustration',
    title: '3D Scientific Illustration Workshop at Kiel University',
    date: '2025-04-10T14:00:00.000Z',
    location: 'Kiel, Germany (online)',
    institute: 'Kiel University',
    mode: 'Online',
    description:
      'Remote workshop on 3D scientific illustration with a cohort of graduate researchers—live video sessions, screen sharing, and Q&A across time zones.',
    status: 'Past',
    cover_image: '/portfolio/kiel-3d-sci-illust/card-thumb.webp',
    gallery_images: [
      '/portfolio/kiel-3d-sci-illust/01-meet-grid-10.webp',
      '/portfolio/kiel-3d-sci-illust/02-meet-grid-9.webp',
    ],
    content: `
      <p>This online programme at Kiel University brought participants together in structured video calls to work through 3D illustration workflows for research communication.</p>
      <p>Sessions combined live demonstration with group discussion so everyone could follow along from their own desk.</p>
      <p><a href="https://www.uni-kiel.de/en" target="_blank" rel="noopener noreferrer">Kiel University</a></p>
    `,
  },
  {
    id: 'site-irise-iiser-pune-2025',
    strand: 'illustration',
    title: 'iRISE India Workshop at IISER Pune — Scientific Illustration',
    date: '2025-09-20T09:30:00.000Z',
    location: 'Pune, India',
    institute: 'IISER Pune (iRISE India programme)',
    mode: 'Offline',
    description:
      'Workshop on storytelling and scientific illustration for early-career researchers: slides and demos on visual narrative, vector illustration at the podium, and guided laptop exercises with iRISE branding on site.',
    status: 'Past',
    cover_image: '/portfolio/irise-iiser-pune/card-thumb.webp',
    gallery_images: [
      '/portfolio/irise-iiser-pune/01-storytelling-illustration.webp',
      '/portfolio/irise-iiser-pune/02-lab-overview-cell.webp',
      '/portfolio/irise-iiser-pune/03-anatomy-demo.webp',
      '/portfolio/irise-iiser-pune/04-inkscape-podium.webp',
      '/portfolio/irise-iiser-pune/05-participant-hands-on.webp',
      '/portfolio/irise-iiser-pune/06-presenter-slide.webp',
    ],
    content: `
      <p>This iRISE session at IISER Pune focused on how illustration supports science communication—from high-level storytelling on screen to practical vector editing and anatomy-style figure work.</p>
      <p>Participants worked at their own laptops with structured activities (shapes, palettes, references) while instructors demonstrated workflows at the front of the room.</p>
      <p>More about the programme: <a href="https://www.iiserpune.ac.in/engage/outreach-and-training/irise" target="_blank" rel="noopener noreferrer">iRISE — Outreach and Training at IISER Pune</a>.</p>
    `,
  },
  {
    id: 'site-cdri-video-lucknow',
    strand: 'outreach',
    title: 'Science Video Production Workshop at CDRI, Lucknow',
    date: '2024-06-01T10:00:00.000Z',
    location: 'Lucknow, India',
    institute: 'CSIR–Central Drug Research Institute (CDRI)',
    mode: 'Hybrid',
    description:
      'Hybrid session on planning, shooting, and editing short-form science video—with remote presentation to the CDRI auditorium and hands-on discussion with participants on site.',
    status: 'Past',
    cover_image: '/portfolio/cdri-video-lucknow/card-thumb.webp',
    gallery_images: ['/portfolio/cdri-video-lucknow/01-hybrid-session.webp'],
    content: `
      <p>This workshop at CDRI focused on practical science video production: structuring a clear message for researchers and the public, capturing usable footage, and editing for clarity rather than spectacle.</p>
      <p>The format combined a remote presenter feed with a live audience in the CDRI auditorium, so early-career scientists could ask questions in real time while seeing both the speaker and the room.</p>
    `,
  },
  {
    id: 'site-kerala-blender-2024',
    strand: 'illustration',
    title: '3D Scientific Illustration with Blender — University of Kerala',
    date: '2024-01-24T09:30:00.000Z',
    location: 'Thiruvananthapuram, India',
    institute: 'University of Kerala',
    mode: 'Offline',
    description:
      'Hands-on introduction to 3D scientific illustration in Blender: welcome session with University of Kerala / Department of Botany, computer-lab practice, and live demos from primitives to research-style visuals.',
    status: 'Past',
    cover_image: '/workshops/kerala/01-cover.webp',
    gallery_images: [
      '/workshops/kerala/02-lab-wide.webp',
      '/workshops/kerala/03-laptop.webp',
      '/workshops/kerala/04-session.webp',
      '/workshops/kerala/05-group.webp',
      '/workshops/kerala/06-demo.webp',
    ],
    content: `
      <p>Full-day workshop at the <strong>University of Kerala</strong> (Department of Botany) introducing <strong>Blender</strong> for 3D scientific illustration—from basic shapes and navigation to workflows suited to figures and talks.</p>
      <p>Sessions moved between the seminar space and the computer lab so participants could follow live projection, then practice at their own workstations with instructor support.</p>
      <p><a href="https://www.keralauniversity.ac.in" target="_blank" rel="noopener noreferrer">University of Kerala</a></p>
    `,
  },
  {
    id: 'site-au-vizag-sci-illust',
    strand: 'illustration',
    title: 'Scientific Illustration Workshop at Andhra University, Vizag',
    date: '2024-04-15T09:30:00.000Z',
    location: 'Visakhapatnam, India',
    institute: 'Andhra University',
    mode: 'Hybrid',
    description:
      'Full-day lab workshop on scientific illustration and molecular graphics—hybrid panels, hands-on practice at every workstation, and technical walkthroughs for research visuals.',
    status: 'Past',
    cover_image: '/portfolio/andhra-vizag-sci-illust/card-thumb.webp',
    gallery_images: [
      '/portfolio/andhra-vizag-sci-illust/01-overview.webp',
      '/portfolio/andhra-vizag-sci-illust/02-lab-session.webp',
      '/portfolio/andhra-vizag-sci-illust/03-technical-session.webp',
      '/portfolio/andhra-vizag-sci-illust/04-closing.webp',
      '/portfolio/andhra-vizag-sci-illust/05-campus-vizag.webp',
    ],
    content: `
      <p>Participants worked through scientific illustration workflows in a dedicated computer lab, with hybrid sessions connecting remote panelists to the room.</p>
      <p>The day included whiteboard-led technical segments (environment setup and molecular visualization tooling), extended hands-on time at each desk, and a closing felicitation with the hosts.</p>
    `,
  },
  {
    id: 'site-isf-ar-2024',
    strand: 'outreach',
    title: 'Augmented Reality Workshop at India Science Festival',
    date: '2024-01-20T09:00:00.000Z',
    location: 'Pune, India',
    institute: 'India Science Festival',
    mode: 'Offline',
    description:
      'Hands-on AR for science communication: keynote themes, classroom instruction, mentoring on 3D workflows, outdoor marker demos, and mobile AR from simple sketches and objects.',
    status: 'Past',
    cover_image: '/portfolio/isf-ar/card-thumb.webp',
    gallery_images: [
      '/portfolio/isf-ar/01-title-slide.webp',
      '/portfolio/isf-ar/02-classroom.webp',
      '/portfolio/isf-ar/03-mentoring.webp',
      '/portfolio/isf-ar/04-ar-applications.webp',
      '/portfolio/isf-ar/05-outdoor-ar.webp',
      '/portfolio/isf-ar/06-molecule-ar.webp',
      '/portfolio/isf-ar/07-einstein-ar.webp',
    ],
    content: `
      <p>This India Science Festival session introduced augmented reality as a medium for science communication—from live demos to participant-led exploration on their own phones.</p>
      <p>Activities ranged from formal presentation blocks to small-group mentoring, outdoor marker-based exercises, and creative triggers tied to everyday materials.</p>
    `,
  },
];

export function findSiteWorkshop(id: string): Workshop | undefined {
  return SITE_WORKSHOPS.find((w) => w.id === id);
}
