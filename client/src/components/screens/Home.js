import React, { useEffect } from "react";
import { useState } from "react";
import "./css/home.css"; // Adjust the path according to your project's structure
import ImagecardHome from "./cards/ImagecardHome";

const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.posts);
        setData(data.posts);
      })
      .catch(err=>{
        console.log(err)
        alert(err);
      });
  }, []);

  return (
    <>
      <div className="home-page">
        {data.map((item) => {
          const PostedBy =item.postedBy;
          return <ImagecardHome likes= {item.likes} comments={item.comments} profilePicURL ={PostedBy.profilePicUrl? PostedBy.profilePicUrl : null} username={PostedBy.username} id = {item._id} title = {item.title} body={item.body} imageUrl = {item.imageUrl}/>;
        })}
      </div>
    </>
  );
};

export default Home;
