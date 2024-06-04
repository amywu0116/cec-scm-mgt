import { Layout } from "antd";
import styled from "styled-components";

const StyledLayoutHeader = styled(Layout.Header)`
  &.ant-layout-header {
    padding: 60px 36px 0;
    position: fixed;
    top: 0;
    left: 280px;
    right: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    background-color: #fff;
    height: auto;
    line-height: inherit;
  }
`;

const StyledLayoutHeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #212b36;
  margin-right: 32px;
`;

export const LayoutHeader = (props) => {
  return <StyledLayoutHeader {...props} />;
};

export const LayoutHeaderTitle = (props) => {
  return <StyledLayoutHeaderTitle {...props} />;
};
