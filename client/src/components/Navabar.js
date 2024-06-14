import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import { useContext } from "react";
import userEvent from "@testing-library/user-event";
function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate()
  const renderList = () => {
    if (state) {
      return [
        <>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/create">Create Post</NavLink>
          </li>
          <li>
          <button
              className="btn red"
              onClick={()=>{
                localStorage.clear()
                dispatch({type:"CLEAR"})
                navigate("/signin")
              }}
            >
              Logout
            </button>
          </li>
        </>,
      ];
    } else {
      return [
        <>
          <li>
            <NavLink to="/signin">SignIn</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Signup</NavLink>
          </li>
        </>,
      ];
    }
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper black">
          <NavLink to={state?"/":"/signin"} className="brand-logo left">
            Instagram
          </NavLink>
          <ul id="nav-mobile" className="right">
          {renderList()}
          </ul>
          
        </div>
      </nav>
    </>
  );
}

export default Navbar;
