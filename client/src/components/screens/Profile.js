import React, { useEffect, useState } from "react";
import Imagecard from "./cards/Imagecard"; // Ensure the correct path to Imagecard
import "./css/profile.css";
import ImagecardHome from "./cards/ImagecardHome";

function Profile() {
  const [followBtnClass, setFollowBtnClass] = useState("default-button");
  const [messageButton, setMessageButton] = useState("default-button");
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"))
  console.log(user)
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Assuming JWT token is stored in localStorage
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.mypost);
        console.log(data.mypost);
      })
      .catch((error) => {
        console.error("There was an error fetching the posts!", error);
      });
  }, []);

  const onHoverFollow = () => {
    setFollowBtnClass("btn-white");
  };

  const onLeaveFollow = () => {
    setFollowBtnClass("default-button");
  };

  const onHoverMessage = () => {
    setMessageButton("btn-white");
  };

  const onLeaveMessage = () => {
    setMessageButton("default-button");
  };
  const fetchImageCardHome = ()=>{
    return <ImagecardHome/>
  }

  return (
    <>
      <div className="profile-body">
        <div className="container profile-page">
          <div style={{ borderBottom: "1px solid grey" }} className="row">
            <div className="col s12 m4 l3 center-align">
              <img
                src={user.profilePicUrl}
                alt="profile-pic"
                style={{ height: "160px", width: "160px", borderRadius: "80px" }}
                className="circle responsive-img profile-pic"
              />
            </div>
            <div className="col s12 m8 l9">
              <div className="profile-header">
                <h5 className="profile-username">{user.username}</h5>
                <button
                  className={followBtnClass}
                  onMouseEnter={onHoverFollow}
                  onMouseLeave={onLeaveFollow}
                >
                  Follow
                </button>
                <button
                  className={messageButton}
                  onMouseEnter={onHoverMessage}
                  onMouseLeave={onLeaveMessage}
                >
                  Message
                </button>
              </div>
              <div className="profile-stats">
                <ul>
                  <li>
                    <strong>100</strong> posts
                  </li>
                  <li>
                    <strong>200</strong> followers
                  </li>
                  <li>
                    <strong>180</strong> following
                  </li>
                </ul>
              </div>
              <div className="profile-bio">
                <h6>{user.name}</h6>
                <p>
                  This is the bio section where the user can add information about
                  themselves.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <div className="profile-gallery">
                <div className="row">
                  {posts.map((post) => (
                    <Imagecard key={post._id} image={post.imageUrl} onClick={fetchImageCardHome} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
