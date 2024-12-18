import React, { useEffect, useState, useRef } from "react";
import ChatWindow from "./ChatWindow";
import MessageDisscution from "./MessageDisscution";
import "./MessageStyle.scss";
import { createNewRoom, listRoomOfUser } from "../../services/userService";
import socketIOClient from "socket.io-client";
require("dotenv").config();

function MessagePage(props) {
  const [dataRoom, setdataRoom] = useState([]);
  const [selectedRoom, setselectedRoom] = useState("");
  const [dataUser, setdataUser] = useState({});
  const host = process.env.REACT_APP_BACKEND_URL;
  const socketRef = useRef();
  const [id, setId] = useState();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
    const userData = JSON.parse(localStorage.getItem("userData"));
    setdataUser(userData);

    let createRoom = async () => {
      let res = await createNewRoom({
        userId1: userData.id,
      });
      if (res && res.errCode) {
        fetchListRoom(userData.id);
      }
    };

    if (userData) {
      socketRef.current.on("getId", (data) => {
        setId(data);
      }); // Gán id cho mỗi phiên kết nối vào page.

      createRoom();
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

  let handleClickRoom = (roomId) => {
    socketRef.current.emit("loadRoomClient");
    setselectedRoom(roomId);
  };

  let fetchListRoom = async (userId) => {
    let res = await listRoomOfUser(userId);
    if (res && res.errCode === 0) {
      setdataRoom(res.data);
    }
  };

  return (
    <div className="message-container">
      <div>
        <h3>Danh sách tin nhắn</h3>
      </div>
      <div className="message-ks-page-content">
        <div className="message-ks-page-content-body">
          <div className="message-ks-messenger">
            <MessageDisscution
              userId={dataUser.id}
              isAdmin={false}
              handleClickRoom={handleClickRoom}
              data={dataRoom}
            />
            {selectedRoom ? (
              <ChatWindow userId={dataUser.id} roomId={selectedRoom} />
            ) : (
              <div style={{ color: "red", textAlign: "center" }}>
                <span className="message-title">Chưa chọn tin nhắn</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagePage;
