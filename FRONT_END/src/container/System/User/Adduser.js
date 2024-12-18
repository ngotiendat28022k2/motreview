import React, { useEffect, useState } from "react";
import {
  createNewUser,
  getDetailUserById,
  UpdateUserService,
} from "../../../services/userService";
import DatePicker from "../../../component/input/DatePicker";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useFetchAllcode } from "../../customize/fetch";
import localization from "moment/locale/vi";
import moment from "moment";

const Adduser = (props) => {
  const [birthday, setBirthday] = useState("");
  const [isActionADD, setIsActionADD] = useState(true);
  const [isChangeDate, setIsChangeDate] = useState(false);
  const { id } = useParams();

  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    phonenumber: "",
    genderId: "",
    roleId: "",
    id: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});

  const setStateUser = (data) => {
    setInputValues({
      ...inputValues,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phonenumber: data.phonenumber,
      genderId: data.genderId,
      roleId: data.roleId,
      email: data.email,
      id: data.id,
      dob: data.dob,
    });
    setBirthday(
      moment
        .unix(+data.dob / 1000)
        .locale("vi")
        .format("DD/MM/YYYY")
    );
  };

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setIsActionADD(false);
        let user = await getDetailUserById(id);
        if (user && user.errCode === 0) {
          setStateUser(user.data);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const { data: dataGender } = useFetchAllcode("GENDER");
  const { data: dataRole } = useFetchAllcode("ROLE");

  useEffect(() => {
    if (
      dataGender &&
      dataGender.length > 0 &&
      inputValues.genderId === "" &&
      dataRole &&
      dataRole.length > 0 &&
      inputValues.roleId === ""
    ) {
      setInputValues({
        ...inputValues,
        genderId: dataGender[0].code,
        roleId: dataRole[0].code,
      });
    }
  }, [dataGender, dataRole, inputValues]);

  const handleOnChangeDatePicker = (date) => {
    setBirthday(date[0]);
    setIsChangeDate(true);
    setErrors({ ...errors, dob: "" });
  };

  const validateInput = () => {
    const newErrors = {};
    const requiredFields = [
      "email",
      "firstName",
      "lastName",
      "address",
      "phonenumber",
      "genderId",
      "roleId",
    ];

    requiredFields.forEach((field) => {
      if (!inputValues[field]) {
        newErrors[field] = `Vui lòng điền ${field}`;
      }
    });

    if (isActionADD && !inputValues.password) {
      newErrors.password = "Vui lòng điền mật khẩu";
    }

    if (!birthday) {
      newErrors.dob = "Vui lòng chọn ngày sinh";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveUser = async () => {
    if (!validateInput()) return;

    if (isActionADD) {
      let res = await createNewUser({
        email: inputValues.email,
        password: inputValues.password,
        firstName: inputValues.firstName,
        lastName: inputValues.lastName,
        address: inputValues.address,
        roleId: inputValues.roleId,
        genderId: inputValues.genderId,
        phonenumber: inputValues.phonenumber,
        dob: new Date(birthday).getTime(),
      });
      if (res && res.errCode === 0) {
        toast.success("Thêm mới người dùng thành công");
        setInputValues({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          address: "",
          phonenumber: "",
          genderId: "",
          roleId: "",
          dob: "",
        });
        setBirthday("");
      } else {
        toast.error(res.errMessage);
      }
    } else {
      let res = await UpdateUserService({
        id: inputValues.id,
        firstName: inputValues.firstName,
        lastName: inputValues.lastName,
        address: inputValues.address,
        roleId: inputValues.roleId,
        genderId: inputValues.genderId,
        phonenumber: inputValues.phonenumber,
        dob: isChangeDate ? new Date(birthday).getTime() : inputValues.dob,
      });
      if (res && res.errCode === 0) {
        toast.success("Cập nhật người dùng thành công");
      } else {
        toast.error(res.errMessage);
      }
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý người dùng</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          {isActionADD
            ? "Thêm mới người dùng"
            : "Cập nhật thông tin người dùng"}
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Email</label>
                <input
                  type="email"
                  value={inputValues.email}
                  disabled={!isActionADD}
                  name="email"
                  onChange={handleOnChange}
                  className={`form-control ${errors.email ? "error" : ""}`}
                  id="inputEmail4"
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Password</label>
                <input
                  type="password"
                  disabled={!isActionADD}
                  name="password"
                  onChange={handleOnChange}
                  className={`form-control ${errors.password ? "error" : ""}`}
                  id="inputPassword4"
                />
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-4">
                <label htmlFor="inputFirstName">Họ</label>
                <input
                  type="text"
                  value={inputValues.firstName}
                  name="firstName"
                  onChange={handleOnChange}
                  className={`form-control ${errors.firstName ? "error" : ""}`}
                  id="inputFirstName"
                />
                {errors.firstName && (
                  <small className="text-danger">{errors.firstName}</small>
                )}
              </div>
              <div className="form-group col-4">
                <label htmlFor="inputLastName">Tên</label>
                <input
                  type="text"
                  value={inputValues.lastName}
                  name="lastName"
                  onChange={handleOnChange}
                  className={`form-control ${errors.lastName ? "error" : ""}`}
                  id="inputLastName"
                />
                {errors.lastName && (
                  <small className="text-danger">{errors.lastName}</small>
                )}
              </div>
              <div className="form-group col-4">
                <label htmlFor="inputPhonenumber">Số điện thoại</label>
                <input
                  type="text"
                  value={inputValues.phonenumber}
                  name="phonenumber"
                  onChange={handleOnChange}
                  className={`form-control ${
                    errors.phonenumber ? "error" : ""
                  }`}
                  id="inputPhonenumber"
                />
                {errors.phonenumber && (
                  <small className="text-danger">{errors.phonenumber}</small>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputAddress">Địa chỉ</label>
                <input
                  type="text"
                  value={inputValues.address}
                  name="address"
                  onChange={handleOnChange}
                  className={`form-control ${errors.address ? "error" : ""}`}
                  id="inputAddress"
                />
                {errors.address && (
                  <small className="text-danger">{errors.address}</small>
                )}
              </div>
              <div className="form-group col-md-6">
                <label>Ngày sinh</label>
                <DatePicker
                  value={birthday}
                  onChange={handleOnChangeDatePicker}
                  format="DD/MM/YYYY"
                  locale={localization}
                  className={`form-control ${errors.dob ? "error" : ""}`}
                />
                {errors.dob && (
                  <small className="text-danger">{errors.dob}</small>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Giới tính</label>
                <select
                  name="genderId"
                  value={inputValues.genderId}
                  onChange={handleOnChange}
                  className={`form-control ${errors.genderId ? "error" : ""}`}
                >
                  {dataGender &&
                    dataGender.length > 0 &&
                    dataGender.map((item) => (
                      <option key={item.id} value={item.code}>
                        {item.value}
                      </option>
                    ))}
                </select>
                {errors.genderId && (
                  <small className="text-danger">{errors.genderId}</small>
                )}
              </div>
              <div className="form-group col-md-6">
                <label>Vai trò</label>
                <select
                  name="roleId"
                  value={inputValues.roleId}
                  onChange={handleOnChange}
                  className={`form-control ${errors.roleId ? "error" : ""}`}
                >
                  {dataRole &&
                    dataRole.length > 0 &&
                    dataRole.map((item) => (
                      <option key={item.id} value={item.code}>
                        {item.value}
                      </option>
                    ))}
                </select>
                {errors.roleId && (
                  <small className="text-danger">{errors.roleId}</small>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveUser}
              className="btn btn-primary"
            >
              {isActionADD ? "Thêm mới" : "Cập nhật"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Adduser;
