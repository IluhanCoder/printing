import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/auth-context';

const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    authContext?.logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-gray-100 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-xl font-semibold">
          єСтудент
        </NavLink>
        <nav className="flex space-x-6">
          {authContext?.isAuthenticated && (
            authContext.userRole === "user" && <>
              <NavLink to="/blog-list">Наш блог</NavLink>
              <NavLink to="/profile">Профіль</NavLink>
              <NavLink to="/technologies">Наявні технології</NavLink>
              <NavLink to="/create-service">Створити послугу</NavLink>
              <NavLink to="/services-list">Послуги</NavLink>
              <NavLink to="/order-list">Ваші замовлення</NavLink>
              <NavLink to="/technologies">Наявні технології</NavLink>
              <NavLink to="/analytics">Аналітика замовлень</NavLink>
            </> || authContext.userRole === "admin" && <>
                <NavLink to="/blog-list">Блог</NavLink>
                <NavLink to="/create-blog">Створити статтю</NavLink>
                <NavLink
                  to="/create-data"
                  >Додати данні</NavLink>
            </>
          )}
        </nav>
        <div>
          {authContext?.isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Вийти
            </button>
          ) : (
            <><NavLink
              to="/login"
              className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Увійти
            </NavLink>
            <NavLink
            to="/registration"
            className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Зареєструватися
          </NavLink></>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
