import { Input as AntdInput } from "antd";
import styled from "styled-components";

const StyledInput = styled(AntdInput)`
  &.ant-input {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
  }
`;

const Input = (props) => {
  return <StyledInput {...props} />;
};

export default Input;
