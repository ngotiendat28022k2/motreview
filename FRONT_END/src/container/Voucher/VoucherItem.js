import React from "react";

import logoVoucher from "../../../src/resources/img/logoVoucher.png";
import CommonUtils from "../../utils/CommonUtils";
import "./VoucherItem.scss";
function VoucherItem(props) {
  let handleSaveVoucher = () => {
    props.sendDataFromVoucherItem(props.id);
  };

  // console.log("props.typeVoucher", props.typeVoucher);
  return (
    <div>
      <div
        style={{ width: props.width, height: props.height }}
        className="box-voucher"
      >
        <div className="content-left">
          <img src={logoVoucher} style={{ maxWidth: "50px" }}></img>
          <span>{props.name}</span>
        </div>
        <div className="border-center"></div>
        <div className="content-right">
          <div className="box-content-right">
            <span className="name-voucher" style={{ fontSize: "18px" }}>
              Giảm {props.typeVoucher}
            </span>
            <span className="max-value-voucher" style={{ fontSize: "18px" }}>
              Giảm tối đa{" "}
              {props.maxValue.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </span>
            <div className="box-percent">
              <div className="wrap-percent">
                <div
                  style={{ width: `${props.widthPercent}%` }}
                  className="percent"
                ></div>
              </div>
              <span className="used-percent flex" style={{ fontSize: "14px" }}>
                Đã dùng {props.usedAmount}%
              </span>
            </div>
            <button
              onClick={() => handleSaveVoucher()}
              className="btn-voucher"
              style={{ height: "2.5rem", fontSize: "1.3rem" }}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoucherItem;
