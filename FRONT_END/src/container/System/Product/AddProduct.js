import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useFetchAllcode } from "../../customize/fetch";
import CommonUtils from "../../../utils/CommonUtils";
import localization from "moment/locale/vi";
import moment from "moment";
import "./AddProduct.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { CreateNewProduct } from "../../../services/userService";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const AddProduct = (props) => {
  const mdParser = new MarkdownIt();
  const { data: dataBrand } = useFetchAllcode("BRAND");
  const [errors, setErrors] = useState({});

  const { data: dataCategory } = useFetchAllcode("CATEGORY");
  const { data: dataSize } = useFetchAllcode("SIZE");
  const [inputValues, setInputValues] = useState({
    brandId: "",
    categoryId: "",
    name: "",
    shortdescription: "",
    description: "",
    madeby: "",
    material: "",
    width: "",
    height: "",
    sizeId: "",
    originalPrice: "",
    discountPrice: "",
    image: "",
    imageReview: "",
    isOpen: false,
    nameDetail: "",
    contentHTML: "",
    contentMarkdown: "",
    weight: "",
  });

  if (
    dataBrand &&
    dataBrand.length > 0 &&
    inputValues.brandId === "" &&
    dataCategory &&
    dataCategory.length > 0 &&
    inputValues.categoryId === "" &&
    dataSize &&
    dataSize.length > 0 &&
    inputValues.sizeId === ""
  ) {
    setInputValues({
      ...inputValues,
      brandId: dataBrand[0].code,
      categoryId: dataCategory[0].code,
      sizeId: dataSize[0].code,
    });
  }

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  let handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file.size > 31312281) {
      toast.error("Dung lượng file bé hơn 30mb");
    } else {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      setInputValues({ ...inputValues, image: base64, imageReview: objectUrl });
    }
  };

  let openPreviewImage = () => {
    if (!inputValues.imageReview) return;
    setInputValues({ ...inputValues, isOpen: true });
  };

  let handleSaveProduct = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    let res = await CreateNewProduct({
      name: inputValues.name,
      description: inputValues.description,
      categoryId: inputValues.categoryId,
      madeby: inputValues.madeby,
      material: inputValues.material,
      brandId: inputValues.brandId,
      width: inputValues.width,
      height: inputValues.height,
      sizeId: inputValues.sizeId,
      originalPrice: inputValues.originalPrice,
      discountPrice: inputValues.discountPrice,
      image: inputValues.image,
      nameDetail: inputValues.nameDetail,
      contentMarkdown: inputValues.contentMarkdown,
      contentHTML: inputValues.contentHTML,
      weight: inputValues.weight,
    });

    if (res && res.errCode === 0) {
      toast.success("Tạo mới sản phẩm thành công!");
      setInputValues({
        ...inputValues,
        name: "",
        shortdescription: "",
        categoryId: "",
        madeby: "",
        material: "",
        brandId: "",
        height: "",
        width: "",
        sizeId: "",
        originalPrice: "",
        discountPrice: "",
        image: "",
        imageReview: "",
        nameDetail: "",
        contentHTML: "",
        contentMarkdown: "",
        weight: "",
      });
    } else {
      toast.error(res.errMessage);
    }
  };

  let handleEditorChange = ({ html, text }) => {
    setInputValues({
      ...inputValues,
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  let handleDescriptionChange = ({ html, text }) => {
    setInputValues({
      ...inputValues,
      description: text,
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
    if (!inputValues.imageReview)
      errors.imageReview = "Ảnh sản phẩm là bắt buộc";
    if (!inputValues.width) errors.width = "Năm Xuất Bản không được để trống";
    if (!inputValues.height) errors.height = "Ngôn ngữ là bắt buộc";
    if (!inputValues.originalPrice || isNaN(inputValues.originalPrice))
      errors.originalPrice = "Giá sale không được để trống và phải là số";
    if (!inputValues.discountPrice || isNaN(inputValues.discountPrice))
      errors.discountPrice = "Giá không được để trống và  phải là số";
    if (!inputValues.weight) errors.weight = "Trọng lượng là bắt buộc";
    if (!inputValues.description) errors.description = "Mô tả là bắt buộc";
    if (!inputValues.nameDetail)
      errors.nameDetail = "Tên loại sản phẩmlà bắt buộc";
    // if (
    //   inputValues.discountPrice &&
    //   Number(inputValues.discountPrice) >= Number(inputValues.originalPrice)
    // )
    //   errors.discountPrice = "Giá phải nhỏ hơn Giá sale";
    if (!inputValues.contentMarkdown)
      errors.contentMarkdown = "Nội dung sản phẩm sản phẩm là bắt buộc";

    return errors;
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý sản phẩm</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Thêm mới sản phẩm
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
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${errors.name ? "is-invalid" : ""}`}
                  id="inputEmail4"
                />
                {errors.name && <p className="text-danger">{errors.name}</p>}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Tác Giả</label>
                <input
                  type="text"
                  value={inputValues.material}
                  name="material"
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${
                    errors.material ? "is-invalid" : ""
                  }`}
                  id="inputPassword4"
                />
                {errors.material && (
                  <p className="text-danger">{errors.material}</p>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Nhà Xuất Bản</label>
                <input
                  type="text"
                  value={inputValues.madeby}
                  name="madeby"
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${
                    errors.madeby ? "is-invalid" : ""
                  }`}
                  id="inputPassword4"
                />
                {errors.madeby && (
                  <p className="text-danger">{errors.madeby}</p>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Danh mục sản phẩm</label>
                <select
                  value={inputValues.categoryId}
                  name="categoryId"
                  onChange={(event) => handleOnChange(event)}
                  id="inputState"
                  className={`form-control  ${
                    errors.categoryId ? "is-invalid" : ""
                  }`}
                >
                  {dataCategory &&
                    dataCategory.length > 0 &&
                    dataCategory.map((item, index) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.value}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Nhãn hàng</label>
                <select
                  value={inputValues.brandId}
                  name="brandId"
                  onChange={(event) => handleOnChange(event)}
                  id="inputState"
                  className={`form-control  ${
                    errors.brandId ? "is-invalid" : ""
                  }`}
                >
                  {dataBrand &&
                    dataBrand.length > 0 &&
                    dataBrand.map((item, index) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.value}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress">Mô tả sản phẩm</label>
              <MdEditor
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleDescriptionChange}
                value={inputValues.description}
                className={` ${errors.description ? "is-invalid" : ""}`}
              />
              {errors.description && (
                <p className="text-danger">{errors.description}</p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Tên loại sản phẩm</label>
                <input
                  type="text"
                  value={inputValues.nameDetail}
                  name="nameDetail"
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${
                    errors.nameDetail ? "is-invalid" : ""
                  } `}
                  id="inputEmail4"
                />
                {errors.nameDetail && (
                  <p className="text-danger">{errors.nameDetail}</p>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Năm Xuất Bản</label>
                <input
                  type="text"
                  value={inputValues.width}
                  name="width"
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${
                    errors.width ? "is-invalid" : ""
                  }`}
                  id="inputEmail4"
                />
                {errors.width && <p className="text-danger">{errors.width}</p>}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Ngôn ngữ</label>
                <input
                  type="text"
                  value={inputValues.height}
                  name="height"
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${
                    errors.height ? "is-invalid" : ""
                  }`}
                  id="inputPassword4"
                />
                {errors.height && (
                  <p className="text-danger">{errors.height}</p>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Giá sale</label>
                <input
                  type="text"
                  value={inputValues.originalPrice}
                  name="originalPrice"
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${
                    errors.originalPrice ? "is-invalid" : ""
                  }`}
                  id="inputEmail4"
                />
                {errors.originalPrice && (
                  <p className="text-danger">{errors.originalPrice}</p>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Giá</label>
                <input
                  type="text"
                  value={inputValues.discountPrice}
                  name="discountPrice"
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${
                    errors.discountPrice ? "is-invalid" : ""
                  }`}
                  id="inputPassword4"
                />
                {errors.discountPrice && (
                  <p className="text-danger">{errors.discountPrice}</p>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Trọng lượng</label>
                <input
                  type="text"
                  value={inputValues.weight}
                  name="weight"
                  onChange={(event) => handleOnChange(event)}
                  className={`form-control  ${
                    errors.weight ? "is-invalid" : ""
                  }`}
                  id="inputPassword4"
                />
                {errors.weight && (
                  <p className="text-danger">{errors.weight}</p>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputPassword4">Phần</label>
                <select
                  value={inputValues.sizeId}
                  name="sizeId"
                  onChange={(event) => handleOnChange(event)}
                  id="inputState"
                  className={`form-control  ${
                    errors.sizeId ? "is-invalid" : ""
                  }`}
                >
                  {dataSize &&
                    dataSize.length > 0 &&
                    dataSize.map((item, index) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.value}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputAddress2">Ảnh sản phẩm</label>
                <input
                  type="file"
                  onChange={(event) => handleOnChangeImage(event)}
                  className={`form-control  ${
                    errors.imageReview ? "is-invalid" : ""
                  }`}
                  id="inputAddress2"
                />
                {errors.imageReview && (
                  <p className="text-danger">{errors.imageReview}</p>
                )}
              </div>
              <div className="form-group col-md-4 flex align-items-center mb-0 mt-3">
                <div className="preview-img-container">
                  {inputValues.imageReview && (
                    <img
                      className="preview-image img-cmt"
                      src={inputValues.imageReview}
                      onClick={() => openPreviewImage()}
                      alt="Preview"
                    />
                  )}
                </div>
              </div>
              {inputValues.isOpen === true && (
                <Lightbox
                  mainSrc={inputValues.imageReview}
                  onCloseRequest={() =>
                    setInputValues({ ...inputValues, isOpen: false })
                  }
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress">Nội dung sản phẩm</label>
              <MdEditor
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                value={inputValues.contentMarkdown}
                className={` ${errors.contentMarkdown ? "is-invalid" : ""}`}
              />
              {errors.contentMarkdown && (
                <p className="text-danger">{errors.contentMarkdown}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleSaveProduct()}
              className="btn btn-primary"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
