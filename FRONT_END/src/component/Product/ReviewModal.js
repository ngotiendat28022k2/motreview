import React, { useState } from "react";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from "reactstrap";
import { toast } from "react-toastify";

const ReviewModal = (props) => {
  const [inputValues, setInputValues] = useState({
    content: "",
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleCloseModal = () => {
    props.closeModal();
    setInputValues({ ...inputValues, content: "" });
  };

  const handleSaveInfor = () => {
    if (inputValues.content.trim() === "") {
      toast.error("Nội dung phản hồi không được để trống");
      return;
    }

    setInputValues({ ...inputValues, content: "" });
    props.sendDataFromReViewModal(inputValues.content);
    handleCloseModal();
  };

  return (
    <div className="">
      <Modal
        isOpen={props.isOpenModal}
        className={"booking-modal-container"}
        size="md"
        centered
      >
        <ModalHeader>
          <h5 className="modal-title">Viết phản hồi bình luận</h5>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-12 form-group">
              <label>Phản hồi</label>
              <textarea
                name="content"
                value={inputValues.content}
                onChange={handleOnChange}
                className="form-control"
              ></textarea>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveInfor}>
            Lưu thông tin
          </Button>{" "}
          <Button onClick={handleCloseModal}>Hủy</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ReviewModal;
