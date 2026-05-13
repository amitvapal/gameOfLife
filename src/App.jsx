import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Today', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/goals', label: 'Goals' },
  { to: '/fitness', label: 'Fitness' },
];

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="app-title">game of life.</h1>
        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' nav-link--active' : '')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
