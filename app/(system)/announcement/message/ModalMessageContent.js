import styled from "styled-components";
import { Checkbox } from "antd";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0 16px;

  .ant-checkbox-wrapper {
    width: 120px;
    align-self: center;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
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
  color: rgba(89, 89, 89, 1);
  width: 64px;
  flex-shrink: 0;
`;

export default function ModalMessageContent(props) {
  const { open, onCancel } = props;

  return (
    <Modal
      title="回覆訊息內容"
      centered
      closeIcon={false}
      width={800}
      open={open}
      onCancel={onCancel}
      footer={(_, { OkBtn, CancelBtn }) => (
        <ButtonGroup>
          <Checkbox onChange={() => {}}>結案</Checkbox>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary">送出回覆</Button>
        </ButtonGroup>
      )}
    >
      <Content>
        <Row>
          <Item>
            <ItemLabel>訂單編號</ItemLabel>
            <Input disabled value="10124881" />
          </Item>

          <Item>
            <ItemLabel>問題類別</ItemLabel>
            <Select
              style={{ width: "100%" }}
              disabled
              options={[
                {
                  value: "lucy",
                  label: "Lucy",
                },
              ]}
            />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>提問內容</ItemLabel>
            <Input disabled value="購買時有效期限就過期，拿回換貨可以找誰？" />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>回覆內容</ItemLabel>
            <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>備註</ItemLabel>
            <TextArea
              placeholder="請輸入備註"
              autoSize={{ minRows: 3, maxRows: 3 }}
            />
          </Item>
        </Row>
      </Content>
    </Modal>
  );
}
