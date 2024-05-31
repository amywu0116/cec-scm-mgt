import { Input as AntdInput } from "antd";
import styled from "styled-components";

const StyledInput = styled(AntdInput)`
  &.ant-input {
    /* min-width: 250px; */
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
  }

  textarea {
    color: red;
  }
`;

const Input = (props) => {
  return <StyledInput {...props} />;
};

export const TextArea = (props) => {
  return <StyledInput.TextArea {...props} />;
};

export default Input;
