import React from "react";
import "./Footer.scss";

function Footer(props) {
  return (
    <footer className="footer">
      <div className="footer-content container">
        {/* Kết nối mạng xã hội */}
        <div className="footer-section">
          <h2 style={{ marginLeft: "10px" }}>Kết Nối Với Chúng Tôi</h2>
          <ul className="flex">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  style={{
                    fontSize: "30px",
                    color: "#345457",
                    margin: "0px 10px",
                  }}
                  className="bi bi-instagram"
                ></i>
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  style={{
                    fontSize: "30px",
                    color: "#345457",
                    margin: "0px 10px",
                  }}
                  className="bi bi-youtube"
                ></i>
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  style={{
                    fontSize: "30px",
                    color: "#345457",
                    margin: "0px 10px",
                  }}
                  className="bi bi-facebook"
                ></i>
              </a>
            </li>
          </ul>
        </div>

        {/* Danh mục sách */}
        <div className="footer-section">
          <h2>Danh Mục Sách</h2>
          <ul>
            <li>
              <a href="/books/fiction">Sách Văn Học</a>
            </li>
            <li>
              <a href="/books/science">Sách Khoa Học</a>
            </li>
            <li>
              <a href="/books/business">Sách Kinh Doanh</a>
            </li>
            <li>
              <a href="/books/children">Sách Thiếu Nhi</a>
            </li>
            <li>
              <a href="/books/education">Sách Giáo Dục</a>
            </li>
          </ul>
        </div>

        {/* Công cụ hỗ trợ */}
        <div className="footer-section">
          <h2>Công Cụ Hỗ Trợ</h2>
          <ul>
            <li>
              <a href="/search">Tìm Kiếm Sách</a>
            </li>
            <li>
              <a href="/recommendations">Gợi Ý Sách</a>
            </li>
            <li>
              <a href="/gift-cards">Thẻ Quà Tặng</a>
            </li>
          </ul>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div className="footer-section">
          <h2>Hỗ Trợ Khách Hàng</h2>
          <ul>
            <li>
              <a href="/contact">Liên Hệ Với Chúng Tôi</a>
            </li>
            <li>
              <a href="/faqs">Câu Hỏi Thường Gặp</a>
            </li>
            <li>
              <a href="/shipping-policy">Chính Sách Giao Hàng</a>
            </li>
            <li>
              <a href="/return-policy">Chính Sách Đổi Trả</a>
            </li>
          </ul>
        </div>

        {/* Thông tin về đại lý và liên hệ */}
        <div className="footer-section">
          <h2>Thông Tin Liên Hệ</h2>
          <ul>
            <li>Địa chỉ: 123 Đường Sách</li>
            <li>
              Phone:
              <a style={{ display: "inline-block" }} href="tel:0123456789">
                0123 456 789
              </a>
            </li>
            <li>
              Email:{" "}
              <a href="mailto:hotro@cuahangsach.vn">hotro@cuahangsach.vn</a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="footer-content container flex justify-content-center"
        style={{ gap: "70px", marginTop: "40px", marginBottom: "30px" }}
      >
        <img
          style={{ width: "150px" }}
          src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/icon_snappy1.png"
          alt="Logo Đối Tác 1"
        />
        <img
          style={{ width: "150px" }}
          src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/logo_lex.jpg"
          alt="Logo Đối Tác 1"
        />
        <img
          style={{ width: "150px" }}
          src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/ahamove_logo3.png"
          alt="Logo Đối Tác 1"
        />
        <img
          style={{ width: "150px" }}
          src="https://cdn0.fahasa.com/media//wysiwyg/Logo-NCC/vnpay_logo.png"
          alt="Logo Đối Tác 2"
        />
        <img
          style={{ width: "150px" }}
          src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/vnpost1.png"
          alt="Logo Đối Tác 3"
        />
      </div>

      {/* Phần cuối */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Cửa Hàng Sách. Mọt Review.</p>
      </div>
    </footer>
  );
}

export default Footer;
