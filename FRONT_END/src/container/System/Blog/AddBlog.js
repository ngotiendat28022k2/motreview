import React, { useEffect, useState } from 'react';
import { createNewBlogrService, getDetailBlogByIdService, updateBlogService } from '../../../services/userService';
import CommonUtils from '../../../utils/CommonUtils';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useFetchAllcode } from '../../customize/fetch';

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

const AddBlog = () => {
    const mdParser = new MarkdownIt();
    const { id } = useParams();
    const { data: dataSubject } = useFetchAllcode('SUBJECT');

    const [inputValues, setInputValues] = useState({
        title: '', shortdescription: '', image: '', isActionADD: true, imageReview: '', isOpen: false,
        contentMarkdown: '', contentHTML: '', subjectId: ''
    });

    const [errors, setErrors] = useState({
        title: '', shortdescription: '', image: '', subjectId: '', contentMarkdown: ''
    });

    useEffect(() => {
        if (dataSubject && dataSubject.length > 0 && inputValues.subjectId === '') {
            setInputValues(prev => ({ ...prev, subjectId: dataSubject[0].code }));
        }
    }, [dataSubject, inputValues.subjectId]);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                const res = await getDetailBlogByIdService(id);
                if (res && res.errCode === 0) {
                    setStateBlog(res.data);
                } else {
                    toast.error(res.errMessage || 'Failed to fetch blog details');
                }
            };
            fetchBlog();
        }
    }, [id]);

    const setStateBlog = (data) => {
        setInputValues({
            title: data.title,
            shortdescription: data.shortdescription,
            image: data.image,
            imageReview: data.image,
            isActionADD: false,
            contentMarkdown: data.contentMarkdown,
            contentHTML: data.contentHTML,
            subjectId: data.subjectId
        });
    };

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleOnChangeImage = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setErrors(prev => ({ ...prev, image: "Dung lượng file phải nhỏ hơn 30MB" }));
                return;
            }
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: "Chỉ chấp nhận các định dạng: jpg, png" }));
                return;
            }
            const base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);
            setInputValues(prev => ({ ...prev, image: base64, imageReview: objectUrl }));
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const openPreviewImage = () => {
        if (inputValues.imageReview) {
            setInputValues(prev => ({ ...prev, isOpen: true }));
        }
    };

    const validate = () => {
        let valid = true;
        let tempErrors = { title: '', shortdescription: '', image: '', subjectId: '', contentMarkdown: '' };

        if (!inputValues.title.trim()) {
            tempErrors.title = "Tên bài đăng không được để trống";
            valid = false;
        }

        if (!inputValues.shortdescription.trim()) {
            tempErrors.shortdescription = "Mô tả ngắn không được để trống";
            valid = false;
        }

        if (!inputValues.image) {
            tempErrors.image = "Vui lòng chọn hình ảnh";
            valid = false;
        }

        if (!inputValues.subjectId) {
            tempErrors.subjectId = "Vui lòng chọn chủ đề";
            valid = false;
        }

        if (!inputValues.contentMarkdown.trim()) {
            tempErrors.contentMarkdown = "Nội dung bài đăng không được để trống";
            valid = false;
        }

        setErrors(tempErrors);
        return valid;
    };

    const handleSaveBlog = async () => {
        if (!validate()) return; // Only save if valid

        if (inputValues.isActionADD) {
            const res = await createNewBlogrService({
                shortdescription: inputValues.shortdescription,
                title: inputValues.title,
                subjectId: inputValues.subjectId,
                image: inputValues.image,
                contentMarkdown: inputValues.contentMarkdown,
                contentHTML: inputValues.contentHTML,
                userId: JSON.parse(localStorage.getItem('userData')).id
            });
            if (res && res.errCode === 0) {
                toast.success("Tạo mới bài đăng thành công!");
                setInputValues({
                    title: '', shortdescription: '', image: '', contentMarkdown: '', contentHTML: '',
                    imageReview: '', subjectId: ''
                });
            } else {
                toast.error(res.errMessage || "Tạo mới bài đăng thất bại");
            }
        } else {
            const res = await updateBlogService({
                shortdescription: inputValues.shortdescription,
                title: inputValues.title,
                subjectId: inputValues.subjectId,
                image: inputValues.image,
                contentMarkdown: inputValues.contentMarkdown,
                contentHTML: inputValues.contentHTML,
                id
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật bài đăng thành công!");
            } else {
                toast.error(res.errMessage || "Cập nhật bài đăng thất bại");
            }
        }
    };

    const handleEditorChange = ({ html, text }) => {
        setInputValues(prev => ({
            ...prev,
            contentMarkdown: text,
            contentHTML: html
        }));
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý bài đăng</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {inputValues.isActionADD ? 'Tạo mới bài đăng' : 'Cập nhật thông tin bài đăng'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label htmlFor="inputTitle">Tên bài đăng</label>
                                <input
                                    type="text"
                                    value={inputValues.title}
                                    name="title"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.title ? 'is-invalid' : ''}`}

                                    id="inputTitle"
                                />
                                {errors.title && <small className="form-text text-danger">{errors.title}</small>}
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="inputSubject">Chủ đề</label>
                                <select
                                    value={inputValues.subjectId}
                                    name="subjectId"
                                    onChange={handleOnChange}
                                    id="inputSubject"
                                    className={`form-control  ${errors.subjectId ? 'is-invalid' : ''}`}

                                >
                                    {dataSubject && dataSubject.length > 0 &&
                                        dataSubject.map((item, index) => (
                                            <option key={index} value={item.code}>{item.value}</option>
                                        ))
                                    }
                                </select>
                                {errors.subjectId && <small className="form-text text-danger">{errors.subjectId}</small>}
                            </div>
                            <div className="col-md-3 form-group">
                                <label>Chọn hình ảnh</label>
                                <input
                                    accept=".jpg,.png"
                                    onChange={handleOnChangeImage}
                                    type="file"
                                    className={`form-control form-file" ${errors.image ? 'is-invalid' : ''}`}

                                />
                                {errors.image && <small className="form-text text-danger">{errors.image}</small>}
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="inputImage">Hình ảnh hiển thị</label>
                                <div
                                    style={{ backgroundImage: `url(${inputValues.imageReview})` }}
                                    onClick={openPreviewImage}
                                    className="box-img-preview"
                                ></div>
                            </div>
                            <div className="form-group col-md-12">
                                <label htmlFor="inputShortDescription">Mô tả ngắn</label>
                                <textarea
                                    rows="4"
                                    value={inputValues.shortdescription}
                                    name="shortdescription"
                                    onChange={handleOnChange}
                                    className={`form-control  ${errors.shortdescription ? 'is-invalid' : ''}`}

                                    id="inputShortDescription"
                                ></textarea>
                                {errors.shortdescription && <small className="form-text text-danger">{errors.shortdescription}</small>}
                            </div>
                            <div className="form-group col-md-12">
                                <label htmlFor="inputContent">Nội dung bài đăng</label>
                                <MdEditor
                                    style={{ height: '400px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={handleEditorChange}
                                    value={inputValues.contentMarkdown}
                                />
                                {errors.contentMarkdown && <small className="form-text text-danger">{errors.contentMarkdown}</small>}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveBlog}
                            className="btn btn-primary"
                        >
                            {inputValues.isActionADD ? 'Tạo mới' : 'Cập nhật'}
                        </button>
                    </form>
                </div>
            </div>

            {inputValues.isOpen && (
                <Lightbox
                    mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues(prev => ({ ...prev, isOpen: false }))}
                />
            )}
        </div>
    );
};

export default AddBlog;
