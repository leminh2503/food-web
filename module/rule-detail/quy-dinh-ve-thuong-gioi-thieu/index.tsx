import "./index.scss";
import {LeftOutlined} from "@ant-design/icons";
import React from "react";
import {useRouter} from "next/router";

export function QuyDinhVeThuongGioiThieu(): JSX.Element {
  const router = useRouter();

  return (
    <div className="container-rule">
      <div className="mb-5">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
      </div>
      <div className="header">
        <h2>QUY ĐỊNH VỀ THƯỞNG CHO NHÂN VIÊN GIỚI THIỆU ỨNG VIÊN </h2>
      </div>
      <div className="content">
        <div>
          <h4>Kính gửi: Toàn thể anh chị em Tinasofters</h4>
          <p>
            Trong quá trình phát triển, công ty luôn tìm kiếm những người có khả
            năng làm việc và cộng tác lâu dài. Tuy nhiên, nguồn tuyển dụng của
            công ty là hữu hạn. Vì vậy, công ty xây dựng chính sách hỗ trợ nhằm
            khuyến khích nhân viên giới thiệu hoặc tìm kiếm những ứng viên tiềm
            năng có thể làm việc và cộng tác lâu dài với công ty. Cụ thể như
            sau:
          </p>
        </div>
        <div>
          <h4>1. Đối tượng giới thiệu ứng viên được nhận thưởng như sau:</h4>
          <ul>
            <li>
              Toàn bộ nhân viên đang làm việc tại công ty (trừ HR của Công ty).
            </li>
          </ul>
        </div>
        <div>
          <h4>
            2. Mức thưởng cho từng vị trí công việc được giới thiệu ứng tuyển
          </h4>
          <ul>
            <li>
              Fresher (&lt;2 năm kinh nghiệm): thưởng 2.000.000 đồng/người.
            </li>
            <li>Junior (2-4 năm kinh nghiệm): thưởng 3.000.000 đồng/người.</li>
            <li>Senior (&gt;4 năm): thưởng 4.000.000 đồng/người.</li>
          </ul>
        </div>
        <div>
          <h4> 3. Hình thức trả thưởng</h4>
          <ul>
            <li>
              Chi trả 100% tiền thưởng bằng tiền mặt sau khi ứng viên kết thúc
              thử việc và trở thành nhân viên chính thức của công ty.
            </li>
          </ul>
        </div>
        <div>
          <p>
            Vậy thông báo đến toàn thể anh chị em Tinasofters được biết, phối
            hợp cùng Phòng HCNS để giới thiệu được những nhân viên ưu tú vào làm
            việc, góp phần vì sự phát triển chung của công ty.
          </p>
        </div>
      </div>
      <div className="footer">
        <h4>12-02-2022</h4>
      </div>
    </div>
  );
}
