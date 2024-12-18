import React, { useState, useEffect } from 'react';
import ItemProduct from '../Product/ItemProduct';
import { getAllProductUser } from '../../services/userService';
import { PAGINATION } from '../../utils/constant';
import ReactPaginate from 'react-paginate';
import FormSearch from '../Search/FormSearch';
import './ProductShop.scss';

function ProductShop(props) {
    const [dataProduct, setDataProduct] = useState([]);
    const [count, setCount] = useState(0);
    const [numberPage, setNumberPage] = useState(0);
    const [limitPage, setLimitPage] = useState(PAGINATION.pagerow);
    const [sortPrice, setSortPrice] = useState('');
    const [sortName, setSortName] = useState('');
    const [offset, setOffset] = useState(0);
    const [categoryId, setCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [keyword, setKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword);
        setIsLoading(false);
    }, [sortName, sortPrice, offset, categoryId, keyword]);

    useEffect(() => {
        setCategoryId(props.categoryId);
        setBrandId(props.brandId);
        loadProduct(limitPage, sortName, sortPrice, offset, props.categoryId, keyword);
    }, [props.categoryId, props.brandId]);

    const loadProduct = async (limitPage, sortName, sortPrice, offset, categoryId, keyword) => {
        let arrData = await getAllProductUser({
            sortPrice,
            sortName,
            limit: limitPage,
            offset,
            categoryId,
            brandId,
            keyword,
        });
        if (arrData && arrData.errCode === 0) {
            setDataProduct(arrData.data);
            setCount(Math.ceil(arrData.count / limitPage));
        }
    };

    const handleSelectLimitPage = async (event) => {
        setLimitPage(event.target.value);
        loadProduct(event.target.value, sortName, sortPrice, offset, categoryId, keyword);
    };

    const handleChangePage = async (number) => {
        setNumberPage(number.selected);
        loadProduct(limitPage, sortName, sortPrice, number.selected * limitPage, categoryId, keyword);
        setOffset(number.selected * limitPage);
        if (props.myRef && props.myRef.current) {
            props.myRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSelectSort = async (event) => {
        let value = +event.target.value;
        if (value === 1) {
            loadProduct(limitPage, '', '', offset, categoryId, keyword);
        } else if (value === 2) {
            loadProduct(limitPage, '', true, offset, categoryId, keyword);
            setSortPrice(true);
            setSortName('');
        } else if (value === 3) {
            loadProduct(limitPage, true, '', offset, categoryId, keyword);
            setSortPrice('');
            setSortName(true);
        }
    };

    const handleSearch = (keyword) => {
        loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword);
        setKeyword(keyword);
    };

    const handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword);
            setKeyword(keyword);
        }
    };

    return (
        <div className='container'>
            <div className="col-lg-12 mt-40">
                <div style={{ marginBottom: '10px' }} className={`latest_product_inner ${dataProduct.length === 0 ? 'loading' : ''}`}>
                    {dataProduct.length > 0 ? (
                        <div className="row products_category">
                            {dataProduct.map((item) => (
                                <ItemProduct
                                    key={item.id}
                                    id={item.id}
                                    width={"100%"}
                                    height={"235px"}
                                    type="col-lg-6 col-md-6"
                                    name={item.name}
                                    img={item.productDetail[0].productImage[0].image}
                                    discountPrice={item.productDetail[0].discountPrice}
                                    price={item.productDetail[0].originalPrice}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">Không có sản phẩm</div>
                    )}
                </div>
                {dataProduct.length > 0 && (
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
                )}
            </div>
        </div>
    );
}

export default ProductShop;
