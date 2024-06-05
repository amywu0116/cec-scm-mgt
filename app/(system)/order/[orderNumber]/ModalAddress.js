import { Radio } from "antd";
import styled from "styled-components";

import Modal from "@/components/Modal";
import Select from "@/components/Select";
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

const ModalAddress = (props) => {
  const { open, onOk, onCancel } = props;

  return (
    <Modal
      title="修改配送地址"
      okText="保存"
      cancelText="取消"
      centered
      closeIcon={false}
      width={800}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Content>
        <Row style={{ height: 42 }}>
          <Item>
            <ItemLabel>縣市</ItemLabel>
            <Select
              style={{ width: 150 }}
              options={[
                {
                  value: "lucy",
                  label: "Lucy",
                },
              ]}
            />
          </Item>

          <Item>
            <ItemLabel>郵遞區號</ItemLabel>
            <Select
              style={{ width: 150 }}
              options={[
                {
                  value: "lucy",
                  label: "Lucy",
                },
              ]}
            />
          </Item>

          <Item>
            <ItemLabel>區</ItemLabel>
            <Select
              style={{ width: 150 }}
              options={[
                {
                  value: "lucy",
                  label: "Lucy",
                },
              ]}
            />
          </Item>
        </Row>

        <Row style={{ height: 84 }}>
          <Item>
            <ItemLabel>路</ItemLabel>
            <TextArea rows={6} autoSize={{ minRows: 3, maxRows: 3 }} />
          </Item>

          <Item>
            <ItemLabel>地址備註</ItemLabel>
            <TextArea rows={6} autoSize={{ minRows: 3, maxRows: 3 }} />
          </Item>
        </Row>

        <Row style={{ height: 42 }}>
          <Item>
            <ItemLabel>電話</ItemLabel>
            <Radio.Group>
              <Radio value={1}>無</Radio>
              <Radio value={2}>有</Radio>
            </Radio.Group>
          </Item>
        </Row>

        <Row style={{ height: 42 }}>
          <Item>
            <ItemLabel>簽收</ItemLabel>
            <Radio.Group>
              <Radio value={1}>本人簽收</Radio>
              <Radio value={2}>公司簽收</Radio>
              <Radio value={3}>管理室簽收</Radio>
            </Radio.Group>
          </Item>
        </Row>
      </Content>
    </Modal>
  );
};

export default ModalAddress;
