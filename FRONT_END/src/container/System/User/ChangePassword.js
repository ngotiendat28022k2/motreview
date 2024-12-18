import React from "react";
import { useEffect, useState } from "react";
import "./ChangePassword.scss";
import { handleChangePassword } from "../../../services/userService";
import { toast } from "react-toastify";
import { useParams } from "react-router";
const ChangePassword = () => {
  // id của người dùng.
  const { id } = useParams();
  // Hook từ React để tạo state inputValues lưu trữ các giá trị của các trường nhập liệu trong form (mật khẩu mới, xác nhận mật khẩu mới, mật khẩu cũ).
  const [inputValues, setInputValues] = useState({
    newpassword: "",
    confirmpassword: "",
    oldpassword: "",
  });
  //    Hàm xử lý sự kiện thay đổi trong các input. Khi người dùng nhập liệu vào một input, hàm này sẽ cập nhật state inputValues tương ứng với giá trị của input đó.
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };
  let handleSavePassword = async () => {
    // Kiểm tra người đã nhập dữ liệu(không để trống)
    if (
      !inputValues.newpassword ||
      !inputValues.confirmpassword ||
      !inputValues.oldpassword
    ) {
      toast.error("Không được để thông tin trống");
    } else if (inputValues.newpassword !== inputValues.confirmpassword) {
      toast.error("Mật khẩu nhập lại không trùng khớp !");
    } else {
      // Call API đổi mật khẩu
      let res = await handleChangePassword({
        id: id,
        password: inputValues.confirmpassword,
        oldpassword: inputValues.oldpassword,
      });
      // hiển thị thông báo thành công và reset các trường nhập liệu
      if (res && res.errCode === 0) {
        toast.success("Đổi mật khẩu thành công");
        setInputValues({
          ...inputValues,
          newpassword: "",
          confirmpassword: "",
          oldpassword: "",
        });
      } else {
        // Nếu yêu cầu thất bại, hiển thị thông báo lỗi với thông điệp từ server
        toast.error(res.errMessage);
      }
    }
  };
  return (
    <div className="container">
      <div className="container-fluid px-4">
        <h4 className="mt-4">Thay đổi thông tin tài khoản</h4>

        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1" />
            Đổi mật khẩu
          </div>
          <div className="card-body">
            <form>
              <div className="form-group col-6">
                <label htmlFor="exampleInputEmail1">Mật khẩu cũ</label>
                <input
                  type="password"
                  value={inputValues.oldpassword}
                  name="oldpassword"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="exampleInputEmail1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={inputValues.newpassword}
                  name="newpassword"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="exampleInputPassword1">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  value={inputValues.confirmpassword}
                  name="confirmpassword"
                  onChange={(event) => handleOnChange(event)}
                  className="form-control"
                  id="exampleInputPassword1"
                />
              </div>

              <button
                onClick={() => handleSavePassword()}
                type="button"
                className="btn btn-primary ml-3"
              >
                Lưu thông tin
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
