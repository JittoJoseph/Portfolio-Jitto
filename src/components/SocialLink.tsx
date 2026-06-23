import Link from "next/link";

export default function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-400 transition-colors hover:text-zinc-100 [&_svg]:h-5 [&_svg]:w-5"
      aria-label={label}
    >
      {icon}
    </Link>
  );
}
