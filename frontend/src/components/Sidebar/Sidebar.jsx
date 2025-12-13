import { NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  `block rounded px-3 py-2 text-sm ${
    isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800/70"
  }`;

const Sidebar = () => {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-800 bg-gray-900/80 p-3 md:block">
      <nav className="space-y-1">
        <NavLink to="/" className={navClass} end>
          Home
        </NavLink>
        <NavLink to="/upload" className={navClass}>
          Upload
        </NavLink>
        <NavLink to="/channel/create" className={navClass}>
          Create Channel
        </NavLink>
        <NavLink to="/profile" className={navClass}>
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

