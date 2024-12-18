import React, { useEffect, useState } from 'react';
import { createAllCodeService, getDetailAllcodeById, UpdateAllcodeService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const AddBrand = () => {
    const [isActionADD, setIsActionADD] = useState(true);
    const [inputValues, setInputValues] = useState({
        value: '', code: ''
    });
    const [errors, setErrors] = useState({
        value: '', code: ''
    });
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchDetailCategory = async () => {
                setIsActionADD(false);
                const allcode = await getDetailAllcodeById(id);
                if (allcode && allcode.errCode === 0) {
                    setInputValues({
                        value: allcode.data.value,
                        code: allcode.data.code
                    });
                }
            };
            fetchDetailCategory();
        }
    }, [id]);

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const validateInput = () => {
        const newErrors = {};
        let isValid = true;

        if (!inputValues.value.trim()) {
            newErrors.value = 'Vui lòng nhập tên nhãn hàng';
            isValid = false;
        }

        if (!inputValues.code.trim()) {
            newErrors.code = 'Vui lòng nhập phụ đề';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSaveCategory = async () => {
        if (!validateInput()) return;

        const serviceData = {
            value: inputValues.value,
            code: inputValues.code
        };

        if (isActionADD) {
            serviceData.type = 'BRAND';
            const res = await createAllCodeService(serviceData);

            if (res && res.errCode === 0) {
                toast.success("Thêm nhãn hàng thành công");
                setInputValues({ value: '', code: '' });
            } else {
                toast.error(res?.errMessage || "Thêm nhãn hàng thất bại");
            }
        } else {
            const res = await UpdateAllcodeService({
                ...serviceData,
                id
            });

            if (res && res.errCode === 0) {
                toast.success("Cập nhật nhãn hàng thành công");
            } else {
                toast.error(res?.errMessage || "Cập nhật nhãn hàng thất bại");
            }
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhãn hàng</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD ? 'Thêm mới nhãn hàng' : 'Cập nhật thông tin nhãn hàng'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputValue">Tên nhãn hàng</label>
                                <input
                                    type="text"
                                    value={inputValues.value}
                                    name="value"
                                    onChange={handleOnChange}
                                    className={`form-control ${errors.value ? 'is-invalid' : ''}`}
                                    id="inputValue"
                                />
                                {errors.value && <div className="invalid-feedback">{errors.value}</div>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputCode">Phụ đề</label>
                                <input
                                    type="text"
                                    value={inputValues.code}
                                    name="code"
                                    onChange={handleOnChange}
                                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                    id="inputCode"
                                />
                                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveCategory}
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

export default AddBrand;
