import React, { useEffect, useState } from "react";
import moment from "moment";

function MessageDisscution(props) {
  const [dataRoom, setdataRoom] = useState([]);
  const [textSearch, settextSearch] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [filterRole, setFilterRole] = useState("User"); // Mặc định là User
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')))
  useEffect(() => {
    if (props.data) {
      loadRoom(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    let filteredRooms = [];
    handleSearchRoom(filteredRooms);
    setRoomList(filteredRooms);
  }, [dataRoom, textSearch, filterRole]); // Lắng nghe thay đổi của filterRole

  let handleClickRoom = (roomId) => {
    props.handleClickRoom(roomId);
  };

  let loadRoom = async (data) => {
    // Sắp xếp danh sách phòng theo số lượng tin nhắn chưa đọc
    data = data.sort((a, b) => {
      let count1 = 0;
      let count2 = 0;
      a.messageData.forEach((item) => {
        if (item.unRead === 1) count1 = count1 + 1;
      });
      b.messageData.forEach((item) => {
        if (item.unRead === 1) count2 = count2 + 1;
      });
      return count2 - count1;
    });
    setdataRoom(data);
  };

  let handleOnchangeSearch = (e) => {
    settextSearch(e.target.value);
  };

  // Xử lý khi chọn lọc Role
  let handleFilterRoleChange = (e) => {
    setFilterRole(e.target.value);
  };

  // Hàm tìm kiếm phòng theo tên người dùng, lọc admin hoặc user
  console.log("dataRoom", dataRoom)
  let handleSearchRoom = (roomList) => {
    dataRoom.forEach((item) => {
      let name = "";
      let role = "";
console.log("item.userOneData", item.userOneData)
      if(!item.userOneData){
        return;
      }

      // Phân biệt dựa vào roleId của từng user
      if (item?.userOneData?.roleId == "R1") {
        name = item.userOneData.lastName;
        role = "Admin";
      } else {
        name = item.userOneData.lastName;
        role = "User";
      }

      // Kiểm tra role theo giá trị filterRole và tên với giá trị tìm kiếm
      if (role == filterRole && name.toLowerCase().includes(textSearch.toLowerCase())) {
        roomList.push({ ...item, displayName: name + " (" + role + ")" });
      }
    });
  };

  return (
    <div className="message-ks-discussions">
      <div className="message-ks-search">
        <div className="message-input-icon icon-right icon icon-lg icon-color-primary">
          <input
            onChange={handleOnchangeSearch}
            value={textSearch}
            id="message-input-group-icon-text"
            type="text"
            className="message-form-control"
            placeholder="Tìm kiếm theo tên"
          />
          <span className="message-icon-addon">
            <span className="message-la la-search" />
          </span>
        </div>
      </div>

      {/* Thêm Select để lọc theo Role */}
      { user.roleId == "R1" &&  <div>
        <select value={filterRole} onChange={handleFilterRoleChange}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>}

      <div
        className="message-ks-body message-ks-scrollable jspScrollable"
        data-auto-height
        style={{
          height: "400px",
          overflowY: "auto",
          padding: "0px",
          width: "339px",
        }}
        tabIndex={0}
      >
        <div
          className="message-jspContainer"
          style={{ width: "339px", height: "550px" }}
        >
          <div
            className="message-jspPane"
            style={{ padding: "0px", top: "0px", width: "329px" }}
          >
            <ul className="message-ks-items">
              {roomList &&
                roomList.length > 0 &&
                roomList.map((item, index) => {
                  let userData = {};
                  let count = 0;

                  // Kiểm tra xem người dùng hiện tại là admin hay user
                  props.isAdmin === true
                    ? (userData = item.userOneData) // Admin
                    : (userData = item.userTwoData); // User

                  // Đếm số tin nhắn chưa đọc
                  item.messageData.forEach((element) => {
                    if (
                      element.unRead === 1 &&
                      element.userId !== props.userId
                    )
                      count = count + 1;
                  });

                  return (
                    <li
                      onClick={() => handleClickRoom(item.id)}
                      key={index}
                      className="message-ks-item"
                    >
                      <span className="message-ks-avatar">
                        <img src={userData.image} width={36} height={36} />
                        <span className="message-badge badge-pill badge-danger message-ks-badge message-ks-notify">
                          {count && count > 0 ? count : ""}
                        </span>
                      </span>
                      <div className="message-ks-body">
                        <div className="message-ks-name">
                          {userData?.lastName}
                          <span className="message-ks-datetime">
                            {item.messageData && item.messageData.length > 0
                              ? moment(
                                item.messageData[item.messageData.length - 1]
                                  .createdAt
                              ).fromNow()
                              : ""}
                          </span>
                        </div>
                        <div className="message-ks-message">
                          {item.messageData && item.messageData.length > 0
                            ? item.messageData[item.messageData.length - 1].text
                            : "Chưa có tin nhắn"}
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageDisscution;
