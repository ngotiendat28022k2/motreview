import React from 'react';
import { useEffect, useState } from 'react';
import { getAllUsers, DeleteUserService } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';

const ManageUser = () => {

    const [dataUser, setdataUser] = useState([]);
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [keyword, setkeyword] = useState('')

    useEffect(() => {
        fetchAllUser(keyword)
    }, [])
    let fetchAllUser = async (keyword) => {
        let res = await getAllUsers({
            limit: PAGINATION.pagerow,
            offset: 0,
            keyword: keyword
        })
        if (res && res.errCode === 0) {

            setdataUser(res.data);
            setCount(Math.ceil(res.count / PAGINATION.pagerow))
        }
    }
    let handleBanUser = async (event, id) => {
        event.preventDefault();
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?");
        if (isConfirmed) {
            let res = await DeleteUserService(id)
            if (res && res.errCode === 0) {
                toast.success("Xóa người dùng thành công")
                let user = await getAllUsers({
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                    keyword: keyword
                })
                if (user && user.errCode === 0) {

                    setdataUser(user.data);
                    setCount(Math.ceil(user.count / PAGINATION.pagerow))
                }
            } else {
                toast.error("Xóa người dùng thất bại")
            }
        }
    }
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getAllUsers({


            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword

        })
        if (arrData && arrData.errCode === 0) {
            setdataUser(arrData.data)

        }
    }
    let handleSearchUser = (keyword) => {
        fetchAllUser(keyword)
        setkeyword(keyword)
    }
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            fetchAllUser(keyword)
            setkeyword(keyword)
        }
    }
    let handleOnClickExport = async () => {
        let res = await getAllUsers({
            limit: '',
            offset: '',
            keyword: ''
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách người dùng", "ListUser")
        }

    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý người dùng</h1>


            <div className="card mb-4">
                <div className="card-header flex justify-content-between">
                    <Link to={'/admin/add-user'} className="btn btn-primary d-flex align-items-center ju">
                        <i className="bi bi-plus fs-5 me-2"></i> Thêm người dùng
                    </Link>
                    <div className='col-8'>
                        <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                    </div>
                </div>

                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"số điện thoại"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchUser} />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Email</th>
                                    <th>Họ và tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Ngày sinh</th>
                                    <th>Giới tính</th>
                                    <th>Quyền</th>
                                    <th className='text-center'>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataUser && dataUser.length > 0 &&
                                    dataUser.map((item, index) => {
                                        let date = moment.unix(item.dob / 1000).format('DD/MM/YYYY')
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.email}</td>
                                                <td>{`${item.firstName} ${item.lastName}`}</td>
                                                <td>{item.phonenumber}</td>
                                                <td>{date}</td>
                                                <td>{item.genderData.value}</td>
                                                <td>{item.roleData.value}</td>
                                                <td className='text-center'>
                                                    <Link to={`/admin/edit-user/${item.id}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'black' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit icon-xs"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>

                                                    </Link>
                                                    &nbsp; &nbsp;
                                                    <a href="#" onClick={(event) => handleBanUser(event, item.id)} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather text-danger feather-trash-2 icon-xs">
                                                            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                                            </path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }



                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ReactPaginate
                previousLabel={'Quay lại'}
                nextLabel={'Tiếp'}
                breakLabel={'...'}
                pageCount={count}
                marginPagesDisplayed={3}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                breakClassName={"page-item"}
                activeClassName={"active"}
                onPageChange={handleChangePage}
            />
        </div>
    )
}
export default ManageUser;