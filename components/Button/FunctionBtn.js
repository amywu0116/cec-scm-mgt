import styled, { css } from "styled-components";

const Container = styled.button`
  min-width: 70px;
  padding: 0 10px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(145, 158, 171, 0.32);
  background-color: #fff;
  font-size: 13px;
  font-weight: 700;
  color: rgba(33, 43, 54, 1);
  cursor: pointer;
  transition: 0.2s all;

  &:hover {
    border: 1.5px solid rgba(33, 43, 54, 1);
    background-color: rgba(145, 158, 171, 0.08);
  }

  ${(props) =>
    props.color === "green" &&
    css`
      border: 1px solid rgba(34, 197, 94, 0.48);
      color: rgba(34, 197, 94, 1);

      &:hover {
        border: 1.5px solid rgba(34, 197, 94, 1);
        background-color: rgba(34, 197, 94, 0.08);
      }
    `}

  &[disabled] {
    border: 1px solid rgba(145, 158, 171, 0.2);
    color: rgba(145, 158, 171, 0.8);
    background-color: #fff;
    cursor: not-allowed;
  }
`;

export default function FunctionBtn(props) {
  const { children, color, disabled, onClick } = props;

  return (
    <Container color={color} disabled={disabled} onClick={onClick}>
      {children}
    </Container>
  );
}
