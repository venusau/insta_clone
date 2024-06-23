import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";

function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changeName(e) {
    setName(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }
  
  function changeUsername(e) {
    setUsername(e.target.value);
  }

  const changeProfileImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type");
      return;
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large");
      return;
    }

    setProfilePic(file);
    setFileName(file.name); // Set the file name
  };

  const password_validate = (password) => {
    const re = {
      capital: /[A-Z]/,
      digit: /[0-9]/,
      full: /^[A-Za-z0-9@#]{8,14}$/,
    };
    return (
      re.capital.test(password) &&
      re.digit.test(password) &&
      re.full.test(password)
    );
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", profilePic);
    formData.append("upload_preset", "insta-clone"); // Replace with your preset name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dgrze5guo/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during file upload");
      return null;
    }
  };

  const postData = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!password_validate(password)) {
      return alert(
        "Password should be strong: at least one uppercase letter, one digit, and a length of 8-14 characters."
      );
    }

    const imageUrl = await handleImageUpload();
    if (!imageUrl) return;

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        password,
        email,
        profilePicUrl: imageUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while signing up");
      });
  };

  return (
    <>
      <div className="container" style={{ marginTop: "50px" }}>
      <div className="card auth-card black">
        <div className="card-content white-text">
          <span className="card-title">Signup</span>
          <form onSubmit={postData}>
            <div className="input-field">
              <input
                type="text"
                id="name"
                value={name}
                onChange={changeName}
                required
                className="white-text"
                style={{ borderBottom: "1px solid white" }}
              />
              <label htmlFor="name" className="white-text">Name</label>
            </div>
            <div className="input-field">
              <input
                type="text"
                id="username"
                value={username}
                onChange={changeUsername}
                required
                className="white-text"
                style={{ borderBottom: "1px solid white" }}
              />
              <label htmlFor="username" className="white-text">Username</label>
            </div>
            <div className="input-field">
              <input
                type="email"
                id="email"
                value={email}
                onChange={changeEmail}
                required
                className="white-text"
                style={{ borderBottom: "1px solid white" }}
              />
              <label htmlFor="email" className="white-text">Email</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                id="password"
                value={password}
                onChange={changePassword}
                required
                className="white-text"
                style={{ borderBottom: "1px solid white" }}
              />
              <label htmlFor="password" className="white-text">Password</label>
            </div>
            <div className="file-field input-field">
              <div className="btn waves-effect waves-light" style={{ backgroundColor: "#e91e63" }}>
                <span>Profile Image</span>
                <input type="file" onChange={changeProfileImage} />
              </div>
              <div className="file-path-wrapper">
                <input
                  className="file-path validate"
                  type="text"
                  value={fileName}
                  readOnly
                  style={{ color: "white" }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn waves-effect waves-light"
              style={{ backgroundColor: "#e91e63" }}
            >
              Signup
            </button>
          </form>
          <h5>
            <NavLink to="/signin" className="white-text">Already have an account?</NavLink>
          </h5>
        </div>
      </div>
    </div>
    </>
  );
}

export default Signup;
