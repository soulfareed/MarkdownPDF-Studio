import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiPlus, FiHome } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-600">
          MarkDownPDF Studio
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              <FiHome className="mr-2" />
              Documents
            </Link>
            <Link
              to="/documents/new"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              <FiPlus className="mr-2" />
            </Link>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-grey-700 hover:tex-blue-600"
            >
              <FiLogOut className="mr-2" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
