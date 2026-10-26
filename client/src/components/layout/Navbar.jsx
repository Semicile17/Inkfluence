import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  PenLine,
  Search,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../ui/Avatar.jsx';
import Logo from '../ui/Logo.jsx';
import { buttonStyles } from '../ui/Button.jsx';
import { openMuse } from '../../lib/utils.js';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3.5 py-2 text-sm font-medium transition ${
    isActive ? 'bg-ink/[0.06] text-ink' : 'text-ink/60 hover:bg-ink/[0.04] hover:text-ink'
  }`;

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.07] bg-cream/85 backdrop-blur-xl">
      <div className="container-ink flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <NavLink to="/explore" className={navLinkClass}>
            Explore
          </NavLink>
          <button
            type="button"
            onClick={() => openMuse()}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-ink/60 transition hover:bg-ink/[0.04] hover:text-ink"
          >
            <Sparkles className="h-3.5 w-3.5 text-ink/70" />
            Muse
            <span className="rounded-full bg-lime-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink">
              AI
            </span>
          </button>
          <Link
            to="/#write-with-us"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/60 transition hover:bg-ink/[0.04] hover:text-ink"
          >
            For writers
          </Link>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/explore"
            aria-label="Search stories"
            className="hidden h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink/60 transition hover:border-ink/30 hover:text-ink sm:grid"
          >
            <Search className="h-4 w-4" />
          </Link>

          {loading ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-ink/[0.06]" />
          ) : isAuthenticated ? (
            <>
              <Link to="/write" className={buttonStyles('dark', 'sm', 'hidden sm:inline-flex')}>
                <PenLine className="h-3.5 w-3.5" />
                Write
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white p-1 pr-2 transition hover:border-ink/30"
                >
                  <Avatar user={user} size="sm" ring={false} />
                  <ChevronDown className="h-3.5 w-3.5 text-ink/40" />
                  <span className="sr-only">Open account menu</span>
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-lift animate-pop-in"
                  >
                    <div className="border-b border-ink/[0.07] px-3 py-2.5">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-ink/45">@{user.username}</p>
                    </div>
                    <Link
                      to={`/writers/${user.username}`}
                      role="menuitem"
                      className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink/70 transition hover:bg-paper hover:text-ink"
                    >
                      <UserRound className="h-4 w-4" /> Your profile
                    </Link>
                    <Link
                      to="/dashboard"
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink/70 transition hover:bg-paper hover:text-ink"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      to="/bookmarks"
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink/70 transition hover:bg-paper hover:text-ink"
                    >
                      <Bookmark className="h-4 w-4" /> Reading list
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-xl border-t border-ink/[0.07] px-3 py-2.5 text-sm text-ink/60 transition hover:bg-paper hover:text-ink"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink/60 transition hover:bg-ink/[0.04] hover:text-ink sm:block"
              >
                Sign in
              </Link>
              <Link to="/register" className={buttonStyles('dark', 'sm')}>
                Join Inkfluence
              </Link>
            </>
          )}

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-[72px] z-40 h-[calc(100dvh-72px)] overflow-y-auto border-t border-ink/10 bg-cream px-5 pb-10 pt-5 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <Link
              to="/explore"
              className="rounded-2xl px-4 py-3 font-display text-lg font-medium hover:bg-white"
            >
              Explore stories
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openMuse();
              }}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-left font-display text-lg font-medium hover:bg-white"
            >
              Ask Muse <span className="rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold">AI</span>
            </button>
            <Link
              to="/#write-with-us"
              className="rounded-2xl px-4 py-3 font-display text-lg font-medium hover:bg-white"
            >
              For writers
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-2xl px-4 py-3 font-display text-lg font-medium hover:bg-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/bookmarks"
                  className="rounded-2xl px-4 py-3 font-display text-lg font-medium hover:bg-white"
                >
                  Reading list
                </Link>
                <Link
                  to={`/writers/${user.username}`}
                  className="rounded-2xl px-4 py-3 font-display text-lg font-medium hover:bg-white"
                >
                  Your profile
                </Link>
              </>
            )}
          </nav>

          <div className="mt-6 flex flex-col gap-2 border-t border-ink/10 pt-6">
            {isAuthenticated ? (
              <>
                <Link to="/write" className={buttonStyles('dark', 'lg')}>
                  <PenLine className="h-4 w-4" /> Write a story
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={buttonStyles('outline', 'lg')}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className={buttonStyles('lime', 'lg')}>
                  Join Inkfluence
                </Link>
                <Link to="/login" className={buttonStyles('outline', 'lg')}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
