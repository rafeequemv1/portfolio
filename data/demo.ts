import { Workshop } from '../types';

export const demoWorkshops: Workshop[] = [
  {
    id: 'demo-1',
    title: '3D Molecular Visualization with Blender',
    date: '2023-11-15T09:00:00.000Z',
    location: 'Oxford, UK',
    institute: 'University of Oxford',
    mode: 'Offline',
    description: 'A hands-on workshop covering the fundamentals of creating stunning, publication-quality molecular visuals using Blender.',
    status: 'Past',
    cover_image: 'https://images.unsplash.com/photo-1554189097-c48c982a8de3?q=80&w=1887&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop',
    ],
    content: `
      <p>This intensive three-day workshop guided researchers, students, and academics through the full pipeline of scientific visualization using Blender, a powerful open-source 3D suite. We started from the very basics, ensuring even absolute beginners could follow along, and progressively moved towards advanced techniques for creating cinematic, publication-quality renders.</p>
      <h3 id="topics-covered">Topics Covered</h3>
      <ul>
        <li><strong>Introduction to Blender:</strong> Navigating the interface, understanding objects, and basic manipulations.</li>
        <li><strong>Importing Molecular Data:</strong> Best practices for importing PDB files and preparing them for visualization.</li>
        <li><strong>Shading and Materials:</strong> Creating scientifically accurate and aesthetically pleasing materials for proteins, ligands, and membranes.</li>
        <li><strong>Lighting and Composition:</strong> Applying principles of cinematography to create dramatic and clear visuals.</li>
        <li><strong>Rendering with Cycles:</strong> Optimizing render settings for high-quality, noise-free images.</li>
      </ul>
      <p>The workshop culminated in a project where each participant created a unique render of a molecule of their choice, applying all the techniques learned throughout the course.</p>
    `,
    testimonials: [{ quote: 'Transformed the way I approach visualizing my data. An essential course for any computational biologist.', author: 'Dr. Jane Doe', role: 'Postdoctoral Researcher' }]
  },
  {
    id: 'demo-2',
    title: 'Principles of Effective Scientific Illustration',
    date: '2024-03-22T10:00:00.000Z',
    location: 'Online',
    institute: 'SciDart Academy',
    mode: 'Online',
    description: 'An interactive online course focusing on the core principles of design, color theory, and composition in scientific art.',
    status: 'Past',
    cover_image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=1887&auto=format&fit=crop',
    gallery_images: [
        'https://images.unsplash.com/photo-1499244571948-7ccddb3583f1?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1456325504744-8262a6a4a588?q=80&w=2070&auto=format&fit=crop',
    ],
    content: '<p>Participants from around the globe joined this virtual workshop to learn how to create clear, concise, and compelling scientific figures that communicate research effectively. We explored case studies from top journals and practiced applying design theory to real-world data.</p>'
  },
  {
    id: 'demo-3',
    title: 'Visual Storytelling for Complex Data',
    date: '2024-05-10T10:00:00.000Z',
    location: 'Hybrid',
    institute: 'EMBL',
    mode: 'Hybrid',
    description: 'Learn to translate complex datasets into intuitive and impactful visual narratives for grants, papers, and public outreach.',
    status: 'Past',
    cover_image: 'https://images.unsplash.com/photo-1526649661456-89c7ed4d53b8?q=80&w=1887&auto=format&fit=crop',
    gallery_images: [],
    content: '<p>This workshop focused on the intersection of data science and graphic design, teaching participants how to build compelling narratives around their research data.</p>'
  }
];