import React, { useEffect, useState } from "react";
import {
  getAllProductAdmin,
  getDetailReceiptByIdService,
  createNewReceiptDetailService,
  deleteReceiptDetailService,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const DetailReceipt = () => {
  const { id } = useParams();
  const [dataProduct, setdataProduct] = useState([]);
  const [dataProductDetail, setdataProductDetail] = useState([]);
  const [dataProductDetailSize, setdataProductDetailSize] = useState([]);
  const [productDetailSizeId, setproductDetailSizeId] = useState("");
  const [dataReceiptDetail, setdataReceiptDetail] = useState([]);
  const [inputValues, setInputValues] = useState({
    quantity: "",
    price: "",
    productId: "",
  });
  const [errors, setErrors] = useState({
    quantity: "",
    price: "",
    productId: "",
  });

  useEffect(() => {
    loadProduct();
    loadReceiptDetail(id);
  }, [id]);

  useEffect(() => {
    if (dataProduct.length > 0 && inputValues.productId === "") {
      setInputValues((prev) => ({
        ...prev,
        productId: dataProduct[0].id,
      }));
      setproductDetailSizeId(
        dataProduct[0].productDetail[0].productDetailSize[0].id
      );
      setdataProductDetail(dataProduct[0].productDetail);
      setdataProductDetailSize(
        dataProduct[0].productDetail[0].productDetailSize
      );
    }
  }, [dataProduct]);

  const loadReceiptDetail = async (id) => {
    const res = await getDetailReceiptByIdService(id);
    if (res && res.errCode === 0) {
      setdataReceiptDetail(res.data.receiptDetail);
    }
  };

  const loadProduct = async () => {
    const arrData = await getAllProductAdmin({
      sortName: "",
      sortPrice: "",
      categoryId: "ALL",
      brandId: "ALL",
      limit: "",
      offset: "",
      keyword: "",
    });
    if (arrData && arrData.errCode === 0) {
      setdataProduct(arrData.data);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleOnChangeProduct = (event) => {
    const { value } = event.target;
    setInputValues((prev) => ({ ...prev, productId: value }));
    for (let product of dataProduct) {
      if (product.id === value) {
        setdataProductDetail(product.productDetail);
        setdataProductDetailSize(product.productDetail[0].productDetailSize);
        setproductDetailSizeId(
          product.productDetail[0].productDetailSize[0].id
        );
        break;
      }
    }
  };

  const handleOnChangeProductDetail = (event) => {
    const { value } = event.target;
    setInputValues((prev) => ({ ...prev, productDetailId: value }));
    for (let detail of dataProductDetail) {
      if (detail.id === value) {
        setdataProductDetailSize(detail.productDetailSize);
        setproductDetailSizeId(detail.productDetailSize[0].id);
        break;
      }
    }
  };

  const validateInputs = () => {
    let valid = true;
    let newErrors = { quantity: "", price: "", productId: "" };

    if (inputValues.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0.";
      valid = false;
    }

    if (inputValues.price <= 0) {
      newErrors.price = "Đơn giá phải lớn hơn 0.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSaveReceiptDetail = async () => {
    if (!validateInputs()) return;

    const res = await createNewReceiptDetailService({
      receiptId: id,
      productDetailSizeId: productDetailSizeId,
      quantity: inputValues.quantity,
      price: inputValues.price,
    });

    if (res && res.errCode === 0) {
      toast.success("Thêm nhập chi tiết hàng thành công");
      setInputValues({ quantity: "", price: "", productId: "" });
      loadReceiptDetail(id);
    } else if (res && res.errCode === 2) {
      toast.error(res.errMessage);
    } else {
      toast.error("Thêm nhập hàng thất bại");
    }
  };

  const handleDeleteReceiptDetail = async (receiptDetailId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa chi tiết nhập hàng này không?"
    );

    if (isConfirmed && receiptDetailId) {
      const res = await deleteReceiptDetailService(receiptDetailId);
      if (res && res.errCode === 0) {
        toast.success("Xóa chi tiết nhập hàng thành công");
        loadReceiptDetail(id); // Tải lại danh sách chi tiết nhập hàng sau khi xóa thành công
      } else {
        toast.error("Xóa chi tiết nhập hàng thất bại");
      }
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý chi tiết nhập hàng</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Thêm mới chi tiết nhập hàng
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Sản phẩm</label>
                <select
                  value={inputValues.productId}
                  name="productId"
                  onChange={handleOnChangeProduct}
                  id="inputState"
                  className="form-control"
                >
                  {dataProduct.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <div className="text-danger">{errors.productId}</div>
                )}
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Loại sản phẩm</label>
                <select
                  onChange={handleOnChangeProductDetail}
                  id="inputState"
                  className="form-control"
                >
                  {dataProductDetail.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.nameDetail}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Size sản phẩm</label>
                <select
                  value={productDetailSizeId}
                  name="productDetailSizeId"
                  onChange={(event) =>
                    setproductDetailSizeId(event.target.value)
                  }
                  id="inputState"
                  className="form-control"
                >
                  {dataProductDetailSize.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.sizeId}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Số lượng</label>
                <input
                  type="number"
                  value={inputValues.quantity}
                  name="quantity"
                  onChange={handleOnChange}
                  className="form-control"
                  id="inputEmail4"
                />
                {errors.quantity && (
                  <div className="text-danger">{errors.quantity}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Đơn giá</label>
                <input
                  type="number"
                  value={inputValues.price}
                  name="price"
                  onChange={handleOnChange}
                  className="form-control"
                  id="inputEmail4"
                />
                {errors.price && (
                  <div className="text-danger">{errors.price}</div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveReceiptDetail}
              className="btn btn-primary"
            >
              Lưu thông tin
            </button>
          </form>
        </div>
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Danh sách chi tiết nhập hàng
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered"
              width="100%"
              cellspacing="0"
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã đơn</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {dataReceiptDetail.map((item, index) => {
                  const name = `${item.productData.name} - ${item.productDetailData.nameDetail} - ${item.productDetailSizeData.sizeId}`;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.productData.id}</td>
                      <td>{name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteReceiptDetail(item.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailReceipt;
