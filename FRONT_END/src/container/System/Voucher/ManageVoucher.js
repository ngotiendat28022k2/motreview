import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../customize/fetch';
import { deleteVoucherService, getAllVoucher } from '../../../services/userService';
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
const ManageVoucher = () => {

    const [dataVoucher, setdataVoucher] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    useEffect(() => {
        try {
            let fetchData = async () => {
                let arrData = await getAllVoucher({

                    limit: PAGINATION.pagerow,
                    offset: 0

                })
                if (arrData && arrData.errCode === 0) {
                    setdataVoucher(arrData.data)
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                }
            }
            fetchData();
        } catch (error) {
            console.log(error)
        }

    }, [])
    let handleDeleteVoucher = async (id) => {

        let res = await deleteVoucherService({
            data: {
                id: id
            }
        })
        if (res && res.errCode === 0) {
            toast.success("Xóa mã voucher thành công")
            let arrData = await getAllVoucher({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow

            })
            if (arrData && arrData.errCode === 0) {
                setdataVoucher(arrData.data)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }

        } else toast.error("Xóa mã voucher thất bại")
    }
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getAllVoucher({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow

        })
        if (arrData && arrData.errCode === 0) {
            setdataVoucher(arrData.data)

        }
    }
    let handleOnClickExport = async () => {
        let res = await getAllVoucher({

            limit: '',
            offset: '',

        })
        if (res && res.errCode == 0) {
            res.data.forEach(item => {
                item.fromDate = moment.unix(item.fromDate / 1000).format('DD/MM/YYYY')
                item.toDate = moment.unix(item.toDate / 1000).format('DD/MM/YYYY')
            })
            await CommonUtils.exportExcel(res.data, "Danh sách voucher", "ListVoucher")
        }

    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý mã voucher</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách mã voucher
                </div>
                <div className="card-body">
                    <div className='row'>

                        <div className='col-12 mb-2'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã voucher</th>
                                    <th>Loại voucher</th>
                                    <th>Số lượng</th>
                                    <th>Đã sử dụng</th>
                                    <th>Ngày bắt đầu</th>
                                    <th>Ngày kết thúc</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataVoucher && dataVoucher.length > 0 &&
                                    dataVoucher.map((item, index) => {
                                        let name = `${item.typeVoucherOfVoucherData.value} ${item.typeVoucherOfVoucherData.typeVoucherData.value}`
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.codeVoucher}</td>
                                                <td>{name}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.usedAmount}</td>
                                                <td>{moment.unix(item.fromDate / 1000).format('DD/MM/YYYY')}</td>
                                                <td>{moment.unix(item.toDate / 1000).format('DD/MM/YYYY')}</td>
                                                <td>
                                                    <Link to={`/admin/edit-voucher/${item.id}`}>

                                                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'black' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit icon-xs"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>

                                                    </Link>
                                                    &nbsp; &nbsp;
                                                    <span onClick={() => handleDeleteVoucher(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}   >

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather text-danger feather-trash-2 icon-xs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>

                                                    </span>
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
export default ManageVoucher;