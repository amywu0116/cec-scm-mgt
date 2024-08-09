import { Select as AntdSelect } from "antd";
import styled from "styled-components";

const StyledSelect = styled(AntdSelect)`
  &.ant-select {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
  }
`;

export default function Select(props) {
  return (
    <StyledSelect
      showSearch
      allowClear
      filterOption={(input, option) => {
        return (option?.label ?? "")
          .toLowerCase()
          .includes(input.toLowerCase());
      }}
      {...props}
    />
  );
}
