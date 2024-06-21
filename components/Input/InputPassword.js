import { Input as AntdInput } from "antd";
import styled from "styled-components";

const StyledInputPassword = styled(AntdInput.Password)`
  &.ant-input-password {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
  }
`;

const InputPassword = (props) => {
  return <StyledInputPassword {...props} />;
};

export default InputPassword;
