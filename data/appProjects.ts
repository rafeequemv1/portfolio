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
}

export const APP_PROJECTS: AppProject[] = [
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
