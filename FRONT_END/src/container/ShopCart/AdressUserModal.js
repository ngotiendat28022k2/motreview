import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from "reactstrap";
import { getDetailAddressUserByIdService } from "../../services/userService";

const AddressUsersModal = (props) => {
  const [inputValues, setInputValues] = useState({
    shipName: "",
    shipAdress: "",
    shipEmail: "",
    shipPhonenumber: "",
    isActionUpdate: false,
  });

  useEffect(() => {
    const id = props.addressUserId;
    if (id) {
      const fetchDetailAddress = async () => {
        const res = await getDetailAddressUserByIdService(id);
        if (res && res.errCode === 0) {
          setInputValues((prevValues) => ({
            ...prevValues,
            isActionUpdate: true,
            shipName: res.data?.shipName,
            shipAdress: res.data.shipAdress,
            shipEmail: res.data.shipEmail,
            shipPhonenumber: res.data.shipPhonenumber,
          }));
        }
      };
      fetchDetailAddress();
    } else {
      setInputValues({
        shipName: "",
        shipAdress: "",
        shipEmail: "",
        shipPhonenumber: "",
        isActionUpdate: false,
      });
    }
  }, [props.addressUserId]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleCloseModal = () => {
    props.closeModaAddressUser();
  };

  const handleSaveInfor = () => {
    const errors = validateAddressData(inputValues);
    if (Object.keys(errors).length) {
      props.sendDataFromModalAddress({
        ...inputValues,
        errors,
      });
      return;
    }

    props.sendDataFromModalAddress({
      shipName: inputValues.shipName,
      shipAdress: inputValues.shipAdress,
      shipEmail: inputValues.shipEmail,
      shipPhonenumber: inputValues.shipPhonenumber,
      id: props.addressUserId,
      isActionUpdate: inputValues.isActionUpdate,
    });
    setInputValues({
      shipName: "",
      shipAdress: "",
      shipEmail: "",
      shipPhonenumber: "",
      isActionUpdate: false,
    });
  };

  const validateAddressData = (data) => {
    const errors = {};
    if (!data.shipName) errors.shipName = "Họ và tên là bắt buộc";
    if (!data.shipPhonenumber)
      errors.shipPhonenumber = "Số điện thoại là bắt buộc";
    if (!data.shipEmail) errors.shipEmail = "Email là bắt buộc";
    if (!data.shipAdress) errors.shipAdress = "Địa chỉ là bắt buộc";
    return errors;
  };

  const formErrors = props.formErrors || {}; // Đảm bảo formErrors không bị undefined

  return (
    <div>
      <Modal
        isOpen={props.isOpenModal}
        className={"booking-modal-container"}
        size="md"
        centered
      >
        <ModalHeader>
          <h5 className="modal-title">Địa chỉ mới</h5>
          <button
            onClick={handleCloseModal}
            type="button"
            className="btn btn-time"
            aria-label="Close"
          >
            X
          </button>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label>Họ và tên</label>
              <input
                value={inputValues?.shipName}
                name="shipName"
                onChange={handleOnChange}
                type="text"
                className="form-control"
              />
              {formErrors.shipName && (
                <div className="error  text-danger">{formErrors.shipName}</div>
              )}
            </div>
            <div className="col-6 form-group">
              <label>Số điện thoại</label>
              <input
                value={inputValues.shipPhonenumber}
                name="shipPhonenumber"
                onChange={handleOnChange}
                type="text"
                className="form-control"
              />
              {formErrors.shipPhonenumber && (
                <div className="error  text-danger">
                  {formErrors.shipPhonenumber}
                </div>
              )}
            </div>
            <div className="col-12 form-group">
              <label>Email</label>
              <input
                value={inputValues.shipEmail}
                name="shipEmail"
                onChange={handleOnChange}
                type="text"
                className="form-control"
              />
              {formErrors.shipEmail && (
                <div className="error  text-danger">{formErrors.shipEmail}</div>
              )}
            </div>
            <div className="col-12 form-group">
              <label>Địa chỉ cụ thể</label>
              <input
                value={inputValues.shipAdress}
                name="shipAdress"
                onChange={handleOnChange}
                type="text"
                className="form-control"
              />
              {formErrors.shipAdress && (
                <div className="error text-danger">{formErrors.shipAdress}</div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveInfor}>
            Lưu thông tin
          </Button>
          <Button onClick={handleCloseModal}>Hủy</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddressUsersModal;
