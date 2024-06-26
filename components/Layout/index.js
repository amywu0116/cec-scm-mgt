import { Layout } from "antd";
import styled from "styled-components";

import { useBoundStore } from "@/store";

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
    line-height: 42px;
  }
`;

const StyledLayoutHeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #212b36;
  margin-right: 32px;
`;

const UserInfo = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: rgba(145, 158, 171, 1);
  text-align: right;
  position: absolute;
  top: 10px;
  right: 36px;
`;

export const LayoutHeader = (props) => {
  const { children } = props;

  const user = useBoundStore((state) => state.user);

  return (
    <StyledLayoutHeader {...props}>
      {children}

      <UserInfo>
        {user.account} / {user.name}
      </UserInfo>
    </StyledLayoutHeader>
  );
};

export const LayoutHeaderTitle = (props) => {
  return <StyledLayoutHeaderTitle {...props} />;
};
