const GalleryPRoduct = ({ data }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {data.map((item, index) => (
        <div key={index} style={{ maxWidth: "500px" }}>
          <img src={item.image} alt="" style={{ width: "100%" }} />
        </div>
      ))}
    </div>
  );
};

export default GalleryPRoduct;
