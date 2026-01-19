import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

function Layout() {
  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h4>Öğrenci Not Sistemi</h4>
        </div>
        <nav className="sidebar-nav">
          <NavLink 
            to="/students" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <i className="bi bi-people-fill"></i>
            <span>Öğrenci İşlemleri</span>
          </NavLink>
          <NavLink 
            to="/lessons" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <i className="bi bi-book-fill"></i>
            <span>Ders İşlemleri</span>
          </NavLink>
          <NavLink 
            to="/grading" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <i className="bi bi-clipboard-check-fill"></i>
            <span>Notlandırma</span>
          </NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;



