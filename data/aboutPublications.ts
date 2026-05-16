/** Co-author publications — shown on About (minimal list). */
export type AboutPublication = {
  title: string;
  href: string;
  journal?: string;
  year?: string;
};

export const ABOUT_PUBLICATIONS: AboutPublication[] = [
  {
    title:
      'Recent Advancements of Graphene-Based Materials for Zinc-Based Batteries: Beyond Lithium-Ion Batteries',
    href: 'https://onlinelibrary.wiley.com/doi/10.1002/smll.202305217',
    journal: 'Small',
    year: '2023',
  },
  {
    title: 'Membranes prepared from graphene-based nanomaterials for water purification: a mini-review',
    href: 'https://pubs.rsc.org/en/content/articlelanding/2022/nr/d2nr05328d',
    journal: 'Nanoscale',
    year: '2022',
  },
  {
    title: 'Sustainable Production of Molybdenum Carbide (MXene) from Fruit Wastes for Improved Solar Evaporation',
    href: 'https://chemistry-europe.onlinelibrary.wiley.com/doi/10.1002/chem.202203184',
    journal: 'Chemistry – A European Journal',
    year: '2022',
  },
  {
    title:
      'Sustainable development of graphitic carbon nanosheets from plastic wastes with efficient photothermal energy conversion for enhanced solar evaporation',
    href: 'https://pubs.rsc.org/en/content/articlelanding/2022/ta/d2ta02092k',
    journal: 'J. Mater. Chem. A',
    year: '2022',
  },
];
