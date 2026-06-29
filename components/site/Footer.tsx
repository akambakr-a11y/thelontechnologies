import Image from "next/image";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Image
            src="/assets/logo.webp"
            alt="Thelon Technologies"
            width={1250}
            height={270}
            className="h-8 w-auto"
          />

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Thelon Technologies Inc. All rights reserved.</p>
          <p>
            AI software studio ·{" "}
            <a href="mailto:hello@thelontech.com" className="font-medium text-ink hover:text-primary">
              hello@thelontech.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
