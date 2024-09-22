export default function BaseParagraph({
  isFocused,
  isStarted,
  isTypedIncorrect,
  letterIndex,
  paragraph
}: {
  paragraph: Paragraph | undefined | null;
  isStarted: boolean;
  isFocused: boolean | undefined;
  letterIndex: number;
  isTypedIncorrect: boolean;
}) {
  return (
    <div className="select-none text-lg font-medium leading-8 text-gray-900">
      {(paragraph?.text || '').split('').map((letter, i) => (
        <span
          key={i}
          className={` ${letter === ' ' ? 'px-1' : 'px-[0.9px]'} ${isStarted && isFocused && letterIndex === i && isTypedIncorrect ? 'bg-rose-600 text-white' : ''} ${isStarted && isFocused && letterIndex === i && !isTypedIncorrect ? 'bg-sky-600 text-white' : ''} `}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
