import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
  localStorage.removeItem("isLoggedIn");
  navigate("/login");
  window.location.reload();
};

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        <Link className="navbar-brand" to="/">
          🏥 Hospital Management System
        </Link>

        <div className="navbar-nav ms-auto">

          <Link className="nav-link" to="/">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>

          <Link className="nav-link" to="/patients">
            <i className="bi bi-people-fill me-2"></i>
            Patients
          </Link>

          <Link className="nav-link" to="/doctors">
            <i className="bi bi-person-badge-fill me-2"></i>
            Doctors
          </Link>

          <Link className="nav-link" to="/appointments">
            <i className="bi bi-calendar-check-fill me-2"></i>
            Appointments
          </Link>

          <button
            className="btn btn-danger btn-sm ms-3"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;