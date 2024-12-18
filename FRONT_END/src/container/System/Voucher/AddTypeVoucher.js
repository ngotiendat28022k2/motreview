import React, { useEffect, useState } from 'react';
import { createNewTypeVoucherService, getDetailTypeVoucherByIdService, updateTypeVoucherService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useFetchAllcode } from '../../customize/fetch';

const AddTypeVoucher = () => {
    const { data: dataTypeVoucher } = useFetchAllcode('DISCOUNT');
    const [isActionADD, setIsActionADD] = useState(true);
    const { id } = useParams();
    const [inputValues, setInputValues] = useState({
        typeVoucher: '', value: '', maxValue: '', minValue: ''
    });
    const [errors, setErrors] = useState({
        typeVoucher: '',
        value: '',
        minValue: '',
        maxValue: ''
    });

    useEffect(() => {
        if (dataTypeVoucher && dataTypeVoucher.length > 0 && inputValues.typeVoucher === '') {
            setInputValues(prev => ({ ...prev, typeVoucher: dataTypeVoucher[0].code }));
        }
    }, [dataTypeVoucher]);

    useEffect(() => {
        if (id) {
            const fetchDetailTypeVoucher = async () => {
                setIsActionADD(false);
                const typeVoucher = await getDetailTypeVoucherByIdService(id);
                if (typeVoucher && typeVoucher.errCode === 0) {
                    setInputValues({
                        typeVoucher: typeVoucher.data.typeVoucher,
                        value: typeVoucher.data.value,
                        maxValue: typeVoucher.data.maxValue,
                        minValue: typeVoucher.data.minValue
                    });
                }
            };
            fetchDetailTypeVoucher();
        }
    }, [id]);

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues(prev => ({ ...prev, [name]: value }));
    };

    const validateInputs = () => {
        let isValid = true;
        const newErrors = {
            typeVoucher: '',
            value: '',
            minValue: '',
            maxValue: ''
        };

        if (!inputValues.typeVoucher) {
            newErrors.typeVoucher = 'Loại voucher là bắt buộc';
            isValid = false;
        }
        if (!inputValues.value || isNaN(inputValues.value) || inputValues.value <= 0 || inputValues.value > 100) {
            newErrors.value = 'Giá trị là bắt buộc, phải là số từ 1 đến 100';
            isValid = false;
        }
        if (inputValues.minValue === '' || isNaN(inputValues.minValue) || inputValues.minValue <= 0) {
            newErrors.minValue = 'Giá trị tối thiểu là bắt buộc và phải lớn hơn 0';
            isValid = false;
        }
        if (inputValues.maxValue === '' || isNaN(inputValues.maxValue) || inputValues.maxValue <= 0) {
            newErrors.maxValue = 'Giá trị tối đa là bắt buộc và phải lớn hơn 0';
            isValid = false;
        }
        if (parseFloat(inputValues.minValue) >= parseFloat(inputValues.maxValue)) {
            newErrors.maxValue = 'Giá trị tối đa phải lớn hơn giá trị tối thiểu';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSaveTypeVoucher = async () => {
        if (!validateInputs()) return;

        const res = isActionADD
            ? await createNewTypeVoucherService(inputValues)
            : await updateTypeVoucherService({ ...inputValues, id });

        if (res && res.errCode === 0) {
            toast.success(isActionADD ? "Thêm loại voucher thành công" : "Cập nhật loại voucher thành công");
            setInputValues({
                typeVoucher: '',
                value: '',
                maxValue: '',
                minValue: ''
            });
        } else if (res && res.errCode === 2) {
            toast.error(res.errMessage);
        } else {
            toast.error(isActionADD ? "Thêm loại voucher thất bại" : "Cập nhật loại voucher thất bại");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại voucher</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD ? 'Thêm mới loại voucher' : 'Cập nhật thông tin loại voucher'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="typeVoucher">Loại voucher</label>
                                <select value={inputValues.typeVoucher} name="typeVoucher" onChange={handleOnChange} id="typeVoucher" className={`form-control  ${errors.typeVoucher ? 'is-invalid' : ''}`}
                                >
                                    {dataTypeVoucher && dataTypeVoucher.map((item, index) => (
                                        <option key={index} value={item.code}>{item.value}</option>
                                    ))}
                                </select>
                                {errors.typeVoucher && <small className="form-text text-danger">{errors.typeVoucher}</small>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="value">Giá trị (%)</label>
                                <input type="number" min="1" max="100" value={inputValues.value} name="value" onChange={handleOnChange} className={`form-control  ${errors.value ? 'is-invalid' : ''}`}
                                    id="value" />
                                {errors.value && <small className="form-text text-danger">{errors.value}</small>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="minValue">Giá trị tối thiểu</label>
                                <input type="number" min="0" value={inputValues.minValue} name="minValue" onChange={handleOnChange} className={`form-control  ${errors.minValue ? 'is-invalid' : ''}`}
                                    id="minValue" />
                                {errors.minValue && <small className="form-text text-danger">{errors.minValue}</small>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="maxValue">Giá trị tối đa</label>
                                <input type="number" min="0" value={inputValues.maxValue} name="maxValue" onChange={handleOnChange} className={`form-control  ${errors.maxValue ? 'is-invalid' : ''}`}
                                    id="maxValue" />
                                {errors.maxValue && <small className="form-text text-danger">{errors.maxValue}</small>}
                            </div>
                        </div>
                        <button type="button" onClick={handleSaveTypeVoucher} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTypeVoucher;
