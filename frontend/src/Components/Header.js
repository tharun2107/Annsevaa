import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileCardModal from "./ProfileCard";
import "./styles/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false after checking user
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

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
                <li>
                  <Link to="/admin">Admin Panel</Link>
                </li>
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
                <button className="profile-button" onClick={openProfileModal}>
                  Profile
                </button>
              </li>
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
      <ProfileCardModal isOpen={isProfileModalOpen} closeModal={closeProfileModal} />
    </header>
  );
};

export default Header;
