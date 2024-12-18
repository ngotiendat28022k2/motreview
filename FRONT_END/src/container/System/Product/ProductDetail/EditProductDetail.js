import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../AddProduct.scss";
import {
  getProductDetailByIdService,
  UpdateProductDetailService,
} from "../../../../services/userService";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const EditProductDetail = () => {
  const mdParser = new MarkdownIt();
  const [inputValues, setInputValues] = useState({
    originalPrice: "",
    discountPrice: "",
    nameDetail: "",
    description: "",
    contentHTML: "",
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await getProductDetailByIdService(id);
        if (res && res.errCode === 0) {
          setStateProductDetail(res.data);
        } else {
          toast.error(res.errMessage || "Failed to fetch product detail");
        }
      } catch (error) {
        toast.error("An error occurred while fetching product detail");
      }
    };
    fetchProductDetail();
  }, [id]);

  const setStateProductDetail = (data) => {
    setInputValues({
      originalPrice: data.originalPrice || "",
      discountPrice: data.discountPrice || "",
      nameDetail: data.nameDetail || "",
      description: data.description || "",
      contentHTML: data.contentHTML || "",
    });
  };

  const validate = () => {
    const errors = {};

    // Kiểm tra tên loại sản phẩm
    if (!inputValues.nameDetail.trim()) {
      errors.nameDetail = "Tên loại sản phẩm là bắt buộc";
    }

    // Kiểm tra Giá sale
    if (!inputValues.originalPrice || inputValues.originalPrice < 0) {
      errors.originalPrice = "Giá sale là bắt buộc và phải lớn hơn hoặc bằng 0";
    }

    if (!inputValues.discountPrice || inputValues.discountPrice < 0) {
      errors.discountPrice = "Giá phải lớn hơn hoặc bằng 0";
    }

    // Kiểm tra mô tả
    if (!inputValues.description.trim()) {
      errors.description = "Mô tả là bắt buộc";
    }

    return errors;
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSaveProductDetail = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await UpdateProductDetailService({
        id,
        description: inputValues.description,
        originalPrice: inputValues.originalPrice,
        discountPrice: inputValues.discountPrice,
        contentHTML: inputValues.contentHTML,
        nameDetail: inputValues.nameDetail,
      });

      if (res && res.errCode === 0) {
        toast.success("Cập nhật loại sản phẩm thành công!");
        setErrors({}); // Xóa lỗi khi lưu thành công
      } else {
        toast.error(res.errMessage || "Failed to update product detail");
      }
    } catch (error) {
      toast.error("An error occurred while updating product detail");
    }
  };

  const handleEditorChange = ({ html, text }) => {
    setInputValues({
      ...inputValues,
      description: text,
      contentHTML: html,
    });
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý chi tiết sản phẩm</h1>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Cập nhật chi tiết sản phẩm
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
              <div className="form-group col-md-4">
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
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả chi tiết</label>
              <MdEditor
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                value={inputValues.description}
              />
              {errors.description && (
                <small className="form-text text-danger">
                  {errors.description}
                </small>
              )}
            </div>

            <button
              onClick={handleSaveProductDetail}
              type="button"
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

export default EditProductDetail;
