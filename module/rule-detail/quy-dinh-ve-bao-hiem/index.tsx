import "./index.scss";
import {LeftOutlined} from "@ant-design/icons";
import React from "react";
import {useRouter} from "next/router";

export function QuyDinhVeBaoHiem(): JSX.Element {
  const router = useRouter();

  return (
    <div className="container">
      <div className="mb-5">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
      </div>
      <div className="header">
        <h2>QUY ĐỊNH VỀ BẢO HIỂM</h2>
      </div>
      <div className="content">
        <div>
          <h4>1. Đối tượng, căn cứ, tỷ lệ đóng</h4>
          <ul>
            <li>Đối tượng tham gia đóng Bảo hiểm: Nhân viên chính thức</li>
            <li>Căn cứ đóng Bảo hiểm: 4,500,000- 5,000,000 đ</li>
          </ul>
        </div>
        <div>
          <h4>2. Người phụ thuộc giảm trừ gia cảnh</h4>
          <ul>
            <li>
              Nhân viên gửi bản chụp/bản photo Sổ hộ khẩu và Sổ Bảo hiểm Xã Hội
              (nếu có) cho Bộ phận HCNS chậm nhất là ngày ký Hợp đồng chính thức
              để đăng ký với cơ quan bảo hiểm.
            </li>
            <li>
              HCNS có trách nhiệm cấp thẻ BHYT, Sổ BHXH cho từng cá nhân sau khi
              có kết quả. (Trường hợp cá nhân muốn nhờ công ty giữ lại sổ thì
              thông báo lại cho HCNS).
            </li>
            <li>
              Sau khi nghỉ việc tại công ty, cá nhân nộp lại sổ BHXH để chốt quá
              trình tham gia bảo hiểm và trả lại sổ cho cá nhân.
            </li>
            <li>
              Trong quá trình tham gia bảo hiểm tại công ty, cá nhân có phát
              sinh ốm đau, thai sản thì nộp lại Giấy ra viện và hóa đơn tài
              chính do bệnh viện cấp hoặc Giấy chứng sinh để HCNS làm thủ tục
              hưởng chế độ thay nhân viên.
            </li>
          </ul>
        </div>
      </div>
      <div className="footer">
        <h4>12-02-2019</h4>
      </div>
    </div>
  );
}
