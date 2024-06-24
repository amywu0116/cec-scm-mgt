import { useState } from "react";
import { Radio } from "antd";
import styled from "styled-components";

import DatePicker from "@/components/DatePicker";
import Modal from "@/components/Modal";
import TextArea from "@/components/TextArea";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-radio-wrapper {
    width: 104px;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0 32px;
`;

const Item = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7b8093;
  width: 64px;
  flex-shrink: 0;
`;

const UploadWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0 16px;
  cursor: pointer;

  input {
    display: none;
  }
`;

const UploadButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 30px;
  border: 1px solid rgba(145, 158, 171, 0.32);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(33, 43, 54, 1);
`;

const UploadFileName = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: rgba(123, 128, 147, 1);
`;

const ModalReturnApproval = (props) => {
  const { open, onOk, onCancel } = props;

  const [status, setStatus] = useState(1);
  const [fileList, setFileList] = useState([]);

  return (
    <Modal
      title="設定退貨核可"
      okText="確定送出"
      cancelText="取消"
      centered
      closeIcon={false}
      width={800}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{
        disabled: true,
      }}
    >
      <Content>
        <Row>
          <Item>
            <ItemLabel>退貨核可狀態</ItemLabel>
            <Radio.Group
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <Radio value={1}>退貨核可</Radio>
              <Radio value={2}>退貨不核可</Radio>
            </Radio.Group>
          </Item>
        </Row>

        {status === 1 ? (
          <Row>
            <Item>
              <ItemLabel>退貨核可日期</ItemLabel>
              <DatePicker style={{ width: 280 }} placeholder="選擇日期" />
            </Item>
          </Row>
        ) : (
          <Row>
            <Item>
              <ItemLabel>退貨不核可日期</ItemLabel>
              <DatePicker style={{ width: 280 }} placeholder="選擇日期" />
            </Item>
          </Row>
        )}

        {status === 2 && (
          <Row>
            <Item>
              <ItemLabel>不核可原因</ItemLabel>
              <TextArea
                placeholder="請輸入不核可原因"
                autoSize={{ minRows: 3, maxRows: 3 }}
              />
            </Item>
          </Row>
        )}

        {status === 2 && (
          <Row>
            <Item>
              <ItemLabel>上傳圖片</ItemLabel>
              <UploadWrapper for="image_upload">
                <input
                  type="file"
                  id="image_upload"
                  onChange={(e) => setFileList(e.target.files)}
                />
                <UploadButton>選擇檔案</UploadButton>
                <UploadFileName>
                  {fileList.length === 0 ? "未選擇任何檔案" : fileList[0].name}
                </UploadFileName>
              </UploadWrapper>
            </Item>
          </Row>
        )}
      </Content>
    </Modal>
  );
};

export default ModalReturnApproval;
