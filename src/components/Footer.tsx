export default function Footer() {
  return (
    <footer className="bg-background-dark border-t border-text-light/10 py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content - Row layout on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 md:gap-12 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-light mb-4"> 
              Pour & Whisk
            </h2>
            <p className="text-text-light/40 text-lg italic">
              "Sip, Stillness. Discover our craft in every cup."
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-text-light mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-text-light/40 hover:text-text-light transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#" className="text-text-light/40 hover:text-text-light transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-text-light/40 hover:text-text-light transition-colors">
                  Location
                </a>
              </li>
              <li>
                <a href="#" className="text-text-light/40 hover:text-text-light transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-text-light mb-4">Follow Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-text-light/40 hover:text-text-light transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-text-light/40 hover:text-text-light transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-text-light/40 hover:text-text-light transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-text-light/10">
          <p className="text-text-light/60 text-sm">
            © {new Date().getFullYear()} Pour & Whisk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

