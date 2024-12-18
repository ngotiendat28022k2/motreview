// AddressSection.jsx
import React from "react";

function AddressSection({
  dataAddressUser,
  addressUserId,
  isChangeAdress,
  handleOnChange,
  handleOpenAddressUserModal,
  setisChangeAdress
}) {
  return (
    <div className="wrap-address-order">
      <div className="border-top-address-order"></div>
      <div className="wrap-content-address">
        <div className="content-up">
          <div className="content-left">
            <i className="fas fa-map-marker-alt"></i>
            <span>Địa Chỉ Nhận Hàng</span>
          </div>
          {isChangeAdress && (
            <div className="content-right">
              <div className="wrap-add-address">
                <i className="fas fa-plus"></i>
                <span onClick={handleOpenAddressUserModal}>Thêm địa chỉ mới</span>
              </div>
            </div>
          )}
        </div>
        <div className="content-down">
          {!isChangeAdress ? (
            <>
              <div className="content-left">
                Thông tin:{" "}
                <span>
                  {dataAddressUser.length > 0 && dataAddressUser[0].shipName} (
                  {dataAddressUser.length > 0 && dataAddressUser[0].shipPhonenumber})
                </span>
              </div>
              <div className="content-center">
                Địa chỉ nhận hàng:
                <span className="ml-2">
                  {dataAddressUser.length > 0 && dataAddressUser[0].shipAdress}
                </span>
              </div>
            </>
          ) : (
            dataAddressUser.map((item, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  checked={item.id === addressUserId}
                  onChange={() => handleOnChange(item.id, index)}
                  type="radio"
                  name="addressRadios"
                  id={`addressRadios${index}`}
                />
                <label className="form-check-label wrap-radio-address" htmlFor={`addressRadios${index}`}>
                  <div className="content-left" style={{ width: "600px" }}>
                    Thông tin:
                    <span className="ml-2">
                      {item.shipName} ({item.shipPhonenumber})
                    </span>
                  </div>
                  <div className="content-center">
                    Địa chỉ nhận hàng:
                    <span className="ml-2">{item.shipAdress}</span>
                  </div>
                </label>
              </div>
            ))
          )}

          <div className="content-right">
            <span className="text-default">Mặc định</span>
            {!isChangeAdress && (
              <span onClick={() => setisChangeAdress(true)} className="text-change">
                Thay đổi
              </span>
            )}
          </div>
        </div>
        {isChangeAdress && (
          <div className="box-action">
            <div onClick={() => setisChangeAdress(false)} className="wrap-back">
              <span>Trở về</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddressSection;
