import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-blender-scidart-2026',
    slug: 'learn-3d-illustration-blender-researchers',
    title: 'Learn 3D illustration for science communication with Blender',
    subtitle: 'Four live evenings for researchers — May 7–10, 2026 · trusted by 1,675+ researchers.',
    date: '2026-05-02',
    excerpt:
      'Hands-on Blender for research papers, TOC graphics, and cover-style art. Four live sessions, projects, feedback, and lifetime access — beginner-friendly.',
    content: `
      <p>Trusted by more than <strong>1,675 researchers</strong>, this programme is built for people who want <strong>clear, publication-ready 3D visuals</strong> without hiring a studio. You learn to use <strong>Blender</strong>—free and open source—to support papers, presentations, proposals, and outreach.</p>
      <p><strong>Next run:</strong> May 7–10, 2026 · <strong>7:30–9:00 PM IST</strong> · <strong>₹1,999 (INR)</strong> · about <strong>$40 USD</strong>. Includes <strong>four live sessions</strong>, hands-on projects, individual support, <strong>lifetime access</strong> to materials, and a beginner-friendly pace. <em>Limited seats.</em></p>
      <p><a href="https://blender.scidart.com" target="_blank" rel="noopener noreferrer"><strong>Enroll at blender.scidart.com →</strong></a></p>

      <h3>What you will learn</h3>
      <p>The curriculum moves from foundations to finished frames: introduction to photographic thinking for CG, core 3D modeling, Blender’s interface and navigation, modifiers, particle systems, lighting, texturing, and rendering—always with <strong>science communication</strong> in mind, not generic hobby 3D.</p>

      <figure>
        <img src="/blog/blender-scidart/02-curriculum-what-you-learn.webp" alt="Workshop curriculum: photography basics, 3D modeling, UI, modifiers, particles, lighting, texturing, rendering" loading="lazy" decoding="async" />
        <figcaption>What you will learn — from Blender basics to final renders.</figcaption>
      </figure>

      <h3>What researchers make after the workshop</h3>
      <p>Participants use these skills for <strong>research figures</strong>, thesis visuals, slides, grant graphics, and social posts. Many also explore <strong>cover-style art</strong> and <strong>table-of-contents (TOC) graphics</strong>—often the first visual a reader sees in a journal.</p>

      <figure>
        <img src="/blog/blender-scidart/03-students-work.webp" alt="Student journal cover work from TU Wien, KIT Germany, TUM, IISER TVM, ICTS Bengaluru, and related institutions" loading="lazy" decoding="async" />
        <figcaption>Examples of journal-cover direction from past participants (institutions vary by cohort).</figcaption>
      </figure>

      <h3>How the week is structured</h3>
      <ul>
        <li><strong>Live sessions:</strong> instruction, demos, and Q&amp;A—your questions addressed in real time.</li>
        <li><strong>Hands-on projects:</strong> multiple illustration exercises so you internalize the workflow.</li>
        <li><strong>Feedback:</strong> input on submissions during live time.</li>
        <li><strong>Community:</strong> ongoing WhatsApp group to share work and get quick help when you are stuck.</li>
        <li><strong>Assets:</strong> access to scientific 3D models you can reuse without extra licensing friction.</li>
      </ul>
      <p><strong>Requirements:</strong> a computer that runs Blender (install from <a href="https://www.blender.org" target="_blank" rel="noopener noreferrer">blender.org</a>), a <strong>mouse</strong> (trackpads are painful for this workflow), and a stable internet connection. No prior Blender experience required.</p>
      <p>If you are ready to invest a few evenings in a skill that pays off for years of publishing and teaching, start here: <a href="https://blender.scidart.com" target="_blank" rel="noopener noreferrer"><strong>blender.scidart.com</strong></a></p>
    `,
    readingTime: '3 min read',
    tags: ['Blender', 'Workshop', 'Scientific Illustration', 'SciDart'],
    category: 'Workshops',
    imageUrl: '/blog/blender-scidart/01-workshop-banner.webp',
    featured: true,
    author: {
      name: 'Rafeeque Mavoor',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop&fm=webp',
      role: 'Scientific Illustrator and Educator',
    },
  },
  {
    id: 'blog-moldraw-2024',
    slug: 'moldraw-free-alternative-chemdraw',
    title: 'MolDraw: a free alternative to ChemDraw',
    subtitle: 'Browser-based structures, 3D visualization, and exports — built on Ketcher, from SciDart.',
    date: '2024-11-25',
    excerpt:
      'MolDraw (moldraw.com) brings professional 2D drafting, instant 3D views, SMILES, and multiple export formats in a free, open tool you can use from any modern browser.',
    content: `
      <p>In chemistry and molecular modeling, drawing structures and visualizing compounds is part of daily work. Many labs rely on commercial suites such as ChemDraw—but there is also a <strong>powerful, free, open</strong> path that stays intuitive and fast: <strong><a href="https://moldraw.com" target="_blank" rel="noopener noreferrer">MolDraw</a></strong> at <strong>moldraw.com</strong>, developed in the SciDart ecosystem.</p>
      <p>MolDraw is a <strong>web-based molecular editor</strong> built on <strong>Ketcher</strong>, so the drawing experience feels familiar if you have used modern structure editors. You can sketch anything from quick fragments to large, publication-style diagrams, then move into <strong>3D ball-and-stick</strong> views, inspect <strong>SMILES</strong> and properties, and <strong>export</strong> in formats you need for workflows and teaching.</p>

      <h2>Why choose MolDraw?</h2>
      <ul>
        <li><strong>Open and free:</strong> No seat licenses. Use it in the browser, and the stack is open source—so teachers, students, and labs are not blocked by pricing.</li>
        <li><strong>Simple, dense interface:</strong> Toolbars for bonds, rings, elements, and cleanup are laid out for chemistry work, not generic vector drawing—so you get accurate structures quickly.</li>
        <li><strong>Strong functionality:</strong> Structure editing, SMILES in and out, reactions, downloads, and compatibility with common chemistry workflows—suitable for beginners and for researchers who need reliable exports.</li>
      </ul>
      <p>Together, that means you can <strong>create, edit, and share</strong> structures for research, coursework, or outreach without a separate install if you prefer a cloud-first setup.</p>

      <figure>
        <img src="/blog/moldraw/01-2d-3d-split.png" alt="MolDraw interface with 2D structure editor and 3D ball-and-stick viewer side by side" loading="lazy" decoding="async" />
        <figcaption>2D drafting alongside a 3D viewer—draw on the left, explore geometry and properties on the right.</figcaption>
      </figure>

      <h3>From small molecules to demanding diagrams</h3>
      <p>The same canvas scales from teaching examples to intricate systems. For large or advanced scaffolds, MolDraw keeps standard chemical notation—stereochemistry, heteroatoms, fused rings—so diagrams stay readable at poster or slide scale.</p>

      <figure>
        <img src="/blog/moldraw/02-complex-structure.png" alt="MolDraw canvas showing a large complex molecular structure with professional drawing tools" loading="lazy" decoding="async" />
        <figcaption>Complex structures on a familiar Ketcher-style canvas—useful when you need depth without leaving the browser.</figcaption>
      </figure>

      <h3>2D and 3D together</h3>
      <p>For many compounds, MolDraw links <strong>2D sketches</strong> to an interactive <strong>3D</strong> representation. Detail panels can show identifiers such as <strong>IUPAC-style names</strong> where available, <strong>SMILES</strong>, and <strong>molecular mass</strong>—handy for checking a structure before you drop it into a report or LMS.</p>

      <figure>
        <img src="/blog/moldraw/03-acetaminophen-2d-3d.png" alt="Acetaminophen shown in 2D and 3D in MolDraw with molecule details panel" loading="lazy" decoding="async" />
        <figcaption>Example: acetaminophen in 2D and 3D with supporting metadata (illustrative screenshot).</figcaption>
      </figure>

      <h3>Beyond small molecules: proteins in 3D</h3>
      <p>MolDraw also supports a <strong>protein</strong> workflow: load structures (for example by PDB ID), view them in styles such as <strong>cartoon</strong>, and export images or model formats where the tool provides them—useful when you teach structure or need a quick, shareable visualization.</p>

      <figure>
        <img src="/blog/moldraw/04-protein-1crn.png" alt="MolDraw protein viewer showing crambin PDB 1CRN as a rainbow cartoon with structure details" loading="lazy" decoding="async" />
        <figcaption>Protein mode: example ribbon view with PDB metadata (here: crambin, 1CRN).</figcaption>
      </figure>

      <h2>See MolDraw in action</h2>
      <p>Below is a short walkthrough video that demonstrates the workflow and interface on <strong>moldraw.com</strong>—ideal if you want a guided tour before your first session.</p>
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;border:1px solid rgba(55,53,47,0.12);margin:2rem 0;max-width:100%">
        <iframe style="position:absolute;top:0;left:0;width:100%;height:100%" src="https://www.youtube.com/embed/LFvrKzA02ok" title="MolDraw — molecular drawing and 3D visualization on moldraw.com" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
      </div>

      <h2>Start drawing</h2>
      <p>Open <strong><a href="https://moldraw.com" target="_blank" rel="noopener noreferrer">moldraw.com</a></strong>, try a few structures, and export what you need. For educators and students especially, it is a practical way to keep chemistry visual, rigorous, and accessible—without a ChemDraw license on every machine.</p>
    `,
    readingTime: '5 min read',
    tags: ['MolDraw', 'Chemistry', 'Open Source', 'SciDart', 'Ketcher'],
    category: 'Tools',
    imageUrl: '/blog/moldraw/03-acetaminophen-2d-3d.png',
    featured: true,
    author: {
      name: 'Rafeeque Mavoor',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop&fm=webp',
      role: 'Scientific Illustrator and Educator',
    },
  },
];
