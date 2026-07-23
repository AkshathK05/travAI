import { useState, useEffect } from 'react';
import { Compass, Menu, X, Globe } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore', href: '#explore' },
    { name: 'Destinations', href: '#destinations' },
    { name: 'Compare', href: '#features' },
    { name: 'Trips', href: '#explore' },
    { name: 'About', href: '#features' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3.5'
          : 'bg-white py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-200">
              <Compass className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              trav<span className="text-blue-600">AI</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors">
              Log In
            </button>
            <button className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-95">
              Sign Up
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 border-t border-slate-100 mt-3 animate-fadeIn">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <button className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                  Log In
                </button>
                <button className="w-full py-2.5 text-center text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
