import Link from "next/link";
import { Zap, Heart } from "lucide-react";

const footerLinks = {
  Tools: [
    { label: "JPG to Word", href: "/jpg-to-word" },
    { label: "PDF to Text", href: "/pdf-to-text" },
    { label: "PDF to Word", href: "/pdf-to-word" },
    { label: "PDF Merger", href: "/pdf-merge" },
    { label: "PDF Splitter", href: "/pdf-split" },
    { label: "View All Tools →", href: "/tools" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="gradient-text">iUse</span>
                <span className="text-foreground">Tools</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              Free online file conversion tools. Convert PDFs, images, and text documents — no signup, no upload, no limits. Everything stays private in your browser.
            </p>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Heart className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">100% Free Forever</p>
                <p className="text-xs text-muted-foreground">No registration required</p>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} iUseTools. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Built with privacy in mind — your files never leave your browser.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
