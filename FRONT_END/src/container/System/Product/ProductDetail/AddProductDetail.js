import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import CommonUtils from "../../../../utils/CommonUtils";
import "../AddProduct.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useFetchAllcode } from "../../../customize/fetch";
import { CreateNewProductDetailService } from "../../../../services/userService";

const AddProductDetail = (props) => {
  const { data: dataSize } = useFetchAllcode("SIZE");
  const { id } = useParams();
  const [inputValues, setInputValues] = useState({
    width: "",
    height: "",
    sizeId: "",
    originalPrice: "",
    discountPrice: "",
    image: "",
    imageReview: "",
    isOpen: false,
    nameDetail: "",
    description: "",
    weight: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dataSize && dataSize.length > 0 && inputValues.sizeId === "") {
      setInputValues({ ...inputValues, sizeId: dataSize[0].code });
    }
  }, [dataSize, inputValues.sizeId]);

  const validate = () => {
    const errors = {};

    // Validate nameDetail
    if (!inputValues.nameDetail.trim()) {
      errors.nameDetail = "Tên loại sản phẩm là bắt buộc";
    }

    // Validate width
    if (!inputValues.width.trim()) {
      errors.width = " là bắt buộc";
    }

    // Validate height
    if (!inputValues.height.trim()) {
      errors.height = "Tỷ lệ nén là bắt buộc";
    }

    // Validate originalPrice
    if (!inputValues.originalPrice || inputValues.originalPrice < 0) {
      errors.originalPrice = "Giá sale là bắt buộc và phải lớn hơn hoặc bằng 0";
    }

    // Validate discountPrice
    if (!inputValues.discountPrice || inputValues.discountPrice < 0) {
      errors.discountPrice = "Giá phải lớn hơn hoặc bằng 0";
    }

    // Validate weight
    if (!inputValues.weight.trim()) {
      errors.weight = "Khối lượng là bắt buộc";
    }

    // Validate description
    if (!inputValues.description.trim()) {
      errors.description = "Mô tả chi tiết là bắt buộc";
    }

    // Validate discountPrice does not exceed originalPrice
    if (
      inputValues.discountPrice &&
      inputValues.originalPrice &&
      inputValues.discountPrice > inputValues.originalPrice
    ) {
      errors.discountPrice = "Giá đặ cọc không thể lớn hơn Giá sale";
    }

    // Validate image
    if (!inputValues.image) {
      errors.image = "Hình ảnh là bắt buộc";
    }

    return errors;
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file.size > 31312281) {
      toast.error("Dung lượng file phải nhỏ hơn 30MB");
    } else if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast.error("Chỉ hỗ trợ các định dạng JPEG, PNG, GIF");
    } else {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      setInputValues({ ...inputValues, image: base64, imageReview: objectUrl });
      setErrors({ ...errors, image: "" }); // Clear image error
    }
  };

  const openPreviewImage = () => {
    if (!inputValues.imageReview) return;
    setInputValues({ ...inputValues, isOpen: true });
  };

  const handleSaveProductDetail = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let res = await CreateNewProductDetailService({
        id: id,
        width: inputValues.width,
        height: inputValues.height,
        description: inputValues.description,
        sizeId: inputValues.sizeId,
        originalPrice: inputValues.originalPrice,
        discountPrice: inputValues.discountPrice,
        image: inputValues.image,
        nameDetail: inputValues.nameDetail,
        weight: inputValues.weight,
      });

      if (res && res.errCode === 0) {
        toast.success("Tạo mới loại sản phẩm thành công!");
        setInputValues({
          width: "",
          height: "",
          sizeId: "",
          originalPrice: "",
          discountPrice: "",
          image: "",
          imageReview: "",
          nameDetail: "",
          description: "",
          weight: "",
        });
        setErrors({}); // Clear all errors on success
      } else {
        toast.error(res.errMessage || "Failed to create product detail");
      }
    } catch (error) {
      toast.error("An error occurred while creating product detail");
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý chi tiết sản phẩm</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Thêm mới chi tiết sản phẩm
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="nameDetail">Tên loại sản phẩm</label>
                <input
                  type="text"
                  value={inputValues.nameDetail}
                  name="nameDetail"
                  onChange={handleOnChange}
                  className={`form-control  ${
                    errors.nameDetail ? "is-invalid" : ""
                  }`}
                  id="nameDetail"
                />
                {errors.nameDetail && (
                  <small className="form-text text-danger">
                    {errors.nameDetail}
                  </small>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="width">Tác Giả</label>
                <input
                  type="text"
                  value={inputValues.width}
                  name="width"
                  onChange={handleOnChange}
                  className={`form-control  ${
                    errors.width ? "is-invalid" : ""
                  }`}
                  id="width"
                />
                {errors.width && (
                  <small className="form-text text-danger">
                    {errors.width}
                  </small>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="height">Nhà Xuất Bản</label>
                <input
                  type="text"
                  value={inputValues.height}
                  name="height"
                  onChange={handleOnChange}
                  className={`form-control  ${
                    errors.height ? "is-invalid" : ""
                  }`}
                  id="height"
                />
                {errors.height && (
                  <small className="form-text text-danger">
                    {errors.height}
                  </small>
                )}
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="originalPrice">Giá sale</label>
                <input
                  type="number"
                  value={inputValues.originalPrice}
                  name="originalPrice"
                  onChange={handleOnChange}
                  className={`form-control  ${
                    errors.originalPrice ? "is-invalid" : ""
                  }`}
                  id="originalPrice"
                />
                {errors.originalPrice && (
                  <small className="form-text text-danger">
                    {errors.originalPrice}
                  </small>
                )}
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="discountPrice">Giá</label>
                <input
                  type="number"
                  value={inputValues.discountPrice}
                  name="discountPrice"
                  onChange={handleOnChange}
                  className={`form-control  ${
                    errors.discountPrice ? "is-invalid" : ""
                  }`}
                  id="discountPrice"
                />
                {errors.discountPrice && (
                  <small className="form-text text-danger">
                    {errors.discountPrice}
                  </small>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="weight">Khối lượng</label>
                <input
                  type="text"
                  value={inputValues.weight}
                  name="weight"
                  onChange={handleOnChange}
                  className={`form-control  ${
                    errors.weight ? "is-invalid" : ""
                  }`}
                  id="weight"
                />
                {errors.weight && (
                  <small className="form-text text-danger">
                    {errors.weight}
                  </small>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả chi tiết</label>
              <textarea
                rows="4"
                value={inputValues.description}
                name="description"
                onChange={handleOnChange}
                className={`form-control  ${
                  errors.description ? "is-invalid" : ""
                }`}
                id="description"
              />
              {errors.description && (
                <small className="form-text text-danger">
                  {errors.description}
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="image">Hình ảnh</label>
              <input
                type="file"
                onChange={handleOnChangeImage}
                className={`form-control form-file  ${
                  errors.image ? "is-invalid" : ""
                }`}
                id="image"
              />
              {errors.image && (
                <small className="form-text text-danger">{errors.image}</small>
              )}
              {inputValues.imageReview && (
                <div>
                  <img
                    src={inputValues.imageReview}
                    alt="Preview"
                    style={{ width: "100px", cursor: "pointer" }}
                    onClick={openPreviewImage}
                  />
                </div>
              )}
            </div>
            {inputValues.isOpen && (
              <Lightbox
                mainSrc={inputValues.imageReview}
                onCloseRequest={() =>
                  setInputValues({ ...inputValues, isOpen: false })
                }
              />
            )}
            <button
              type="button"
              onClick={handleSaveProductDetail}
              className="btn btn-primary"
            >
              Lưu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductDetail;
