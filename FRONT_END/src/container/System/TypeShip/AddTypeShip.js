import React, { useEffect, useState } from "react";
import {
  createNewTypeShipService,
  getDetailTypeShipByIdService,
  updateTypeShipService,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AddTypeShip = () => {
  const [isActionADD, setIsActionADD] = useState(true);
  const [inputValues, setInputValues] = useState({ type: "", price: "" });
  const [errors, setErrors] = useState({ type: "", price: "" });
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchDetailTypeShip = async () => {
        setIsActionADD(false);
        try {
          const typeship = await getDetailTypeShipByIdService(id);
          if (typeship && typeship.errCode === 0) {
            setInputValues({
              type: typeship.data.type,
              price: typeship.data.price.toString(), // Ensure price is a string
            });
          }
        } catch (error) {
          toast.error("Lỗi khi tải thông tin loại ship");
        }
      };
      fetchDetailTypeShip();
    }
  }, [id]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value.toString() })); // Ensure value is a string
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const tempErrors = { type: "", price: "" };

    if (!inputValues.type.trim()) {
      tempErrors.type = "Tên loại ship không được để trống";
      valid = false;
    }

    if (!inputValues.price.trim()) {
      tempErrors.price = "Giá tiền không được để trống";
      valid = false;
    } else if (isNaN(inputValues.price)) {
      tempErrors.price = "Giá tiền phải là số";
      valid = false;
    } else if (Number(inputValues.price) < 0) {
      tempErrors.price = "Giá tiền không được là số âm";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSaveTypeShip = async () => {
    if (!validate()) return;

    const data = {
      type: inputValues.type,
      price: inputValues.price,
    };

    try {
      let res;
      if (isActionADD) {
        res = await createNewTypeShipService(data);
        if (res && res.errCode === 0) {
          toast.success("Thêm loại ship thành công");
          setInputValues({ type: "", price: "" });
        } else {
          toast.error(res.errMessage || "Thêm loại ship thất bại");
        }
      } else {
        res = await updateTypeShipService({ ...data, id });
        if (res && res.errCode === 0) {
          toast.success("Cập nhật loại ship thành công");
        } else {
          toast.error(res.errMessage || "Cập nhật loại ship thất bại");
        }
      }
    } catch (error) {
      toast.error("Lỗi khi lưu thông tin loại ship");
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý loại ship</h1>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          {isActionADD ? "Thêm mới loại ship" : "Cập nhật thông tin loại ship"}
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputType">Tên loại ship</label>
                <input
                  type="text"
                  value={inputValues.type}
                  name="type"
                  onChange={handleOnChange}
                  className={`form-control ${errors.type ? "is-invalid" : ""}`}
                  id="inputType"
                />
                {errors.type && (
                  <small className="form-text text-danger">{errors.type}</small>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPrice">Giá tiền</label>
                <input
                  type="text"
                  value={inputValues.price}
                  name="price"
                  onChange={handleOnChange}
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  id="inputPrice"
                />
                {errors.price && (
                  <small className="form-text text-danger">
                    {errors.price}
                  </small>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveTypeShip}
              className="btn btn-primary"
            >
              Lưu thông tin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTypeShip;
