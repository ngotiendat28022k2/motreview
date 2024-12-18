import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllAddressUserByUserIdService, createNewAddressUserrService, deleteAddressUserService, editAddressUserService } from '../../services/userService';
import AddressUsersModal from '../ShopCart/AdressUserModal';
import './AddressUser.scss';

function AddressUser(props) {

    const [dataAddressUser, setdataAddressUser] = useState([]);
    const [addressUserId, setaddressUserId] = useState('');
    const [isOpenModalAddressUser, setisOpenModalAddressUser] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // State để lưu lỗi form

    useEffect(() => {
        let userId = props.id;
        if (userId) {
            const fetchDataAddress = async () => {
                const res = await getAllAddressUserByUserIdService(userId);
                if (res && res.errCode === 0) {
                    setdataAddressUser(res.data);
                }
            };
            fetchDataAddress();
        }
    }, [props.id]);

    const validateForm = (data) => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,11}$/;

        if (!data.shipName) errors.shipName = 'Tên không được để trống';
        if (!data.shipAdress) errors.shipAdress = 'Địa chỉ không được để trống';
        if (!data.shipEmail || !emailRegex.test(data.shipEmail)) errors.shipEmail = 'Email không hợp lệ';
        if (!data.shipPhonenumber || !phoneRegex.test(data.shipPhonenumber)) errors.shipPhonenumber = 'Số điện thoại không hợp lệ';

        return errors;
    };

    const sendDataFromModalAddress = async (data) => {
        const errors = validateForm(data);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setisOpenModalAddressUser(false);
        setaddressUserId('');

        if (data.isActionUpdate === false) {
            const res = await createNewAddressUserrService({
                shipName: data.shipName,
                shipAdress: data.shipAdress,
                shipEmail: data.shipEmail,
                shipPhonenumber: data.shipPhonenumber,
                userId: props.id,
            });
            if (res && res.errCode === 0) {
                toast.success("Thêm địa chỉ thành công!");
                const res = await getAllAddressUserByUserIdService(props.id);
                if (res && res.errCode === 0) {
                    setdataAddressUser(res.data);
                }
            } else {
                toast.error(res.errMessage);
            }
        } else {
            const res = await editAddressUserService({
                id: data.id,
                shipName: data.shipName,
                shipAdress: data.shipAdress,
                shipEmail: data.shipEmail,
                shipPhonenumber: data.shipPhonenumber,
                userId: props.id,
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật địa chỉ thành công!");
                const res = await getAllAddressUserByUserIdService(props.id);
                if (res && res.errCode === 0) {
                    setdataAddressUser(res.data);
                }
            } else {
                toast.error(res.errMessage);
            }
        }
    };

    const closeModaAddressUser = () => {
        setisOpenModalAddressUser(false);
        setaddressUserId('');
        setFormErrors({}); // Reset lỗi khi đóng modal
    };

    const handleOpenAddressUserModal = () => {
        setisOpenModalAddressUser(true);
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
            const res = await deleteAddressUserService({ data: { id } });
            if (res && res.errCode === 0) {
                toast.success("Xóa địa chỉ thành công!");
                const res = await getAllAddressUserByUserIdService(props.id);
                if (res && res.errCode === 0) {
                    setdataAddressUser(res.data);
                }
            } else {
                toast.error("Xóa địa chỉ thất bại");
            }
        }
    };

    const handleEditAddress = (id) => {
        setaddressUserId(id);
        setisOpenModalAddressUser(true);
    };

    return (
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-12 border-right border-left">
                    <div className="box-heading">
                        <div className="content-left">
                            <span>Địa chỉ của tôi</span>
                        </div>
                        <div className="content-right">
                            <div onClick={handleOpenAddressUserModal} className="wrap-add-address">
                                <i className="fas fa-plus"></i>
                                <span>Thêm địa chỉ mới</span>
                            </div>
                        </div>
                    </div>
                    {dataAddressUser && dataAddressUser.length > 0 &&
                        dataAddressUser.map((item, index) => (
                            <div key={index} className="box-address-user">
                                <div className='content-left'>
                                    <div className='box-label'>
                                        <div className='label'>
                                            <div>Họ Và Tên</div>
                                            <div>Số Điện Thoại</div>
                                            <div>Địa Chỉ</div>
                                        </div>
                                        <div className='content'>
                                            <div>{item.shipName}</div>
                                            <div>{item.shipPhonenumber}</div>
                                            <div>{item.shipAdress}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='content-right'>
                                    <span onClick={() => handleEditAddress(item.id)} className='text-underline'>Sửa</span>
                                    <span onClick={() => handleDeleteAddress(item.id)} className='text-underline'>Xóa</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <AddressUsersModal
                addressUserId={addressUserId}
                sendDataFromModalAddress={sendDataFromModalAddress}
                isOpenModal={isOpenModalAddressUser}
                closeModaAddressUser={closeModaAddressUser}
                formErrors={formErrors} // Truyền lỗi form đến modal
            />
        </div>
    );
}

export default AddressUser;
