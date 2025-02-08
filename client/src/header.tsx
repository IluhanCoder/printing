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
            <>
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-gray-300 pb-1 font-medium text-gray-50'
                    : 'hover:text-gray-200'
                }
              >
                Тестова сторінка
              </NavLink>
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
            <NavLink
              to="/login"
              className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Увійти
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
