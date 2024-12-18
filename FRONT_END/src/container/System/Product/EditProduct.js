import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useFetchAllcode } from "../../customize/fetch";
import "./AddProduct.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import {
  getDetailProductByIdService,
  UpdateProductService,
} from "../../../services/userService";

const EditProduct = (props) => {
  const mdParser = new MarkdownIt();
  const { id } = useParams();
  const { data: dataBrand } = useFetchAllcode("BRAND");
  const { data: dataCategory } = useFetchAllcode("CATEGORY");

  const [inputValues, setInputValues] = useState({
    brandId: "",
    categoryId: "",
    name: "",
    contentHTML: "",
    contentMarkdown: "",
    madeby: "",
    material: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    let fetchProduct = async () => {
      let res = await getDetailProductByIdService(id);
      if (res && res.errCode === 0) {
        setStateProduct(res.data);
      }
    };
    fetchProduct();
  }, [id]);

  let setStateProduct = (data) => {
    setInputValues({
      ...inputValues,
      brandId: data.brandId,
      categoryId: data.categoryId,
      name: data.name,
      contentMarkdown: data.contentMarkdown,
      contentHTML: data.contentHTML,
      madeby: data.madeby,
      material: data.material,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!inputValues.name) errors.name = "Tên sản phẩm là bắt buộc";
    if (!inputValues.material) errors.material = "Tác Giả là bắt buộc";
    if (!inputValues.madeby) errors.madeby = "Nhà Xuất Bản là bắt buộc";
    if (!inputValues.categoryId)
      errors.categoryId = "Danh mục sản phẩm là bắt buộc";
    if (!inputValues.brandId) errors.brandId = "Nhãn hàng là bắt buộc";
    if (!inputValues.contentMarkdown)
      errors.contentMarkdown = "Nội dung sản phẩm là bắt buộc";
    return errors;
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSaveProduct = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let res = await UpdateProductService({
      name: inputValues.name,
      material: inputValues.material,
      madeby: inputValues.madeby,
      brandId: inputValues.brandId,
      categoryId: inputValues.categoryId,
      contentHTML: inputValues.contentHTML,
      contentMarkdown: inputValues.contentMarkdown,
      id: id,
    });

    if (res && res.errCode === 0) {
      toast.success("Cập nhật sản phẩm thành công !");
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleEditorChange = ({ html, text }) => {
    setInputValues({
      ...inputValues,
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý sản phẩm</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Cập nhật sản phẩm
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Tên sản phẩm</label>
                <input
                  type="text"
                  value={inputValues.name}
                  name="name"
                  onChange={handleOnChange}
                  className={`form-control  ${errors.name ? "is-invalid" : ""}`}
                  id="inputEmail4"
                />
                {errors.name && (
                  <div className="text-danger">{errors.name}</div>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Tác Giả</label>
                <input
                  type="text"
                  value={inputValues.material}
                  name="material"
                  onChange={handleOnChange}
                  className={`form-control  ${
                    errors.material ? "is-invalid" : ""
                  }`}
                  id="inputPassword4"
                />
                {errors.material && (
                  <div className="text-danger">{errors.material}</div>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Nhà Xuất Bản</label>
                <input
                  type="text"
                  value={inputValues.madeby}
                  name="madeby"
                  onChange={handleOnChange}
                  className={`form-control  ${
                    errors.madeby ? "is-invalid" : ""
                  }`}
                  id="inputPassword4"
                />
                {errors.madeby && (
                  <div className="text-danger">{errors.madeby}</div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress">Mô tả sản phẩm</label>
              <MdEditor
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                value={inputValues.contentMarkdown}
              />
              {errors.contentMarkdown && (
                <div className="text-danger">{errors.contentMarkdown}</div>
              )}
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Danh mục sản phẩm</label>
                <select
                  value={inputValues.categoryId}
                  name="categoryId"
                  onChange={handleOnChange}
                  id="inputState"
                  className={`form-control  ${
                    errors.categoryId ? "is-invalid" : ""
                  }`}
                >
                  {dataCategory &&
                    dataCategory.length > 0 &&
                    dataCategory.map((item, index) => (
                      <option key={index} value={item.code}>
                        {item.value}
                      </option>
                    ))}
                </select>
                {errors.categoryId && (
                  <div className="text-danger">{errors.categoryId}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Nhãn hàng</label>
                <select
                  value={inputValues.brandId}
                  name="brandId"
                  onChange={handleOnChange}
                  id="inputState"
                  className={`form-control  ${
                    errors.brandId ? "is-invalid" : ""
                  }`}
                >
                  {dataBrand &&
                    dataBrand.length > 0 &&
                    dataBrand.map((item, index) => (
                      <option key={index} value={item.code}>
                        {item.value}
                      </option>
                    ))}
                </select>
                {errors.brandId && (
                  <div className="text-danger">{errors.brandId}</div>
                )}
              </div>
            </div>
            <button
              onClick={handleSaveProduct}
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

export default EditProduct;
