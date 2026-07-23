import { useState } from "react";
import { Compass, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (email) {
      setSubscribed(true);
      setEmail("");

      setTimeout(() => {
        setSubscribed(false);
      }, 4000);
    }
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Explore", href: "#" },
        { name: "Compare", href: "#" },
        { name: "Destinations", href: "#" },
        { name: "Price Alerts", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Press", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#" },
        { name: "FAQs", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Refund Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ---------- TOP ---------- */}

        <div className="grid lg:grid-cols-12 gap-12 py-16 border-b border-slate-800">

          {/* Brand */}

          <div className="lg:col-span-5">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>

              <span className="text-2xl font-bold text-white">
                trav<span className="text-blue-400">AI</span>
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Redefining travel planning with intelligent recommendations,
              real-time pricing insights, destination discovery, and seamless
              trip planning—all in one place.
            </p>
          </div>

          {/* Newsletter */}

          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6">

              <h3 className="text-white font-semibold text-lg">
                Stay updated
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Get travel inspiration, exclusive deals and price alerts.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-5 flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {subscribed && (
                <p className="mt-4 text-sm text-emerald-400">
                  ✓ Thanks for subscribing!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ---------- LINKS ---------- */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14 border-b border-slate-800">

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-5">
                {section.title}
              </h4>

              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* ---------- BOTTOM ---------- */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 text-sm text-slate-500">

          <p>
            © 2026 <span className="font-semibold text-white">travAI</span>.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Terms
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Cookies
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}