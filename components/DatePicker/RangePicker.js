import { DatePicker as AntdDatePicker } from "antd";
import styled from "styled-components";

const StyledRangePicker = styled(AntdDatePicker.RangePicker)`
  &.ant-picker {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
  }
`;

const RangePicker = (props) => {
  return <StyledRangePicker {...props} />;
};

export default RangePicker;
