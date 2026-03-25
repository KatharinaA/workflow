import { Membership } from '../types';

export const MEMBERSHIPS: Membership[] = [
  {
    id: 'obos',
    name: 'OBOS',
    shortName: 'OBOS',
    color: '#00529B',
    secondaryColor: '#003F7A',
    textColor: '#FFFFFF',
    description: 'OBOS er et boligbyggelag med over 500 000 medlemmer i Norge.',
  },
  {
    id: 'coop',
    name: 'Coop',
    shortName: 'Coop',
    color: '#009846',
    secondaryColor: '#007234',
    textColor: '#FFFFFF',
    description: 'Coop er et samvirkeforetak som driver dagligvarehandel og andre butikker.',
  },
];

export const getMembership = (id: string): Membership | undefined =>
  MEMBERSHIPS.find((m) => m.id === id);
