import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

function PopularItemBlog(props) {
  return (
    <Link to={`/blog-detail/${props.data.id}`}>
      <div className="media post_item">
        <img
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
          src={props.data.image}
          alt="post"
        />
        <div className="media-body">
          <h3>{props.data.title}</h3>
          <p>{moment(props.createdAt).format("DD/MM/YYYY HH:mm")}</p>
        </div>
      </div>
    </Link>
  );
}

export default PopularItemBlog;
