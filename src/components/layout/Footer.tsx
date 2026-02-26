import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">AL-UCAAZ</h3>
            <p className="text-sm opacity-70 leading-relaxed font-body">
              Curated luxury fashion for the modern connoisseur. Premium fabrics, timeless design, conscious craft.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Shop</h4>
            <ul className="space-y-2 text-sm opacity-70 font-body">
              <li><Link to="/category/mens" className="hover:opacity-100 transition-opacity">Men</Link></li>
              <li><Link to="/category/womens" className="hover:opacity-100 transition-opacity">Women</Link></li>
              <li><Link to="/category/accessories" className="hover:opacity-100 transition-opacity">Accessories</Link></li>
              <li><Link to="/category/footwear" className="hover:opacity-100 transition-opacity">Footwear</Link></li>
              <li><Link to="/shop" className="hover:opacity-100 transition-opacity">All Products</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-70 font-body">
              <li><span className="cursor-default">About Us</span></li>
              <li><span className="cursor-default">Sustainability</span></li>
              <li><span className="cursor-default">Careers</span></li>
              <li><span className="cursor-default">Press</span></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-body font-semibold text-sm tracking-wider uppercase mb-4">Help</h4>
            <ul className="space-y-2 text-sm opacity-70 font-body">
              <li><span className="cursor-default">Shipping & Returns</span></li>
              <li><span className="cursor-default">Size Guide</span></li>
              <li><span className="cursor-default">Contact Us</span></li>
              <li><span className="cursor-default">FAQ</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50 font-body">© 2024 Al-ucaaz. All rights reserved. MIT License.</p>
          <div className="flex gap-6 text-xs opacity-50 font-body">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
