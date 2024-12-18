import React from "react";
import HeaderContent from "../Content/HeaderContent";
import HomeBlogItem from "./HomeBlogItem";

function HomeBlog(props) {
  return (
    <section className="blog-area section-gap">
      <div className="container">
        <HeaderContent
          mainContent="Tin tức mới"
          infoContent="Những tin tức mới nhất"
        ></HeaderContent>
        <div className="row">
          {props.data &&
            props.data.length > 0 &&
            props.data.map((item, index) => {
              return <HomeBlogItem key={index} data={item} />;
            })}
        </div>
      </div>
    </section>
  );
}

export default HomeBlog;
