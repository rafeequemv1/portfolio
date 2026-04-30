import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'prompt-engineering-for-scientific-storytelling',
    title: 'Prompt Engineering for Scientific Storytelling',
    subtitle: 'How to guide AI tools without losing scientific rigor.',
    date: '2026-03-18',
    excerpt:
      'A practical workflow for crafting prompts that produce accurate, publication-ready drafts for scientific writing and visual concepts.',
    content: `
      <p>Prompt engineering is not about clever tricks. It is about designing clear instruction layers that reduce ambiguity in scientific communication.</p>
      <p>My approach starts with context blocks: audience, scientific domain, output format, and quality expectations. Then I add constraints for terminology, references, and tone.</p>
      <h3>Framework I use</h3>
      <ul>
        <li><strong>Task:</strong> Define one specific outcome.</li>
        <li><strong>Context:</strong> Share research scope, assumptions, and exclusions.</li>
        <li><strong>Checks:</strong> Ask the model to self-verify claims before final output.</li>
        <li><strong>Iteration:</strong> Refine in short loops with focused feedback.</li>
      </ul>
      <p>This process is especially useful when preparing educational content, scripts for explainer videos, and early drafts of figure narratives.</p>
    `,
    readingTime: '6 min read',
    tags: ['Prompt Engineering', 'Scientific Communication', 'AI'],
    category: 'AI Workflow',
    imageUrl:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1920&auto=format&fit=crop',
    featured: true,
    author: {
      name: 'Rafeeque Mavoor',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
      role: 'Scientific Illustrator and Educator',
    },
  },
  {
    id: 'blog-2',
    slug: 'database-design-for-creative-web-products',
    title: 'Database Design for Creative Web Products',
    subtitle: 'Building resilient data models for portfolios and content systems.',
    date: '2026-02-09',
    excerpt:
      'From schema planning to indexing, this guide covers practical database patterns for modern personal brands and studio websites.',
    content: `
      <p>Creative sites often start simple and become content-heavy quickly. Good database design keeps that growth manageable.</p>
      <p>I prioritize a few principles: clean entity boundaries, explicit relations, and predictable query paths for listing pages and detail pages.</p>
      <h3>Patterns that help</h3>
      <ul>
        <li><strong>Slug-first content:</strong> Human-readable URLs backed by unique constraints.</li>
        <li><strong>Status fields:</strong> Draft and published states for safe editorial workflows.</li>
        <li><strong>Ordered content:</strong> Display order fields for curated visual storytelling.</li>
      </ul>
      <p>When your site includes blogs, workshops, and portfolio entries, these patterns reduce maintenance and improve performance.</p>
    `,
    readingTime: '5 min read',
    tags: ['Database', 'Supabase', 'Architecture'],
    category: 'Engineering',
    imageUrl:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1920&auto=format&fit=crop',
    featured: false,
    author: {
      name: 'Rafeeque Mavoor',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
      role: 'Scientific Illustrator and Educator',
    },
  },
  {
    id: 'blog-3',
    slug: 'webapp-development-for-science-educators',
    title: 'Web App Development for Science Educators',
    subtitle: 'A minimal stack for shipping useful learning tools fast.',
    date: '2026-01-12',
    excerpt:
      'A practical overview of planning, building, and deploying educational web apps with a strong focus on clarity and usability.',
    content: `
      <p>Educational tools succeed when they remove friction. I design web apps around simple user journeys, clean layouts, and measurable learning outcomes.</p>
      <p>A dependable stack includes React for interface composition, a backend platform for auth and data, and fast deployment with observability.</p>
      <h3>Execution checklist</h3>
      <ul>
        <li>Define one user problem per feature.</li>
        <li>Ship MVP with analytics from day one.</li>
        <li>Collect user feedback, then optimize interaction flows.</li>
      </ul>
      <p>The goal is not complexity. It is clarity, reliability, and iteration speed.</p>
    `,
    readingTime: '4 min read',
    tags: ['Web App Development', 'Product', 'Education'],
    category: 'Product',
    imageUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1920&auto=format&fit=crop',
    featured: false,
    author: {
      name: 'Rafeeque Mavoor',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
      role: 'Scientific Illustrator and Educator',
    },
  },
];
