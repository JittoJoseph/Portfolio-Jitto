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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-400 transition-colors hover:text-zinc-100"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
