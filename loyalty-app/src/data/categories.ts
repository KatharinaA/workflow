import { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'mat',         name: 'Mat & Dagligvare',   icon: '🛒' },
  { id: 'elektronikk', name: 'Elektronikk',         icon: '📱' },
  { id: 'bygg',        name: 'Bygg & Hjem',         icon: '🔨' },
  { id: 'sport',       name: 'Sport & Fritid',      icon: '🏃' },
  { id: 'helse',       name: 'Helse & Apotek',      icon: '💊' },
  { id: 'bil',         name: 'Bil & Transport',     icon: '🚗' },
  { id: 'reise',       name: 'Reise & Hotell',      icon: '✈️' },
  { id: 'forsikring',  name: 'Forsikring',           icon: '🛡️' },
  { id: 'kino',        name: 'Kino & Kultur',       icon: '🎬' },
  { id: 'mote',        name: 'Klær & Mote',         icon: '👗' },
];

export const getCategoryById = (id: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
