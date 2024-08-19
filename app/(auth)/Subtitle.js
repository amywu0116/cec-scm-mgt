import styled from "styled-components";

const Container = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #637381;
  margin-bottom: 40px;
`;

export default function Subtitle(props) {
  const { children } = props;
  return <Container>{children}</Container>;
}
