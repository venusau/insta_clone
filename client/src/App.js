import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { UserContext } from "./context";
import Navbar from "./components/Navabar";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import SignIn from "./components/screens/SignIn";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import ForgotPassword from "./components/screens/ForgotPassword";
import { useContext } from "react";
import "./App.css";
import { type } from "@testing-library/user-event/dist/type";

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      navigate("/");
    } else {
      navigate("/signin");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path= "/forget-password" element={<ForgotPassword/>}/>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routing />
    </Router>
  );
}

export default App;
