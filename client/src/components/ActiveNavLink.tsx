import { NavLink as RouterNavLink } from "react-router-dom";
interface NavLinkProps {
  to: string;
  label: string;
}

   export const NavLink = ({ to, label }: NavLinkProps) => (
      <RouterNavLink
        to={to}
        className={({ isActive }) =>
          `text-sm font-medium transition-colors ${
            isActive ? "text-green-600" : "text-black hover:text-gray-600"
          }`
        }
      >
        {label}
      </RouterNavLink>
    );


