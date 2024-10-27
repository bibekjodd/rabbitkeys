import { GithubIcon } from 'lucide-react';

export default function Footer() {
  return (
    <div className="flex items-center justify-center py-5">
      <p className="flex items-center">
        <span className="mr-3 font-semibold text-neutral-200">Made by </span>
        <a
          href="https://github.com/bibekjodd"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-fit items-center"
        >
          {/* // TODO: deprecated github icon */}
          <GithubIcon className="mr-1 h-5 w-5 text-white" />
          <span className="font-semibold text-neutral-100 group-hover:underline">@bibekjodd </span>
        </a>
      </p>
    </div>
  );
}
