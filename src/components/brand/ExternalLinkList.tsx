interface LinkItem {
  title: string;
  url: string;
}

export default function ExternalLinkList({ links }: { links: LinkItem[] }) {
  return (
    <ul className="flex justify-center gap-2">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
