import React from 'react';
import { useEffect, useState } from 'react';
import { createNewSupplierService, getDetailSupplierByIdService, updateSupplierService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const AddSupplier = (props) => {
    const [isActionADD, setisActionADD] = useState(true);
    const { id } = useParams();
    const [inputValues, setInputValues] = useState({
        name: '', address: '', phonenumber: '', email: ''
    });
    const [errors, setErrors] = useState({
        name: '', address: '', phonenumber: '', email: ''
    });

    useEffect(() => {
        if (id) {
            let fetchDetailSupplier = async () => {
                setisActionADD(false);
                let supplier = await getDetailSupplierByIdService(id);
                if (supplier && supplier.errCode === 0) {
                    setInputValues({
                        name: supplier.data.name,
                        address: supplier.data.address,
                        phonenumber: supplier.data.phonenumber,
                        email: supplier.data.email
                    });
                }
            };
            fetchDetailSupplier();
        }
    }, [id]);

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error message on input change
    };

    const validate = () => {
        let valid = true;
        const newErrors = {};

        // Regular expressions for validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/; // Assuming a 10-15 digit phone number

        if (!inputValues.name.trim()) {
            newErrors.name = 'Tên nhà cung cấp không được để trống';
            valid = false;
        }
        if (!inputValues.address.trim()) {
            newErrors.address = 'Địa chỉ không được để trống';
            valid = false;
        }
        if (!inputValues.email.trim()) {
            newErrors.email = 'Địa chỉ email không được để trống';
            valid = false;
        } else if (!emailRegex.test(inputValues.email)) {
            newErrors.email = 'Địa chỉ email không hợp lệ';
            valid = false;
        }
        if (!inputValues.phonenumber.trim()) {
            newErrors.phonenumber = 'Số điện thoại không được để trống';
            valid = false;
        } else if (!phoneRegex.test(inputValues.phonenumber)) {
            newErrors.phonenumber = 'Số điện thoại không hợp lệ';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSaveSupplier = async () => {
        if (validate()) {
            if (isActionADD) {
                let res = await createNewSupplierService({
                    name: inputValues.name,
                    address: inputValues.address,
                    email: inputValues.email,
                    phonenumber: inputValues.phonenumber,
                });
                if (res && res.errCode === 0) {
                    toast.success("Thêm nhà cung cấp thành công");
                    setInputValues({
                        name: '',
                        address: '',
                        email: '',
                        phonenumber: ''
                    });
                } else if (res && res.errCode === 2) {
                    toast.error(res.errMessage);
                } else {
                    toast.error("Thêm nhà cung cấp thất bại");
                }
            } else {
                let res = await updateSupplierService({
                    name: inputValues.name,
                    address: inputValues.address,
                    email: inputValues.email,
                    phonenumber: inputValues.phonenumber,
                    id: id
                });
                if (res && res.errCode === 0) {
                    toast.success("Cập nhật nhà cung cấp thành công");
                } else if (res && res.errCode === 2) {
                    toast.error(res.errMessage);
                } else {
                    toast.error("Cập nhật nhà cung cấp thất bại");
                }
            }
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhà cung cấp</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD ? 'Thêm mới nhà cung cấp' : 'Cập nhật thông tin nhà cung cấp'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="name">Tên nhà cung cấp</label>
                                <input
                                    type="text"
                                    value={inputValues.name}
                                    name="name"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.name ? 'is-invalid' : ''}`}

                                    id="name"
                                />
                                {errors.name && <small className="text-danger">{errors.name}</small>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="email">Địa chỉ email</label>
                                <input
                                    type="text"
                                    value={inputValues.email}
                                    name="email"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.email ? 'is-invalid' : ''}`}

                                    id="email"
                                />
                                {errors.email && <small className="text-danger">{errors.email}</small>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="address">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={inputValues.address}
                                    name="address"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.address ? 'is-invalid' : ''}`}

                                    id="address"
                                />
                                {errors.address && <small className="text-danger">{errors.address}</small>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="phonenumber">Số điện thoại</label>
                                <input
                                    type="text"
                                    value={inputValues.phonenumber}
                                    name="phonenumber"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.phonenumber ? 'is-invalid' : ''}`}

                                    id="phonenumber"
                                />
                                {errors.phonenumber && <small className="text-danger">{errors.phonenumber}</small>}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveSupplier}
                            className="btn btn-primary"
                        >
                            Lưu thông tin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSupplier;
