import "./index.scss";
import {LeftOutlined} from "@ant-design/icons";
import React from "react";
import {useRouter} from "next/router";

export function QuyDinhVeThueThuNhapCaNhan(): JSX.Element {
  const router = useRouter();

  return (
    <div className="container">
      <div className="mb-5">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
      </div>
      <div className="header">
        <h2>QUY ĐỊNH VỀ THUẾ THU NHẬP CÁ NHÂN</h2>
      </div>
      <div className="content">
        <div>
          <h4>1. Khấu trừ thuế Thu nhập cá nhân</h4>
          <ul>
            <li>
              Đối với thu nhập trên 11 triệu và không có người giảm trừ gia
              cảnh, hàng tháng sẽ bị khấu trừ thuế TNCN theo biểu tính thuế lũy
              tiến.
            </li>
            <li>
              Cuối kỳ quyết toán thuế: Cá nhân trong 1 năm chỉ có 1 thu nhập tại
              JVB: công ty sẽ quyết toán số thuế nộp thừa/thiếu và trả lại hoặc
              nộp bổ sung.
            </li>
            <li>
              Cuối kỳ quyết toán thuế: Cá nhân trong 1 năm chỉ có 1 thu nhập tại
              JVB: công ty sẽ quyết toán số thuế nộp thừa/thiếu và trả lại hoặc
              nộp bổ sung.
            </li>
            <li>
              Cá nhân trong 1 năm có thu nhập 2 hay nhiều nơi, công ty sẽ cấp
              chứng từ khấu trừ thuế để cá nhân tự quyết toán với cơ quan thuế.
            </li>
            <li>
              Nhân viên chấm dứt hợp đồng làm được dưới 3 tháng hoặc không đạt
              điều kiện để ký Hợp đồng chính thức bị trừ 10% Thuế TNCN/Tổng thu
              nhập.
            </li>
          </ul>
        </div>
        <div>
          <h4>2. Người phụ thuộc giảm trừ gia cảnh</h4>
          <ul>
            <li>
              Các cá nhân nuôi bố mẹ, con nhỏ đủ điều kiện giảm trừ nộp Sổ hộ
              khẩu và Chứng minh thư người phụ thuộc hoặc Giấy khai sinh (đối
              với con dưới 18 tuổi) cho HCNS để làm thủ tục cấp mã số thuế người
              phụ thuộc giảm trừ gia cảnh.
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
