export type CareerEntry = {
  position: string;
  company: string;
  country: string;
  location: string;
  mode: string;
  startDate: string;
  endDate: string;
  desc: string[];
};

export const careers: CareerEntry[] = [
  {
    position: 'Real-Time VFX Artist (Unreal)',
    company: 'Independent Contractor',
    mode: 'Remote',
    country: '🇱🇰',
    location: 'Colombo',
    startDate: 'Jan 2026',
    endDate: 'Current',
    desc: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      'Lorem ipsum dolor sit amet, consectetur adipiscing',
    ],
  },
  {
    position: 'Frontend Dev & UI/UX Designer',
    company: 'Independent Contractor',
    mode: 'Remote',
    country: '🇱🇰',
    location: 'Colombo',
    startDate: 'Apr 2024',
    endDate: 'Current',
    desc: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit'],
  },
  {
    position: 'Marketing Executive',
    company: 'GBC International',
    mode: 'Hybrid',
    country: '🇱🇰',
    location: 'Katunayaka',
    startDate: 'Oct 2024',
    endDate: 'Feb 2025',
    desc: ['Led the UI/UX Design and Frontend Development teams.'],
  },
  {
    position: 'Frontend Developer',
    company: 'Xaventra',
    mode: 'Remote',
    country: '🇱🇰',
    location: 'Maharagama',
    startDate: 'Oct 2024',
    endDate: 'Feb 2025',
    desc: ['Led the UI/UX Design and Frontend Development teams.'],
  },
  {
    position: 'Frontend Developer',
    company: 'Xaventra',
    mode: 'Remote',
    country: '🇱🇰',
    location: 'Maharagama',
    startDate: 'Oct 2024',
    endDate: 'Feb 2025',
    desc: ['Led the UI/UX Design and Frontend Development teams.'],
  },
];

{
  /*
  Countries

  🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧 🇦🇿 🇦🇺 🇦🇼 🇦🇴 🇦🇱 🇦🇲 🇦🇸 🇦🇹 🇦🇪 🇦🇬 🇦🇫 🇦🇮 🇦🇩 🇦🇷 🇧🇴 🇧🇷 🇧🇳 🇧🇲 🇧🇹 🇧🇸 🇧🇾 🇧🇿 🇧🇼 🇧🇪 🇧🇫 🇧🇬 🇧🇭 🇧🇮 🇧🇯 🇧🇦 🇧🇧 🇧🇩 🇨🇻 🇨🇼 🇨🇺 🇨🇿 🇨🇾 🇨🇲 🇨🇰 🇨🇱 🇨🇷 🇨🇴 🇨🇩 🇨🇦 🇨🇬 🇨🇫 🇨🇮 🇨🇭 🇩🇯 🇩🇲 🇩🇰 🇩🇴 🇩🇿 🇪🇹 🇪🇷 🇪🇬 🇪🇪 🇪🇨 🇫🇴 🇫🇮 🇫🇯 🇬🇹 🇬🇳 🇬🇲 🇬🇵 🇬🇷 🇬🇶 🇬🇺 🇬🇼 🇬🇾 🇬🇫 🇬🇭 🇬🇮 🇬🇪 🇬🇩 🇬🇦 🇭🇺 🇭🇷 🇭🇳 🇭🇰 🇭🇹 🇮🇪 🇮🇩 🇮🇷 🇮🇶 🇮🇳 🇮🇱 🇮🇸 🇯🇴 🇯🇲 🇰🇬 🇰🇪 🇰🇭 🇰🇮 🇰🇼 🇰🇿 🇰🇾 🇰🇳 🇰🇲 🇰🇵 🇱🇰 🇱🇷 🇱🇸 🇱🇹 🇱🇻 🇱🇺 🇱🇾 🇱🇮 🇱🇨 🇱🇧 🇱🇦 🇲🇼 🇲🇻 🇲🇴 🇲🇪 🇲🇬 🇲🇩 🇲🇦 🇲🇳 🇲🇲 🇲🇷 🇲🇶 🇲🇹 🇲🇸 🇲🇾 🇲🇽 🇲🇿 🇲🇱 🇲🇰 🇲🇵 🇳🇮 🇳🇦 🇳🇱 🇳🇴 🇳🇵 🇳🇿 🇳🇺 🇳🇪 
  🇳🇨 🇳🇬 🇴🇲 🇵🇸 🇵🇰 🇵🇾 🇵🇼 🇵🇭 🇵🇬 🇵🇪 🇵🇦 🇵🇷 🇵🇹 🇵🇱 🇶🇦 🇷🇪 🇷🇸 🇷🇴 🇷🇼 🇸🇲 🇸🇦 🇸🇧 🇸🇨 🇸🇩 🇸🇬 🇸🇪 🇸🇮 🇸🇻 🇸🇿 🇸🇾 🇸🇽 🇸🇹 🇸🇸 🇸🇳 🇸🇱 🇸🇰 🇸🇷 🇸🇴 🇹🇴 🇹🇿 🇹🇹 🇹🇲 🇹🇳 🇹🇱 🇹🇷 🇹🇻 🇹🇬 🇹🇫 🇹🇯 🇹🇭 🇹🇨 🇺🇿 🇺🇾 🇺🇬 🇺🇦 🇻🇺 🇻🇳 🇻🇨 🇻🇪 🇻🇬 🇻🇮 🇼🇸 🇾🇪 🇿🇦 🇿🇼 🇿🇲 🇦🇶 🇦🇽 🇧🇱 🇧🇶 🇨🇨 🇨🇽 🇪🇭 🇪🇺 🇫🇰 🇫🇲 🇬🇬 🇬🇱 🇬🇸 🇮🇨 🇮🇲 🇮🇴 🇯🇪 🇲🇨 🇲🇭 🇲🇺 🇳🇫 🇳🇷 🇵🇫 🇵🇲 🇵🇳 🇸🇭 🇹🇩 🇹🇰 🇹🇼 🇻🇦 🇼🇫 🇽🇰 🇾🇹 🇦🇨 🇧🇻 🇪🇦 🇨🇵 🇩🇬 🇭🇲 🇲🇫 🇸🇯 🇹🇦 🇺🇲
  */
}
