import React, { useEffect, useRef, useState } from "react";
import { listRoomOfUser } from "../../services/userService";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { getItemCartStart } from "../../action/ShopCartAction";
import { useDispatch } from "react-redux";
import socketIOClient from "socket.io-client";

const MessageIcon = () => {
  const [user, setUser] = useState({});
  const [quantityMessage, setquantityMessage] = useState("");
  const [id, setId] = useState();
  const dispatch = useDispatch();
  const socketRef = useRef();
  const host = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
    if (userData) {
      dispatch(getItemCartStart(userData.id));
      socketRef.current.on("getId", (data) => {
        setId(data);
      }); // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.
      fetchListRoom(userData.id);

      socketRef.current.on("sendDataServer", (dataGot) => {
        fetchListRoom(userData.id);
      });
      socketRef.current.on("loadRoomServer", (dataGot) => {
        fetchListRoom(userData.id);
      });
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, []);

  let fetchListRoom = async (userId) => {
    let res = await listRoomOfUser(userId);
    if (res && res.errCode == 0) {
      let count = 0;
      if (
        res.data &&
        res.data.length > 0 &&
        res.data[0].messageData &&
        res.data[0].messageData.length > 0
      ) {
        res.data[0].messageData.forEach((item) => {
          if (item.unRead === 1 && item.userId !== userId) count = count + 1;
        });
      }

      setquantityMessage(count);
    }
  };

  return (
    <div>
      <Link to={"/user/messenger"} className="icons">
        <i class="fa-solid fa-message" style={{ fontSize: "60px" }}></i>
        {quantityMessage < 0 && (
          <span
            className="w-100 position-absolute"
            style={{
              top: "-10px",
              left: "45px",
              color: "#333",
              backgroundColor: "#fff",
              textAlign: "center",
              maxWidth: "30px",
              padding: "5px 10px",
              borderRadius: "10px",
            }}
          >
            {quantityMessage}
          </span>
        )}
      </Link>
    </div>
  );
};

export default MessageIcon;
