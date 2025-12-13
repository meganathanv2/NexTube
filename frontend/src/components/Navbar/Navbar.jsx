import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-20 bg-gray-900/90 backdrop-blur border-b border-gray-800">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="font-bold text-lg text-red-400">
          NextTube
        </Link>

        <form onSubmit={onSubmit} className="flex-1 max-w-xl">
          <div className="flex rounded-lg border border-gray-700 bg-gray-800">
            <input
              className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
              placeholder="Search videos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="px-3 text-sm font-medium text-gray-200 hover:text-white"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/upload"
                className="rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-400"
              >
                Upload
              </Link>
              <Link to="/profile" className="text-sm text-gray-200 hover:text-white">
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="rounded border border-gray-700 px-3 py-1 text-sm hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:text-white">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

