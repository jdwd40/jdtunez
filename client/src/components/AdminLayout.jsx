import { Outlet, NavLink, Link } from 'react-router-dom';
import useTheme from '../hooks/useTheme';

export default function AdminLayout() {
  const { dark, toggle } = useTheme();

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/admin" className="brand">
            <div className="brand-logo">JD</div>
            <span className="brand-name">JDTunez Admin</span>
          </Link>
          <nav>
            <Link to="/">View Site</Link>
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
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h3>Manage</h3>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/bands">Bands</NavLink>
          <NavLink to="/admin/albums">Albums</NavLink>
          <NavLink to="/admin/tracks">Tracks</NavLink>
        </aside>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
