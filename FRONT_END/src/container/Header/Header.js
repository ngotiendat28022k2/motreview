import React from "react";
import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Header.scss";
import TopMenu from "./TopMenu";
require("dotenv").config();
const Header = (props) => {
  const [user, setUser] = useState({});
  let dataCart = useSelector((state) => state.shopcart.listCartItem);

  let scrollHeader = () => {
    window.addEventListener("scroll", function () {
      var header = document.querySelector(".main_menu");
      if (header) {
        header.classList.toggle("sticky", window.scrollY > 0);
      }
    });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
  }, []);

  scrollHeader();

  return (
    <header className="header_area">
      <TopMenu user={user && user} />
      <div className="main_menu">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light w-100">
            {/* Brand and toggle get grouped for better mobile display */}
            <NavLink to="/" className="navbar-brand logo_h">
              <img
                src="/resources/img/logo.png"
                style={{ maxWidth: "120px" }}
                alt=""
              />
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            {/* Collect the nav links, forms, and other content for toggling */}
            <div
              className="collapse navbar-collapse offset w-100"
              id="navbarSupportedContent"
            >
              <div className="row w-100 mr-0">
                <div className="col-lg-9 pr-0">
                  <ul className="nav navbar-nav center_nav pull-right">
                    <li className="nav-item">
                      <NavLink
                        exact
                        to="/"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#345457" }}
                      >
                        Trang chủ
                      </NavLink>
                    </li>
                    <li className="nav-item ">
                      <NavLink
                        to="/shop"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#345457" }}
                      >
                        Thư viện
                      </NavLink>
                    </li>
                    <li className="nav-item ">
                      <NavLink
                        to="/blog"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#345457" }}
                      >
                        Bài viết
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/voucher"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#345457" }}
                      >
                        Mã giảm giá
                      </NavLink>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-3 pr-0">
                  <ul className="nav navbar-nav navbar-right right_nav pull-right">
                    <li className="nav-item">
                      <Link to={"/shopcart"} className="icons">
                        <i className="ti-shopping-cart" />
                      </Link>
                      <span className="box-quantity-cart">
                        {dataCart && dataCart.length}
                      </span>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={`/user/detail/${user && user.id ? user.id : ""}`}
                        className="icons"
                      >
                        <i className="ti-user" aria-hidden="true" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
