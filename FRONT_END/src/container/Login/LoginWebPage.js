import React, { useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import "./LoginWebPage.css";
import {
  handleLoginService,
  checkPhonenumberEmail,
  createNewUser,
} from "../../services/userService";
import { GoogleLoginButton } from "react-social-login-buttons";
import { authentication } from "../../utils/firebase";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
const LoginWebPage = () => {
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
        history.push("/admin");
      } else {
        history.push("/");
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
  let signInwithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then(async (re) => {
        LoginWithSocial(re);
      })
      .catch((err) => {
        console.log(err.message);
      });
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
                    title=""
                    style={{ maxWidth: "200px", borderRadius: "10%" }}
                  />
                </div>
              </div>
              <div className="col-sm-6 form">
                <div
                  className="login form-peice "
                  style={{ transform: "none" }}
                >
                  <form
                    className="login-form"
                    style={{ width: "70%", left: "none" }}
                  >
                    <div className="form-group">
                      <label htmlFor="loginemail">Địa chỉ email</label>
                      <input
                        name="email"
                        onChange={handleOnChange}
                        type="email"
                        id="loginemail"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="loginPassword">Mật khẩu</label>
                      <input
                        name="password"
                        onChange={handleOnChange}
                        type="password"
                        id="loginPassword"
                        required
                      />
                    </div>
                    <div className="CTA">
                      <input
                        onClick={handleLogin}
                        type="submit"
                        value="Đăng nhập"
                      />
                      <GoogleLoginButton
                        text="Đăng nhập với Google"
                        iconSize="25px"
                        style={{
                          width: "300px",
                          height: "40px",
                          fontSize: "16px",
                          marginTop: 20,
                          marginBottom: 10,
                        }}
                        onClick={() => signInwithGoogle()}
                      />
                      <Link
                        to="/register"
                        style={{
                          cursor: "pointer",
                          fontSize: 13,
                          textDecoration: "unactive",
                          color: "gray",
                        }}
                      >
                        Tài khoản mới
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

export default LoginWebPage;
