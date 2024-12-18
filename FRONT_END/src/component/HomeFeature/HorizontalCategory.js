import React, { useEffect, useState } from "react";
import { getAllCodeService } from "../../services/userService";
import "./HorizontalCategory.scss";

function HorizontalCategory({ handleRecevieDataCategory }) {
  const [arrCategory, setArrCategory] = useState([]);
  const [activeLinkId, setActiveLinkId] = useState("ALL");

  useEffect(() => {
    const fetchCategory = async () => {
      const arrData = await getAllCodeService("CATEGORY");
      if (arrData && arrData.errCode === 0) {
        arrData.data.unshift({
          createdAt: null,
          code: "ALL",
          type: "CATEGORY",
          value: "Tất cả",
        });
        setArrCategory(arrData.data);
        handleRecevieDataCategory("ALL");
      }
    };
    fetchCategory();
  }, []);

  const handleClickCategory = (code) => {
    handleRecevieDataCategory(code);
    setActiveLinkId(code);

    // Khi chọn li, xóa class active từ select bằng cách reset giá trị activeLinkId
    if (code !== "ALL") {
      setActiveLinkId(code);
    }
  };

  const handleSelectChange = (event) => {
    const selectedCode = event.target.value;
    handleRecevieDataCategory(selectedCode);
    setActiveLinkId(selectedCode);
  };

  // Chia danh mục thành 2 phần: 3 danh mục đầu tiên và phần còn lại
  const firstThreeCategories = arrCategory.slice(0, 3);
  const remainingCategories = arrCategory.slice(3);

  return (
    <>
      <div className="container text-center">
        <h1 className="font-weight-bold">Mẫu sách mới</h1>
      </div>
      <div className="horizontal-category container">
        <ul className="category-list">
          {firstThreeCategories.map((item, index) => (
            <li
              key={index}
              className={`category-item ${
                item.code === activeLinkId ? "active" : ""
              }`}
              onClick={() => handleClickCategory(item.code)}
            >
              {item.value}
            </li>
          ))}
          {remainingCategories.length > 0 && (
            <li className="box-select">
              <select
                className={`category-select ${
                  remainingCategories.some((item) => item.code === activeLinkId)
                    ? "active"
                    : ""
                }`}
                value={activeLinkId}
                onChange={handleSelectChange}
              >
                <option>Lựa chọn</option>
                {remainingCategories.map((item, index) => (
                  <option key={index} value={item.code}>
                    {item.value}
                  </option>
                ))}
              </select>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default HorizontalCategory;
