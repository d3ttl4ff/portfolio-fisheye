'use client';

const careers = [
  {
    position: 'Real-Time VFX Artist',
    company: 'Independent Contractor',
    mode: 'Remote',
    startDate: 'Jan 2026',
    endDate: 'Current',
    desc: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
      'Lorem ipsum dolor sit amet, consectetur adipiscing',
    ],
  },
  {
    position: 'Frontend Developer',
    company: 'Xaventra',
    mode: 'Remote',
    startDate: 'Oct 2024',
    endDate: 'March 2025',
    desc: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
      'Lorem ipsum dolor sit amet, consectetur adipiscing',
    ],
  },
];

const Hero = () => {
  return (
    <div className="flex flex-col gap-20 py-50">
      {careers.map((career, index) => (
        <div className="flex flex-col gap-1 px-30 mx-30 font-blender">
          <div className="flex justify-between gap-10 items-center font-bold text-3xl">
            <div className="px-2.5 min-w-110 w-fit bg-[#729252] rounded-sm text-black uppercase whitespace-nowrap">
              {career.position}
            </div>
            <div className="bg-[#729252] w-full h-0.5" />
            <div className="flex gap-3 px-5 w-fit rounded-sm text-[#729252] uppercase whitespace-nowrap">
              <p>{career.startDate}</p>
              <p>-</p>
              <p>{career.endDate}</p>
            </div>
          </div>

          <div className="flex gap-1">
            <div className="rounded-sm text-[#729252] font-bold text-2xl capitalize whitespace-nowrap">
              <p className="w-8 h-8 text-center">{`@`}</p>
            </div>
            <div className="px-3 w-fit h-full bg-white rounded-sm text-black font-bold text-2xl text-center capitalize whitespace-nowrap">
              {career.company}
            </div>
            <div className="px-3 w-fit h-full bg-black rounded-sm text-[#729252] font-bold text-2xl text-center capitalize whitespace-nowrap">
              {career.mode}
            </div>
          </div>

          <div className="flex gap-1 px-7 py-2 text-xl">
            <ul className="list-disc">
              {career.desc.map((description, index) => (
                <li key={index}>{description}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
