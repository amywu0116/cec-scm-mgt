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

const ModalReturnResult = (props) => {
  const { open, onOk, onCancel } = props;

  const [status, setStatus] = useState(1);

  return (
    <Modal
      title="設定退貨結果"
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
            <ItemLabel>退貨收貨狀態</ItemLabel>
            <Radio.Group
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <Radio value={1}>完成</Radio>
              <Radio value={2}>失敗</Radio>
            </Radio.Group>
          </Item>
        </Row>

        {status === 1 ? (
          <Row>
            <Item>
              <ItemLabel>退貨收貨成功日期</ItemLabel>
              <DatePicker style={{ width: 280 }} placeholder="選擇日期" />
            </Item>
          </Row>
        ) : (
          <Row>
            <Item>
              <ItemLabel>退貨收貨失敗日期</ItemLabel>
              <DatePicker style={{ width: 280 }} placeholder="選擇日期" />
            </Item>
          </Row>
        )}

        {status === 2 && (
          <Row>
            <Item>
              <ItemLabel>失敗原因</ItemLabel>
              <TextArea
                placeholder="請輸入失敗原因"
                autoSize={{ minRows: 3, maxRows: 3 }}
              />
            </Item>
          </Row>
        )}
      </Content>
    </Modal>
  );
};

export default ModalReturnResult;
