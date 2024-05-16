import { Button as AntdButton } from "antd";
import styled from "styled-components";

const StyledButton = styled(AntdButton)`
  &.ant-btn {
    height: 50px;
    font-size: 15px;
    font-weight: 700;
  }
`;

const Button = (props) => {
  return <StyledButton {...props} />;
};

export default Button;
