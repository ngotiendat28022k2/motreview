import React, { useEffect, useState } from "react";
import {
  createNewReceiptService,
  getAllSupplier,
  getAllProductAdmin,
} from "../../../services/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const AddReceipt = (props) => {
  const [user, setUser] = useState({});
  const [dataSupplier, setdataSupplier] = useState([]);
  const [dataProduct, setdataProduct] = useState([]);
  const [dataProductDetail, setdataProductDetail] = useState([]);
  const [dataProductDetailSize, setdataProductDetailSize] = useState([]);
  const [productDetailSizeId, setproductDetailSizeId] = useState("");
  const [inputValues, setInputValues] = useState({
    supplierId: "",
    quantity: "",
    price: "",
    productId: "",
  });
  const [errors, setErrors] = useState({
    quantity: "",
    price: "",
  });

  console.log("dataProductDetail", dataProductDetail);
  console.log("dataProductDetailSize", dataProductDetailSize);
  console.log("productDetailSizeId", productDetailSizeId);
  useEffect(() => {
    loadDataSupplier();
    loadProduct();
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
  }, []);

  useEffect(() => {
    if (dataSupplier.length > 0 && inputValues.supplierId === "") {
      setInputValues((prev) => ({ ...prev, supplierId: dataSupplier[0].id }));
    }
  }, [dataSupplier]);

  useEffect(() => {
    if (dataProduct.length > 0 && inputValues.productId === "") {
      setInputValues((prev) => ({ ...prev, productId: dataProduct[0].id }));
    }
  }, [dataProduct]);

  // console.log("dataProduct", dataProduct)
  useEffect(() => {
    if (inputValues.productId && dataProduct.length > 0) {
      const selectedProduct = dataProduct.find(
        (item) => item.id == inputValues.productId
      );

      // console.log("selectedProduct", selectedProduct)
      if (selectedProduct) {
        setdataProductDetail(selectedProduct.productDetail || []);
        // Chọn loại sản phẩm đầu tiên nếu có
        const firstProductDetail = selectedProduct.productDetail[0];
        console.log("firstProductDetail", firstProductDetail);
        if (firstProductDetail) {
          setdataProductDetailSize(firstProductDetail.productDetailSize || []);
          setproductDetailSizeId(
            firstProductDetail.productDetailSize.length > 0
              ? firstProductDetail.productDetailSize[0].id
              : ""
          );
        }
      } else {
        // Nếu không tìm thấy sản phẩm, xóa loại sản phẩm và kích thước sản phẩm
        setdataProductDetail([]);
        setdataProductDetailSize([]);
        setproductDetailSizeId("");
      }
    }
  }, [inputValues.productId, dataProduct]);

  // console.log("inputValues.productId", inputValues.productId)

  const loadDataSupplier = async () => {
    let arrData = await getAllSupplier({
      limit: "",
      offset: "",
      keyword: "",
    });
    // console.log('Data Supplier:', arrData); // Check the returned data
    if (arrData && arrData.errCode === 0) {
      setdataSupplier(arrData.data);
    }
  };

  const loadProduct = async () => {
    let arrData = await getAllProductAdmin({
      sortName: "",
      sortPrice: "",
      categoryId: "ALL",
      brandId: "ALL",
      limit: "",
      offset: "",
      keyword: "",
    });
    // console.log('Data Product:', arrData); // Check the returned data
    if (arrData && arrData.errCode === 0) {
      setdataProduct(arrData.data);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnChangeProduct = (event) => {
    const { name, value } = event.target;

    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnChangeProductDetail = (event) => {
    const { value } = event.target;
    const selectedDetail = dataProductDetail.find((item) => item.id == value);
    if (selectedDetail) {
      setdataProductDetailSize(selectedDetail.productDetailSize || []);
      setproductDetailSizeId(
        selectedDetail.productDetailSize.length > 0
          ? selectedDetail.productDetailSize[0].id
          : ""
      );
    } else {
      setdataProductDetailSize([]);
      setproductDetailSizeId("");
    }
  };

  const handleSaveReceipt = async () => {
    let newErrors = {
      quantity: "",
      price: "",
    };

    if (inputValues.quantity.trim() === "" || inputValues.quantity <= 0) {
      newErrors.quantity = "Số lượng không được để trống và phải lớn hơn 0";
    }

    if (inputValues.price.trim() === "" || inputValues.price <= 0) {
      newErrors.price = "Đơn giá không được để trống và phải lớn hơn 0";
    }

    if (newErrors.quantity || newErrors.price) {
      setErrors(newErrors);
      return;
    }

    let res = await createNewReceiptService({
      supplierId: inputValues.supplierId,
      userId: user.id,
      productDetailSizeId: productDetailSizeId || "", // Ensure this value is not undefined
      quantity: inputValues.quantity,
      price: inputValues.price,
    });

    if (res && res.errCode === 0) {
      toast.success("Thêm nhập hàng thành công");
      setInputValues({
        supplierId: "",
        quantity: "",
        price: "",
        productId: "",
      });
      setErrors({ quantity: "", price: "" }); // Clear errors
    } else if (res && res.errCode === 2) {
      toast.error(res.errMessage);
    } else {
      toast.error("Thêm nhập hàng thất bại");
    }
  };

  // console.log('Selected Product:', selectedProduct);
  // console.log('Product Details:', selectedProduct?.productDetail);
  // console.log('Product Detail Sizes:', selectedDetail?.productDetailSize);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý nhập hàng</h1>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Thêm mới nhập hàng
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Nhà cung cấp</label>
                <select
                  value={inputValues.supplierId}
                  name="supplierId"
                  onChange={handleOnChange}
                  id="inputState"
                  className="form-control"
                >
                  {dataSupplier &&
                    dataSupplier.length > 0 &&
                    dataSupplier.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
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
                  {dataProduct &&
                    dataProduct.length > 0 &&
                    dataProduct.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Loại sản phẩm</label>
                <select
                  onChange={handleOnChangeProductDetail}
                  id="inputState"
                  className="form-control"
                >
                  {dataProductDetail &&
                    dataProductDetail.length > 0 &&
                    dataProductDetail.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.nameDetail}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputEmail4">Phần</label>
                <select
                  value={productDetailSizeId}
                  name="productDetailSizeId"
                  onChange={(event) =>
                    setproductDetailSizeId(event.target.value)
                  }
                  id="inputState"
                  className="form-control"
                >
                  {dataProductDetailSize &&
                    dataProductDetailSize.length > 0 &&
                    dataProductDetailSize.map((item, index) => (
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
                  className={`form-control  ${
                    errors.quantity ? "is-invalid" : ""
                  }`}
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
                  className={`form-control  ${
                    errors.price ? "is-invalid" : ""
                  }`}
                  id="inputEmail4"
                />
                {errors.price && (
                  <div className="text-danger">{errors.price}</div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveReceipt}
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

export default AddReceipt;
