import styled from "styled-components";

const Container = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #212b36;
  margin-bottom: 40px;
`;

const Title = (props) => {
  const { children } = props;
  return <Container>{children}</Container>;
};

export default Title;
