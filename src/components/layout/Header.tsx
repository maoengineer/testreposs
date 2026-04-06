"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Zap, Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Image Tools",
    href: "/#image-tools",
    children: [
      { label: "JPG to Word", href: "/jpg-to-word" },
      { label: "Image to Text (OCR)", href: "/image-to-text" },
      { label: "Image to PDF", href: "/image-to-pdf" },
      { label: "Image Resizer", href: "/image-resizer" },
      { label: "Image Compressor", href: "/image-compressor" },
      { label: "Image Converter", href: "/image-converter" },
      { label: "Image Watermark", href: "/image-watermark" },
    ],
  },
  {
    label: "PDF Tools",
    href: "/#pdf-tools",
    children: [
      { label: "PDF to Text", href: "/pdf-to-text" },
      { label: "PDF to Word", href: "/pdf-to-word" },
      { label: "PDF to Images", href: "/pdf-to-images" },
      { label: "PDF Merger", href: "/pdf-merge" },
      { label: "PDF Splitter", href: "/pdf-split" },
    ],
  },
  {
    label: "Text Tools",
    href: "/#text-tools",
    children: [
      { label: "Text to PDF", href: "/text-to-pdf" },
      { label: "Text to Word", href: "/text-to-word" },
      { label: "Text to Image", href: "/text-to-image" },
    ],
  },
  {
    label: "Utility Tools",
    href: "/#utility-tools",
    children: [
      { label: "Word Counter", href: "/word-counter" },
      { label: "Case Converter", href: "/case-converter" },
      { label: "QR Code Generator", href: "/qr-generator" },
      { label: "Password Generator", href: "/password-generator" },
      { label: "JSON Formatter", href: "/json-formatter" },
      { label: "Base64 Encoder/Decoder", href: "/base64" },
      { label: "URL Encoder/Decoder", href: "/url-encoder" },
      { label: "Hash Generator", href: "/hash-generator" },
      { label: "UUID Generator", href: "/uuid-generator" },
      { label: "Lorem Ipsum", href: "/lorem-ipsum" },
      { label: "Color Converter", href: "/color-converter" },
      { label: "CSV to JSON", href: "/csv-to-json" },
      { label: "Markdown Preview", href: "/markdown-preview" },
      { label: "Text Diff", href: "/text-diff" },
      { label: "Base Converter", href: "/base-converter" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-card/80 backdrop-blur-sm border-b border-border/50"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg shadow-md group-hover:shadow-lg transition-shadow">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold">
              <span className="gradient-text">iUse</span>
              <span className="text-foreground">Tools</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === link.label}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div
                    className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="w-64 rounded-xl border border-border bg-card shadow-xl p-2 max-h-[80vh] overflow-y-auto">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            <Link
              href="/tools"
              className="hidden md:flex btn-primary text-xs px-4 py-2"
            >
              All Tools
            </Link>
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
