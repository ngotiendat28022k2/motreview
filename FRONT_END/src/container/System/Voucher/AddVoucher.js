import React, { useEffect, useState } from 'react';
import DatePicker from '../../../component/input/DatePicker';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { getSelectTypeVoucher, createNewVoucherService, getDetailVoucherByIdService, updateVoucherService } from '../../../services/userService';
import moment from 'moment';

const AddVoucher = () => {
    const [dataTypeVoucher, setDataTypeVoucher] = useState([]);
    const { id } = useParams();
    const [inputValues, setInputValues] = useState({
        fromDate: '', toDate: '', typeVoucherId: '', amount: '', codeVoucher: '',
        isChangeFromDate: false, isChangeToDate: false, isActionADD: true,
        fromDateUpdate: '', toDateUpdate: ''
    });
    const [errors, setErrors] = useState({
        fromDate: '', toDate: '', typeVoucherId: '', amount: '', codeVoucher: ''
    });

    useEffect(() => {
        const fetchTypeVoucher = async () => {
            const typeVoucherResponse = await getSelectTypeVoucher();
            if (typeVoucherResponse && typeVoucherResponse.errCode === 0) {
                setDataTypeVoucher(typeVoucherResponse.data);
                if (inputValues.typeVoucherId === '' && typeVoucherResponse.data.length > 0) {
                    setInputValues(prev => ({ ...prev, typeVoucherId: typeVoucherResponse.data[0].id }));
                }
            }
        };
        fetchTypeVoucher();

        if (id) {
            const fetchVoucher = async () => {
                const voucherResponse = await getDetailVoucherByIdService(id);
                if (voucherResponse && voucherResponse.errCode === 0) {
                    setStateVoucher(voucherResponse.data);
                }
            };
            fetchVoucher();
        }
    }, [id]);

    const setStateVoucher = (data) => {
        setInputValues({
            ...inputValues,
            fromDate: moment.unix(data.fromDate / 1000).format('DD/MM/YYYY'),
            toDate: moment.unix(data.toDate / 1000).format('DD/MM/YYYY'),
            typeVoucherId: data.typeVoucherId,
            amount: data.amount,
            codeVoucher: data.codeVoucher,
            isActionADD: false,
            fromDateUpdate: data.fromDate,
            toDateUpdate: data.toDate
        });
    };

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValues(prev => ({ ...prev, [name]: value }));
    };

    const handleOnChangeDatePickerFromDate = (date) => {
        const selectedDate = date[0];
        setInputValues(prev => ({
            ...prev,
            fromDate: selectedDate,
            isChangeFromDate: true
        }));
        validateDates(selectedDate, inputValues.toDate);
    };

    const handleOnChangeDatePickerToDate = (date) => {
        const selectedDate = date[0];
        setInputValues(prev => ({
            ...prev,
            toDate: selectedDate,
            isChangeToDate: true
        }));
        validateDates(inputValues.fromDate, selectedDate);
    };

    const validateDates = (fromDate, toDate) => {
        const newErrors = { ...errors };
        if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            newErrors.fromDate = 'Ngày bắt đầu không được lớn hơn ngày kết thúc';
            newErrors.toDate = 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu';
        } else {
            newErrors.fromDate = '';
            newErrors.toDate = '';
        }
        setErrors(newErrors);
    };

    const validateInputs = () => {
        let isValid = true;
        const newErrors = {
            fromDate: '',
            toDate: '',
            typeVoucherId: '',
            amount: '',
            codeVoucher: ''
        };

        if (!inputValues.fromDate) {
            newErrors.fromDate = 'Ngày bắt đầu là bắt buộc';
            isValid = false;
        }
        if (!inputValues.toDate) {
            newErrors.toDate = 'Ngày kết thúc là bắt buộc';
            isValid = false;
        }
        if (!inputValues.typeVoucherId) {
            newErrors.typeVoucherId = 'Loại voucher là bắt buộc';
            isValid = false;
        }
        if (!inputValues.amount || isNaN(inputValues.amount) || inputValues.amount <= 0) {
            newErrors.amount = 'Số lượng mã là bắt buộc và phải lớn hơn 0';
            isValid = false;
        }
        if (!inputValues.codeVoucher) {
            newErrors.codeVoucher = 'Mã voucher là bắt buộc';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSaveInforVoucher = async () => {
        if (!validateInputs()) return;

        const data = {
            fromDate: new Date(inputValues.fromDate).getTime(),
            toDate: new Date(inputValues.toDate).getTime(),
            typeVoucherId: inputValues.typeVoucherId,
            amount: inputValues.amount,
            codeVoucher: inputValues.codeVoucher
        };

        const response = inputValues.isActionADD
            ? await createNewVoucherService(data)
            : await updateVoucherService({
                ...data, id,
                toDate: inputValues.isChangeToDate ? data.toDate : inputValues.toDateUpdate,
                fromDate: inputValues.isChangeFromDate ? data.fromDate : inputValues.fromDateUpdate
            });

        if (response && response.errCode === 0) {
            toast.success(inputValues.isActionADD ? "Tạo mã voucher thành công !" : "Cập nhật voucher thành công !");
            setInputValues({
                fromDate: '',
                toDate: '',
                typeVoucherId: '',
                amount: '',
                codeVoucher: '',
                isChangeFromDate: false,
                isChangeToDate: false
            });
        } else {
            toast.error(response.errMessage || (inputValues.isActionADD ? "Tạo mã voucher thất bại !" : "Cập nhật voucher thất bại !"));
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý mã voucher</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {inputValues.isActionADD ? 'Thêm mới mã voucher' : 'Cập nhật thông tin mã voucher'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="fromDate">Ngày bắt đầu</label>
                                <DatePicker
                                    className={`form-control  ${errors.fromDate ? 'is-invalid' : ''}`}

                                    onChange={handleOnChangeDatePickerFromDate}
                                    value={inputValues.fromDate}
                                />
                                {errors.fromDate && <small className="form-text text-danger">{errors.fromDate}</small>}
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="toDate">Ngày kết thúc</label>
                                <DatePicker
                                    className={`form-control  ${errors.toDate ? 'is-invalid' : ''}`}

                                    onChange={handleOnChangeDatePickerToDate}
                                    value={inputValues.toDate}
                                />
                                {errors.toDate && <small className="form-text text-danger">{errors.toDate}</small>}
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="typeVoucherId">Loại voucher</label>
                                <select
                                    value={inputValues.typeVoucherId}
                                    name="typeVoucherId"
                                    onChange={handleOnChange}
                                    id="typeVoucherId"
                                    className={`form-control  ${errors.typeVoucherId ? 'is-invalid' : ''}`}

                                >
                                    {dataTypeVoucher.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {`${item.value} ${item.typeVoucherData.value}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.typeVoucherId && <small className="form-text text-danger">{errors.typeVoucherId}</small>}
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="amount">Số lượng mã</label>
                                <input
                                    type="number"
                                    value={inputValues.amount}
                                    name="amount"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.amount ? 'is-invalid' : ''}`}

                                    id="amount"
                                />
                                {errors.amount && <small className="form-text text-danger">{errors.amount}</small>}
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="codeVoucher">Mã voucher</label>
                                <input
                                    type="text"
                                    value={inputValues.codeVoucher}
                                    name="codeVoucher"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.codeVoucher ? 'is-invalid' : ''}`}

                                    id="codeVoucher"
                                />
                                {errors.codeVoucher && <small className="form-text text-danger">{errors.codeVoucher}</small>}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSaveInforVoucher}
                        >
                            {inputValues.isActionADD ? 'Thêm mới' : 'Cập nhật'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVoucher;
