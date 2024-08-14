import { Tabs as AntdTabs } from "antd";
import styled from "styled-components";

const StyledTabs = styled(AntdTabs)`
  &.ant-tabs-top > .ant-tabs-nav {
    margin-bottom: 0;
  }

  &.ant-tabs .ant-tabs-tab {
    padding: 12px 48px;
  }

  &.ant-tabs .ant-tabs-tab + .ant-tabs-tab {
    margin: 0;
  }

  &.ant-tabs .ant-tabs-tab {
    font-size: 14px;
    font-weight: 700;
    color: rgba(89, 89, 89, 1);
  }
`;

export default function Tabs(props) {
  return <StyledTabs {...props} />;
}
