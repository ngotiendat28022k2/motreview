import React, { useEffect, useState } from "react";
import {
  createNewBannerService,
  getDetailBannerByIdService,
  updateBannerService,
} from "../../../services/userService";
import CommonUtils from "../../../utils/CommonUtils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./AddBanner.scss";

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

const AddBanner = () => {
  const { id } = useParams();

  const [inputValues, setInputValues] = useState({
    name: "",
    description: "",
    image: "",
    isActionADD: true,
    imageReview: "",
    isOpen: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (id) {
      const fetchBanner = async () => {
        const res = await getDetailBannerByIdService(id);
        if (res && res.errCode === 0) {
          setStateBanner(res.data);
        } else {
          toast.error(res.errMessage || "Failed to fetch banner details");
        }
      };
      fetchBanner();
    }
  }, [id]);

  const setStateBanner = (data) => {
    setInputValues({
      ...inputValues,
      name: data.name,
      description: data.description,
      image: data.image,
      imageReview: data.image,
      isActionADD: false,
    });
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when input changes
  };

  const handleOnChangeImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrors({ ...errors, image: "Dung lượng file phải nhỏ hơn 30MB" });
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrors({
          ...errors,
          image: "Chỉ chấp nhận các định dạng: jpg, png",
        });
        return;
      }
      const base64 = await CommonUtils.getBase64(file);
      const objectUrl = URL.createObjectURL(file);
      setInputValues({ ...inputValues, image: base64, imageReview: objectUrl });
      setErrors({ ...errors, image: "" }); // Clear error when file is valid
    }
  };

  const openPreviewImage = () => {
    if (inputValues.imageReview) {
      setInputValues({ ...inputValues, isOpen: true });
    }
  };

  const validate = () => {
    let valid = true;
    let tempErrors = { name: "", description: "", image: "" };

    // Validate name
    if (!inputValues.name) {
      tempErrors.name = "Tên băng rôn không được để trống";
      valid = false;
    }

    // Validate description
    if (!inputValues.description) {
      tempErrors.description = "Mô tả không được để trống";
      valid = false;
    }

    // Validate image
    if (!inputValues.image) {
      tempErrors.image = "Vui lòng chọn hình ảnh";
      valid = false;
    } else {
      // Additional checks for image validity
      const img = new Image();
      img.src = inputValues.image;
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          // example check for minimum dimensions
          tempErrors.image =
            "Hình ảnh phải có kích thước tối thiểu là 100x100 px";
          valid = false;
        }
      };
      img.onerror = () => {
        tempErrors.image = "Hình ảnh không hợp lệ";
        valid = false;
      };
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSaveBanner = async () => {
    if (!validate()) return; // Only save if valid

    const bannerData = {
      name: inputValues.name,
      description: inputValues.description,
      image: inputValues.image,
    };

    if (inputValues.isActionADD) {
      const res = await createNewBannerService(bannerData);
      if (res && res.errCode === 0) {
        toast.success("Tạo mới băng rôn thành công!");
        setInputValues({
          name: "",
          description: "",
          image: "",
          imageReview: "",
          isActionADD: true,
        });
      } else {
        toast.error(res.errMessage || "Failed to create banner");
      }
    } else {
      const res = await updateBannerService({ ...bannerData, id });
      if (res && res.errCode === 0) {
        toast.success("Cập nhật băng rôn thành công!");
      } else {
        toast.error(res.errMessage || "Failed to update banner");
      }
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý băng rôn</h1>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          {inputValues.isActionADD
            ? "Thêm mới băng rôn"
            : "Cập nhật thông tin băng rôn"}
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputName">Tên băng rôn</label>
                <input
                  type="text"
                  id="inputName"
                  value={inputValues.name}
                  name="name"
                  onChange={handleOnChange}
                  className={`form-control  ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && (
                  <small className="form-text text-danger">{errors.name}</small>
                )}
              </div>
              <div className="col-md-4 form-group">
                <label>Chọn hình ảnh</label>
                <input
                  accept=".jpg,.png"
                  onChange={handleOnChangeImage}
                  type="file"
                  className={`form-control form-file ${
                    errors.image ? "is-invalid" : ""
                  }`}
                />
                {errors.image && (
                  <small className="form-text text-danger">
                    {errors.image}
                  </small>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputImage">Hình ảnh hiển thị</label>
                <div
                  style={{ backgroundImage: `url(${inputValues.imageReview})` }}
                  onClick={openPreviewImage}
                  className="box-img-preview"
                ></div>
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="inputDescription">Mô tả chi tiết</label>
                <textarea
                  rows="4"
                  id="inputDescription"
                  value={inputValues.description}
                  name="description"
                  onChange={handleOnChange}
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                ></textarea>
                {errors.description && (
                  <small className="form-text text-danger">
                    {errors.description}
                  </small>
                )}
              </div>
            </div>
            <button
              onClick={handleSaveBanner}
              type="button"
              className="btn btn-primary"
            >
              Lưu thông tin
            </button>
          </form>
        </div>
      </div>
      {inputValues.isOpen && (
        <Lightbox
          mainSrc={inputValues.imageReview}
          onCloseRequest={() =>
            setInputValues({ ...inputValues, isOpen: false })
          }
        />
      )}
    </div>
  );
};

export default AddBanner;
