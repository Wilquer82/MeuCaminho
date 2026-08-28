import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/streak', label: 'Ofensiva', icon: '🔥' },
  { to: '/categories', label: 'Categorias', icon: '📚' },
  { to: '/bible', label: 'Bíblia', icon: '📖' },
  { to: '/community', label: 'Comunidade', icon: '👥' },
  { to: '/profile', label: 'Perfil', icon: '👤' }
];

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'var(--card)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '6px 0 20px',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,.04)'
    }}>
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '4px 0',
            color: isActive ? 'var(--accent)' : 'var(--muted)',
            fontSize: 10,
            fontWeight: isActive ? 700 : 600,
            textDecoration: 'none',
            transition: 'all .2s ease'
          })}
        >
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
