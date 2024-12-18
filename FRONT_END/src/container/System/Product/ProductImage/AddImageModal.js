import React from 'react';
import { useEffect, useState } from 'react';
import CommonUtils from '../../../../utils/CommonUtils';
import moment from 'moment';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Modal, ModalHeader, ModalFooter, ModalBody, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";
import { getProductDetailImageByIdService } from '../../../../services/userService';

const AddImageModal = (props) => {
    const [inputValues, setInputValues] = useState({
        image: '', imageReview: '', caption: '', isOpen: false, isActionUpdate: false, id: ''
    });
    const [errors, setErrors] = useState({
        caption: '',
        image: ''
    });

    useEffect(() => {
        let id = props.productImageId;
        if (id) {
            let fetchProductImage = async () => {
                let res = await getProductDetailImageByIdService(id);
                if (res && res.errCode === 0) {
                    setInputValues({
                        ...inputValues,
                        ["isActionUpdate"]: true,
                        ["caption"]: res.data.caption,
                        ["image"]: res.data.image,
                        ["imageReview"]: res.data.image
                    });
                }
            };
            fetchProductImage();
        }
    }, [props.isOpenModal]);

    const validate = () => {
        let isValid = true;
        let errors = { caption: '', image: '' };

        if (!inputValues.caption.trim()) {
            errors.caption = 'Tên hình ảnh không được để trống';
            isValid = false;
        }

        if (!inputValues.image) {
            errors.image = 'Bạn chưa chọn hình ảnh';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file.size > 31312281) {
            toast.error("Dung lượng file bé hơn 30mb");
        } else {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl });
            setErrors({ ...errors, image: '' }); // Clear image error on valid file selection
        }
    };

    const openPreviewImage = () => {
        if (!inputValues.imageReview) return;
        setInputValues({ ...inputValues, ["isOpen"]: true });
    };

    const handleSendDataFromModal = () => {
        if (validate()) {
            props.sendDataFromModal({
                image: inputValues.image,
                caption: inputValues.caption,
                isActionUpdate: inputValues.isActionUpdate,
                id: props.productImageId
            });
            setInputValues({ ...inputValues, ["image"]: '', ["imageReview"]: '', ["caption"]: '', ["isActionUpdate"]: false });
            setErrors({ caption: '', image: '' }); // Clear errors on successful submission
        }
    };

    const handleCloseModal = () => {
        props.closeModal();
        setInputValues({ ...inputValues, ["image"]: '', ["imageReview"]: '', ["caption"]: '', ["isActionUpdate"]: false });
        setErrors({ caption: '', image: '' }); // Clear errors on modal close
    };

    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'}
                size="md" centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Thêm hình ảnh chi tiết sản phẩm</h5>
                    <button onClick={handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Tên hình ảnh</label>
                            <Input
                                value={inputValues.caption}
                                name="caption"
                                onChange={handleOnChange}
                                type="text"
                                className="form-control"
                                invalid={!!errors.caption}
                            />
                            <FormFeedback>{errors.caption}</FormFeedback>
                        </div>
                        <div className="col-12 form-group">
                            <label>Ảnh hiển thị</label>
                            <div
                                style={{ backgroundImage: `url(${inputValues.imageReview})` }}
                                onClick={openPreviewImage}
                                className="img-review"
                            />
                            {errors.image && <div className="text-danger">{errors.image}</div>}
                        </div>
                        <div className="col-12 form-group">
                            <label>Chọn hình ảnh</label>
                            <Input
                                onChange={handleOnChangeImage}
                                type="file"
                                accept=".jpg,.png"
                                className="form-control form-file"
                                invalid={!!errors.image}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={handleSendDataFromModal}
                    >
                        Lưu thông tin
                    </Button>
                    {' '}
                    <Button onClick={handleCloseModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
            {inputValues.isOpen === true &&
                <Lightbox mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, ["isOpen"]: false })}
                />
            }
        </div >
    );
};

export default AddImageModal;
