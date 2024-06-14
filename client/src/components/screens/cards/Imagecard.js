function Imagecard(props) {
    const {image, key}= props
  return (
    <>
      <div className="col s12 m6 l4">
        <img
        key={key}
          src={image}
          alt="post-1"
          className="responsive-img"
        />
      </div>
    </>
  );
}
export default Imagecard;
