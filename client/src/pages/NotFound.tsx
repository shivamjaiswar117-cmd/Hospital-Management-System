import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="container text-center"
      style={{ marginTop: "100px" }}
    >
      <h1
        className="display-1 text-danger"
        style={{ fontWeight: "bold" }}
      >
        404
      </h1>

      <h3>Page Not Found</h3>

      <p>
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="btn btn-primary mt-3"
      >
        Go Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;