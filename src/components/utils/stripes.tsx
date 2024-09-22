export function ZebraStripes({ left }: { left?: boolean }) {
  return (
    <div
      className={`absolute top-1/2 z-10 mx-7 flex h-full -translate-y-1/2 sm:mx-16 ${
        left ? 'left-0' : 'right-0'
      }`}
    >
      <div className="relative grid w-12 grid-cols-3 sm:w-16">
        {new Array(100).fill('nothing').map((_, i) => (
          <div key={i} className={`aspect-square ${i % 2 ? 'bg-white' : `bg-black`} `} />
        ))}
      </div>
    </div>
  );
}

export const roadStripes = (
  <div className="xs:space-x-8 flex space-x-5 sm:space-x-10 md:space-x-14 lg:space-x-20">
    <div className="h-1 w-full bg-neutral-300/60" />
    <div className="h-1 w-full bg-neutral-300/60" />
    <div className="h-1 w-full bg-neutral-300/60" />
    <div className="hidden h-1 w-full bg-neutral-300/60 sm:block" />
    <div className="hidden h-1 w-full bg-neutral-300/60 md:block" />
    <div className="hidden h-1 w-full bg-neutral-300/60 lg:block" />
    <div className="xs:block hidden h-1 w-full bg-neutral-300/60" />
  </div>
);
