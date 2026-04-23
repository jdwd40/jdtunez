import { Outlet, NavLink } from 'react-router-dom';
import Player from './Player';
import useTheme from '../hooks/useTheme';

export default function Layout() {
  const { dark, toggle } = useTheme();

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-inner">
          <NavLink to="/" className="brand">
            <div className="brand-logo">JD</div>
            <span className="brand-name">JDTunez</span>
          </NavLink>
          <nav>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/bands">Bands</NavLink>
            <button
              className="theme-toggle"
              onClick={toggle}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? '\u2600' : '\u263E'}
            </button>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <Player />
    </div>
  );
}
