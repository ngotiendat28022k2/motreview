import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { getProductDetailSizeByIdService } from "../../../../services/userService";
import { useFetchAllcode } from "../../../customize/fetch";

const AddSizeModal = (props) => {
  const { data: dataSize } = useFetchAllcode("SIZE");
  const [inputValues, setInputValues] = useState({
    sizeId: "",
    width: "",
    height: "",
    weight: "",
    isActionUpdate: false,
    id: "",
  });
  const [errors, setErrors] = useState({});

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  useEffect(() => {
    if (dataSize && dataSize.length > 0 && inputValues.sizeId === "") {
      setInputValues((prevValues) => ({
        ...prevValues,
        sizeId: dataSize[0].code,
      }));
    }
  }, [dataSize]);

  useEffect(() => {
    const id = props.productSizeId;
    if (id) {
      const fetchDetailProductSize = async () => {
        const res = await getProductDetailSizeByIdService(id);
        if (res && res.errCode === 0) {
          setInputValues({
            ...inputValues,
            isActionUpdate: true,
            sizeId: res.data.sizeId,
            width: res.data.width,
            height: res.data.height,
            weight: res.data.weight,
            id: res.data.id,
          });
        }
      };
      fetchDetailProductSize();
    }
  }, [props.productSizeId]);

  const validateForm = () => {
    const newErrors = {};
    if (!inputValues.width) newErrors.width = "Vui lòng nhập Năm Xuất Bản.";
    if (!inputValues.height) newErrors.height = "Vui lòng nhập Ngôn ngữ.";
    if (!inputValues.weight) newErrors.weight = "Vui lòng nhập trọng lượng.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveInfor = () => {
    if (validateForm()) {
      props.sendDataFromModalSize({
        sizeId: inputValues.sizeId,
        width: inputValues.width,
        height: inputValues.height,
        weight: inputValues.weight,
        isActionUpdate: inputValues.isActionUpdate,
        id: props.productSizeId,
      });
      setInputValues({
        sizeId: "",
        width: "",
        height: "",
        weight: "",
        isActionUpdate: false,
        id: "",
      });
      props.closeModal();
    }
  };

  const handleCloseModal = () => {
    props.closeModal();
    setInputValues({
      sizeId: "",
      width: "",
      height: "",
      weight: "",
      isActionUpdate: false,
      id: "",
    });
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
          <h5 className="modal-title ">
            {inputValues.isActionUpdate
              ? "Cập Nhật Kích Thước"
              : "Thêm Kích Thước"}
          </h5>
          <button
            onClick={handleCloseModal}
            type="button"
            className="close"
            aria-label="Close"
          >
            X
          </button>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-12 form-group">
              <Label for="sizeId">Phần</Label>
              <Input
                type="select"
                name="sizeId"
                id="sizeId"
                value={inputValues.sizeId}
                onChange={handleOnChange}
                invalid={!!errors.sizeId}
              >
                {dataSize &&
                  dataSize.map((item, index) => (
                    <option key={index} value={item.code}>
                      {item.value}
                    </option>
                  ))}
              </Input>
              {errors.sizeId && <FormFeedback>{errors.sizeId}</FormFeedback>}
            </div>
            <div className="col-12 form-group">
              <Label for="width">Năm Xuất Bản</Label>
              <Input
                type="text"
                name="width"
                id="width"
                value={inputValues.width}
                onChange={handleOnChange}
                invalid={!!errors.width}
              />
              {errors.width && <FormFeedback>{errors.width}</FormFeedback>}
            </div>
            <div className="col-12 form-group">
              <Label for="height">Ngôn ngữ</Label>
              <Input
                type="text"
                name="height"
                id="height"
                value={inputValues.height}
                onChange={handleOnChange}
                invalid={!!errors.height}
              />
              {errors.height && <FormFeedback>{errors.height}</FormFeedback>}
            </div>
            <div className="col-12 form-group">
              <Label for="weight">Trọng lượng</Label>
              <Input
                type="text"
                name="weight"
                id="weight"
                value={inputValues.weight}
                onChange={handleOnChange}
                invalid={!!errors.weight}
              />
              {errors.weight && <FormFeedback>{errors.weight}</FormFeedback>}
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

AddSizeModal.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  sendDataFromModalSize: PropTypes.func.isRequired,
  productSizeId: PropTypes.string,
};

export default AddSizeModal;
