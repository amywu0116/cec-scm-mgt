import { InputNumber as AntdInputNumber } from "antd";
import styled from "styled-components";

const StyledInputNumber = styled(AntdInputNumber)`
  &.ant-input-number-affix-wrapper {
    width: 100%;
    height: 42px;
    font-size: 14px;
    font-weight: 400;
  }
`;

export default function InputNumber(props) {
  return <StyledInputNumber allowClear {...props} />;
}
