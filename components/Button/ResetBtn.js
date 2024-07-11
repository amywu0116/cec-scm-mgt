import { Button as AntdButton } from "antd";
import styled from "styled-components";

const StyledButton = styled(AntdButton)`
  &.ant-btn-link {
    padding: 0;
    min-width: 0;

    span {
      font-size: 14px;
      font-weight: 400;
      color: #212b36;
      text-decoration: underline;
    }
  }
`;

export default function ResetBtn(props) {
  return <StyledButton {...props} />;
}
