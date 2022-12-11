import { Outlet, Link } from "react-router-dom";


function outerSidebar() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/build">build</Link>
          </li>
          <li>
            <Link to="/deployment">deploy</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}

export default outerSidebar;