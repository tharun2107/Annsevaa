import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from './context/AuthProvider';
import "./styles/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    // setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">Anadh Seva</div>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
      <nav>
        <ul className={menuOpen ? "show" : ""}>
          {user ? (
            <>
              {user.isAdmin ? (
                <>
                  <li>
                    <Link to="/admin">Admin Panel</Link>
                  </li>
                  {/* <li>
                    <Link to="/user-requests">User Requests</Link>
                  </li> */}
                </>
              ) : (
                <>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  {location.pathname === "/" ? (
                    <li>
                      <a href="#foundation">About</a>
                    </li>
                  ) : (
                    <li>
                      <Link to="/aboutus">About</Link>
                    </li>
                  )}
                  <li>
                    <Link to="/contactus">Contact</Link>
                  </li>
                  <li>
                    <Link to="/request">Receive</Link>
                  </li>
                  <li>
                    <Link to="/donate">Donate</Link>
                  </li>
                  <li>
                    <Link to="/volunteer">Volunteer</Link>
                  </li>
                  <li>
                    <Link to="/log">Logs</Link>
                  </li>
                </>
              )}
              <li>
                <button className="logout-button" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              {location.pathname === "/" ? (
                <li>
                  <a href="#foundation">About</a>
                </li>
              ) : (
                <li>
                  <Link to="/aboutus">About</Link>
                </li>
              )}
              <li>
                <Link to="/contactus">Contact</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;