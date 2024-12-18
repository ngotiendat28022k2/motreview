import React, { useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import "./LoginWebPage.css";
import {
  handleLoginService,
  checkPhonenumberEmail,
  createNewUser,
} from "../../services/userService";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Register = () => {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "passwordsecrect",
    lastName: "",
    phonenumber: "",
    dataUser: {},
  });
  let history = useHistory();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleLogin = async () => {
    const element = document.querySelector("form");
    element.addEventListener("submit", (event) => {
      event.preventDefault();
    });
    let res = await handleLoginService({
      email: inputValues.email,
      password: inputValues.password,
    });

    if (res && res.errCode === 0) {
      localStorage.setItem("userData", JSON.stringify(res.user));
      localStorage.setItem("token", JSON.stringify(res.accessToken));
      if (res.user.roleId === "R1" || res.user.roleId === "R4") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleLoginSocial = async (email) => {
    const element = document.querySelector("form");
    element.addEventListener("submit", (event) => {
      event.preventDefault();
    });
    let res = await handleLoginService({
      email: email,
      password: inputValues.password,
    });

    if (res && res.errCode === 0) {
      localStorage.setItem("userData", JSON.stringify(res.user));
      localStorage.setItem("token", JSON.stringify(res.accessToken));
      if (res.user.roleId === "R1" || res.user.roleId === "R4") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleSaveUser = async () => {
    const element = document.querySelector("form");
    element.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    setInputValues({
      ...inputValues,
      dataUser: {
        email: inputValues.email,
        lastName: inputValues.lastName,
        phonenumber: inputValues.phonenumber,
        password: inputValues.password,
        roleId: "R2",
      },
    });

    let createUser = async () => {
      let res = await createNewUser({
        email: inputValues.dataUser.email,
        lastName: inputValues.dataUser.lastName,
        phonenumber: inputValues.dataUser.phonenumber,
        password: inputValues.dataUser.password,
        roleId: inputValues.dataUser.roleId,
      });
      if (res && res.errCode === 0) {
        toast.success("Tạo tài khoản thành công");
        handleLogin(inputValues.dataUser.email, inputValues.dataUser.password);
      } else {
        toast.error("Email hoặc số điện thoại tồn tại");
      }
    };
    createUser();
  };

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const LoginWithSocial = async (re) => {
    let res = await checkPhonenumberEmail({
      phonenumber: re.user.providerData[0].phoneNumber,
      email: re.user.providerData[0].email,
    });

    if (res.isCheck === true) {
      setInputValues({
        ...inputValues,
        email: re.user.providerData[0].email,
      });
      handleLoginSocial(re.user.providerData[0].email);
    } else {
      getBase64FromUrl(re.user.providerData[0].photoURL).then(async (value) => {
        let res = await createNewUser({
          email: re.user.providerData[0].email,
          lastName: re.user.providerData[0].displayName,
          phonenumber: re.user.providerData[0].phoneNumber,
          avatar: value,
          roleId: "R2",
          password: inputValues.password,
        });
        if (res && res.errCode === 0) {
          toast.success("Tạo tài khoản thành công");
          handleLoginSocial(re.user.providerData[0].email);
        } else {
          toast.error(res.errMessage);
        }
      });
    }
  };

  return (
    <>
      <div className="box-login">
        <div className="login-container">
          <section id="formHolder">
            <div className="row">
              <div className="col-sm-6 brand">
                <div className="heading">
                  <img
                    src="http://localhost:5000/resources/img/logo.png"
                    title="NIKI"
                    style={{ maxWidth: "200px", borderRadius: "10%" }}
                  />
                </div>
              </div>
              <div className="col-sm-6 form">
                <div
                  className="signup form-peice switched"
                  style={{ transform: "none" }}
                >
                  <form
                    className="signup-form"
                    style={{ width: "100%", left: "50%" }}
                  >
                    <div className="form-group">
                      <label htmlFor="name">Họ và tên</label>
                      <input
                        type="text"
                        name="lastName"
                        onChange={handleOnChange}
                        id="name"
                        className="name"
                      />
                      <span className="error" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Địa chỉ email</label>
                      <input
                        type="email"
                        name="email"
                        onChange={handleOnChange}
                        id="email"
                        className="email"
                      />
                      <span className="error" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        name="phonenumber"
                        onChange={handleOnChange}
                        id="phone"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Mật khẩu</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleOnChange}
                        id="password"
                        className="pass"
                      />
                      <span className="error" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="passwordCon">Xác nhận mật khẩu</label>
                      <input
                        type="password"
                        name="passwordCon"
                        id="passwordCon"
                        className="passConfirm"
                      />
                      <span className="error" />
                    </div>
                    <div className="CTA">
                      <input
                        onClick={handleSaveUser}
                        type="submit"
                        value="Lưu"
                        id="submit"
                      />
                      <Link
                        to="/login"
                        style={{
                          cursor: "pointer",
                          fontSize: 13,
                          textDecoration: "unactive",
                          color: "gray",
                        }}
                      >
                        Tôi có tài khoản? đăng nhập
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Register;
