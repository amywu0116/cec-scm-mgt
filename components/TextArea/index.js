import { Input as AntdInput } from "antd";
import styled from "styled-components";

const StyledTextArea = styled(AntdInput.TextArea)`
  &.ant-input {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
  }
`;

export const TextArea = (props) => {
  return <StyledTextArea {...props} />;
};

export default TextArea;
