import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-ivory-light mb-4">AL-UCAAZ</h3>
            <p className="text-sm text-primary-foreground/70 leading-relaxed font-body">
              Premium night suits &amp; pajama sets — soft cotton jersey, relaxed fits, made for
              slow evenings.
            </p>
          </div>

          {/* Shop — real routes only */}
          <div>
            <h4 className="font-body font-semibold text-sm tracking-wider uppercase text-ivory-light mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70 font-body">
              <li>
                <Link to="/category/womens" className="hover:text-ivory-light transition-colors">
                  Women&apos;s Pajama Sets
                </Link>
              </li>
              <li>
                <Link to="/category/couple" className="hover:text-ivory-light transition-colors">
                  Couple Sets
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-ivory-light transition-colors">
                  All Night Suits
                </Link>
              </li>
            </ul>
          </div>

          {/* Company — plain text only, no links (no real pages exist yet).
              Phase 1B: dimmed so they read as plain text, not as links. */}
          <div>
            <h4 className="font-body font-semibold text-sm tracking-wider uppercase text-ivory-light mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/40 font-body">
              <li>
                <span>About Us</span>
              </li>
              <li>
                <span>Sustainability</span>
              </li>
              <li>
                <span>Careers</span>
              </li>
              <li>
                <span>Press</span>
              </li>
            </ul>
          </div>

          {/* Help — Size Guide is the only real link (home section anchor);
              the rest stay plain text, dimmed so they do not look clickable. */}
          <div>
            <h4 className="font-body font-semibold text-sm tracking-wider uppercase text-ivory-light mb-4">
              Help
            </h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li>
                <span className="text-primary-foreground/40">Shipping &amp; Returns</span>
              </li>
              <li>
                <a href="/#size-guide" className="text-primary-foreground/70 hover:text-ivory-light transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <span className="text-primary-foreground/40">Contact Us</span>
              </li>
              <li>
                <span className="text-primary-foreground/40">FAQ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50 font-body">
            © 2026 Al-ucaaz. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-primary-foreground/40 font-body">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
