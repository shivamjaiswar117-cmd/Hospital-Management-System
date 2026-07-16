import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <BrowserRouter>

  {isLoggedIn && <Navbar />}

  <Routes>
    <Route
      path="/login"
      element={isLoggedIn ? <Navigate to="/" /> : <Login />}
    />

    <Route
      path="/"
      element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
    />

    <Route
      path="/patients"
      element={isLoggedIn ? <Patients /> : <Navigate to="/login" />}
    />

    <Route
      path="/doctors"
      element={isLoggedIn ? <Doctors /> : <Navigate to="/login" />}
    />

    <Route
      path="/appointments"
      element={isLoggedIn ? <Appointments /> : <Navigate to="/login" />}
    />
    <Route path="*" element={<NotFound />} />
  </Routes>

  {/* Footer should be here */}
  {isLoggedIn && <Footer />}

</BrowserRouter>
  );
}

export default App;