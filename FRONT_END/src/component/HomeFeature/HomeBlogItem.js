import React from "react";
import { Link } from "react-router-dom";
import "./HomeBlogItem.scss";
import CommonUtils from "../../utils/CommonUtils";
function HomeBlogItem(props) {
  const { data } = props;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}`;
  };
  return (
    <div className="container-blog hover-blog">
      <Link className="d-block" to={`/blog-detail/${props.data.id}`}>
        <div className="box-blog">
          <div className="box-blog-image">
            <img src={data.image} />
          </div>
          <div className="blog-author">
            <p className="desc-blog">Cập nhật: {formatDate(data.updatedAt)}</p>
            <span className="user-blog">
              {" "}
              <i style={{ fontSize: 15 }} class="far fa-user icon"></i>{" "}
              {data?.userData &&
                data?.userData?.firstName + " " + data?.userData?.lastName}
            </span>
          </div>
          <div className="box-blog-content">
            <h3 className="title-blog">
              {CommonUtils.limitStringLength(data.title, 56)}
            </h3>
            <div className="blog-compact">
              {CommonUtils.limitStringLength(data.shortdescription)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HomeBlogItem;
