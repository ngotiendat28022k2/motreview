import React from "react";

function ProfileProduct(props) {
  let data = props.data;
  let data1 = props.dataProduct;

  console.log("data", data1);
  return (
    <div className="table-responsive">
      <table className="table">
        <tbody>
          <tr>
            <td>
              <h5>Nhà Xuất Bản</h5>
            </td>
            <td>
              <h5>{data1.madeby}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5>Tác Giả</h5>
            </td>
            <td>
              <h5>{data1.material}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5>Năm Xuất Bản</h5>
            </td>
            <td>
              <h5>{data.width}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5>Ngôn ngữ</h5>
            </td>
            <td>
              <h5>{data.height}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5>Trọng lượng</h5>
            </td>
            <td>
              <h5>{data.weight}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5>Kiểm tra chất lượng</h5>
            </td>
            <td>
              <h5>có</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5>Bảo hành</h5>
            </td>
            <td>
              <h5>có</h5>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfileProduct;
