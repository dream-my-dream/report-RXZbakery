import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTE_PATHS } from '@/lib/index';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: ROUTE_PATHS.HOME, label: '首頁' },
    { to: ROUTE_PATHS.PRODUCTS, label: '麵包一覽' },
    { to: ROUTE_PATHS.PREORDER, label: '立即預購' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary" style={{ fontFamily: 'Caveat, cursive' }}>
                 R.X.Z 麵包坊 
              </span>
              <span className="text-lg text-primary/60">♡ 🐾</span>
            </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-foreground/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {/* LINE 加入好友按鈕 */}
            <a
              href="https://line.me/ti/p/@001naagg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
                alt="加入LINE好友"
                className="h-8"
              />
            </a>
          </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-primary/20 bg-background"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-medium transition-colors hover:text-primary ${
                        isActive ? 'text-primary' : 'text-foreground/80'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <a
                  href="https://line.me/ti/p/@001naagg"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img
                    src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
                    alt="加入LINE好友"
                    className="h-8"
                  />
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-16">{children}</main>

      <footer className="bg-secondary/30 border-t border-primary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
                R.X.Z Bakery
              </h3>
              <p className="text-sm text-muted-foreground">
                每一口，都是幸福的味道 ♡
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">快速連結</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">聯絡我們</h4>
              <p className="text-sm text-muted-foreground mb-1">營業時間：09:00 - 20:00</p>
              <p className="text-sm text-muted-foreground">預購專線：(06) 234-5678</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-primary/20 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 R.X.Z Bakery. All rights reserved. ★
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
