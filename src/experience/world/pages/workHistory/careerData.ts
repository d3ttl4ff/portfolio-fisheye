export type CareerEntry = {
  position: string;
  company: string;
  mode: string;
  startDate: string;
  endDate: string;
  desc: string[];
};

export const careers: CareerEntry[] = [
  {
    position: 'Real-Time VFX Artist',
    company: 'Independent Contractor',
    mode: 'Remote',
    startDate: 'Jan 2026',
    endDate: 'Current',
    desc: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      'Lorem ipsum dolor sit amet, consectetur adipiscing',
    ],
  },
  {
    position: 'Frontend Developer',
    company: 'Xaventra',
    mode: 'Remote',
    startDate: 'Oct 2024',
    endDate: 'Mar 2025',
    desc: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      'Lorem ipsum dolor sit amet, consectetur adipiscing',
    ],
  },
  {
    position: 'Frontend Developer',
    company: 'Xaventra2',
    mode: 'Remote',
    startDate: 'Oct 2024',
    endDate: 'Mar 2025',
    desc: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      'Lorem ipsum dolor sit amet, consectetur adipiscing',
    ],
  },
];
