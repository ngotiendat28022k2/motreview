import React, { useEffect, useState } from 'react';
import { createAllCodeService, getDetailAllcodeById, UpdateAllcodeService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const AddSubject = () => {
    const [isActionADD, setisActionADD] = useState(true);
    const { id } = useParams();

    const [inputValues, setInputValues] = useState({
        value: '', code: ''
    });

    const [errors, setErrors] = useState({
        value: '', code: ''
    });

    useEffect(() => {
        if (id) {
            let fetchDetailSubject = async () => {
                setisActionADD(false);
                let allcode = await getDetailAllcodeById(id);
                if (allcode && allcode.errCode === 0) {
                    setInputValues({ ...inputValues, value: allcode.data.value, code: allcode.data.code });
                }
            }
            fetchDetailSubject();
        }
    }, [id]);

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error when input changes
    };

    const validate = () => {
        let valid = true;
        let tempErrors = { value: '', code: '' };

        if (!inputValues.value.trim()) {
            tempErrors.value = "Tên chủ đề không được để trống";
            valid = false;
        }

        if (!inputValues.code.trim()) {
            tempErrors.code = "Mã code không được để trống";
            valid = false;
        }

        setErrors(tempErrors);
        return valid;
    };

    const handleSaveSubject = async () => {
        if (!validate()) return; // Only save if valid

        if (isActionADD) {
            let res = await createAllCodeService({
                value: inputValues.value,
                code: inputValues.code,
                type: 'SUBJECT'
            });
            if (res && res.errCode === 0) {
                toast.success("Thêm chủ đề thành công");
                setInputValues({
                    value: '', code: ''
                });
            } else if (res && res.errCode === 2) {
                toast.error(res.errMessage);
            } else {
                toast.error("Thêm chủ đề thất bại");
            }
        } else {
            let res = await UpdateAllcodeService({
                value: inputValues.value,
                code: inputValues.code,
                id: id
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật chủ đề thành công");
            } else if (res && res.errCode === 2) {
                toast.error(res.errMessage);
            } else {
                toast.error("Cập nhật chủ đề thất bại");
            }
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chủ đề</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD ? 'Thêm mới chủ đề' : 'Cập nhật thông tin chủ đề'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputValue">Tên chủ đề</label>
                                <input
                                    type="text"
                                    value={inputValues.value}
                                    name="value"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.value ? 'is-invalid' : ''}`}

                                    id="inputValue"
                                />
                                {errors.value && <small className="form-text text-danger">{errors.value}</small>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputCode">Mã code</label>
                                <input
                                    type="text"
                                    value={inputValues.code}
                                    name="code"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.code ? 'is-invalid' : ''}`}

                                    id="inputCode"
                                />
                                {errors.code && <small className="form-text text-danger">{errors.code}</small>}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveSubject}
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

export default AddSubject;
