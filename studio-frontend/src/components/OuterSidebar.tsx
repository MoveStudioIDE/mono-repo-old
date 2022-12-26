import { Outlet, Link } from "react-router-dom";
import homeIcon94 from "../icons/home-94.png";
import fileIcon94 from "../icons/folder-94.png";
import workstationIcon from "../icons/workstation-94.png";
import chainlinkIcon from "../icons/link-94.png";


function outerSidebar() {

  return (
    <div>
      <nav>
          <div
            style={{display: "flex", flexDirection: "column", justifyContent: "center", gap: "40px"}}
          >
            <Link to="/"><img src={homeIcon94} width={"50px"}></img></Link>
            <Link to="/build"><img src={fileIcon94} width={"50px"}></img></Link>
            <Link to="/deployment"><img src={chainlinkIcon} width={"50px"}></img></Link>
          </div>
      </nav>

      <Outlet />
    </div>
  );
}

export default outerSidebar;