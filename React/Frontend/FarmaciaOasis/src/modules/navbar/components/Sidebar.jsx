import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Componente Sidebar para navegación móvil
 * Versión simplificada con emojis como íconos
 */
function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Items del menú de navegación con emojis como íconos
   */
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/inventario', label: 'Inventario', icon: '📦' },
    { path: '/historial-ventas', label: 'Historial Ventas', icon: '📊' },
    { path: '/ingresos-egresos', label: 'Ingresos y egresos', icon: '📋' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/proveedores', label: 'Proveedores y Mercancia', icon: '🚚' }
  ];

  /**
   * Maneja la navegación y cierra el sidebar
   */
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  /**
   * Verifica si una ruta está activa
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar" onClick={(e) => e.stopPropagation()}>
      {/* Botón para cerrar el sidebar */}
      <button className="cerrar-btn" onClick={onClose}>
        &times;
      </button>
      
      {/* Lista de items del menú */}
      <div className="menu-items">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(item.path);
            }}
          >
            {/* Ícono emoji y etiqueta del menú */}
            <span className="menu-icon">{item.icon}</span>
            <i>{item.label}</i>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;