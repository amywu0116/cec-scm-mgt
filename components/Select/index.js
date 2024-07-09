import { Select as AntdSelect } from "antd";
import styled from "styled-components";

const StyledSelect = styled(AntdSelect)`
  &.ant-select {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
  }
`;

const Select = (props) => {
  return <StyledSelect showSearch allowClear {...props} />;
};

export default Select;
