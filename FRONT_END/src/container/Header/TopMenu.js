import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import "./Header.scss";
const TopMenu = (props) => {
  let history = useHistory();

  let handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  let name =
    props.user && props.user.id
      ? `${props.user && props.user.firstName ? props.user.firstName : ""} ${
          props.user.lastName
        }`
      : "";
  return (
    <div className="top_menu">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="float-left"></div>
          </div>
          <div className="col-lg-5">
            <div className="float-right">
              <ul className="right_side">
                <li>
                  {props.user && props.user.id ? (
                    <NavLink exact to={`/user/detail/${props.user.id}`}>
                      {name}
                    </NavLink>
                  ) : (
                    <Link to="/login">Đăng nhập</Link>
                  )}
                </li>
                <li style={{ cursor: "pointer" }}>
                  {props.user && props.user.id ? (
                    <a onClick={() => handleLogout()}>Đăng xuất</a>
                  ) : (
                    <Link to="/register">Đăng ký</Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
