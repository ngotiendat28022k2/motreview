import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { loadMessage } from "../../services/userService";
import moment from "moment";
require("dotenv").config();

const host = process.env.REACT_APP_BACKEND_URL;

function ChatWindow(props) {
  const [mess, setMess] = useState([]);
  const [userData, setuserData] = useState({});
  const [message, setMessage] = useState("");
  const [id, setId] = useState();
  const [user, setUser] = useState({});
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);

    socketRef.current.on("getId", (data) => {
      setId(data);
    });

    if (props.roomId) {
      fetchMessage();
    }

    socketRef.current.on("sendDataServer", (dataGot) => {
      fetchMessage();
      let elem = document.getElementById("message-box-chat");
      if (elem) elem.scrollTop = elem.scrollHeight;
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [props.roomId]);

  let fetchMessage = async () => {
    let res = await loadMessage(props.roomId, props.userId);
    if (res) {
      setMess(res.data);
      setuserData(res.data.userData);
    }
  };

  let sendMessage = () => {
    if (message !== null) {
      const msg = {
        text: message,
        userId: user.id,
        roomId: props.roomId,
        userData: userData,
      };
      socketRef.current.emit("sendDataClient", msg);
      setMessage("");
    }
  };

  return (
    <div className="message-ks-messages message-ks-messenger__messages">
      <div className="message-ks-header">
        <div className="message-ks-description">
          <div className="message-ks-name">Phòng nhắn tin</div>
          <div className="message-ks-amount">2 người</div>
        </div>
        <div className="message-ks-controls">
          <div className="message-dropdown">
            <button
              className="btn btn-primary-outline message-ks-light message-ks-no-text message-ks-no-arrow"
              type="button"
              id="message-dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="la la-ellipsis-h message-ks-icon" />
            </button>
            <div
              className="dropdown-menu dropdown-menu-right message-ks-simple"
              aria-labelledby="message-dropdownMenuButton"
            >
              <a className="dropdown-item" href="#">
                <span className="la la-user-plus message-ks-icon" />
                <span className="message-ks-text">Add members</span>
              </a>
              <a className="dropdown-item" href="#">
                <span className="la la-eye-slash message-ks-icon" />
                <span className="message-ks-text">Mark as unread</span>
              </a>
              <a className="dropdown-item" href="#">
                <span className="la la-bell-slash-o message-ks-icon" />
                <span className="message-ks-text">Mute notifications</span>
              </a>
              <a className="dropdown-item" href="#">
                <span className="la la-mail-forward message-ks-icon" />
                <span className="message-ks-text">Forward</span>
              </a>
              <a className="dropdown-item" href="#">
                <span className="la la-ban message-ks-icon" />
                <span className="message-ks-text">Spam</span>
              </a>
              <a className="dropdown-item" href="#">
                <span className="la la-trash-o message-ks-icon" />
                <span className="message-ks-text">Delete</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className="message-ks-body message-ks-scrollable jspScrollable"
        data-auto-height
        data-reduce-height=".message-ks-footer"
        data-fix-height={32}
        style={{
          height: "480px",
          overflow: "hidden",
          padding: "0px",
          width: "701px",
        }}
        tabIndex={0}
      >
        <div
          className="jspContainer"
          style={{ width: "701px", height: "481px" }}
        >
          <div
            className="jspPane"
            style={{ padding: "0px", top: "0px", width: "691px" }}
          >
            <ul
              id="message-box-chat"
              className="message-ks-items"
              style={{ overflowY: "scroll", maxHeight: "479px" }}
            >
              {mess &&
                mess.length > 0 &&
                mess.map((item, index) => {
                  if (item.userData) {
                    return (
                      <li
                        key={index}
                        className={
                          item.userData.id == user.id
                            ? "message-ks-item message-ks-from"
                            : "message-ks-item message-ks-self"
                        }
                      >
                        {item.userData.image && (
                          <span className="message-ks-avatar message-ks-offline">
                            <img
                              src={item.userData.image}
                              width={36}
                              height={36}
                              className="rounded-circle"
                            />
                          </span>
                        )}
                        <div className="message-ks-body">
                          <div className="message-ks-header">
                            <span className="message-ks-name">
                              {item.userData.lastName}
                            </span>
                            <span className="message-ks-datetime">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <div className="message-ks-message">{item.text}</div>
                        </div>
                      </li>
                    );
                  }
                })}
            </ul>
          </div>
          <div className="jspVerticalBar">
            <div className="jspCap jspCapTop" />
            <div className="jspTrack" style={{ height: "481px" }}>
              <div className="jspDrag" style={{ height: "406px" }}>
                <div className="jspDragTop" />
                <div className="jspDragBottom" />
              </div>
            </div>
            <div className="jspCap jspCapBottom" />
          </div>
        </div>
      </div>
      <div className="message-ks-footer">
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="form-control"
          placeholder="Nhập tin nhắn..."
          defaultValue={""}
        />
        <div className="message-ks-controls">
          <button onClick={() => sendMessage()} className="btn btn-primary">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
