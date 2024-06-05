import { DatePicker as AntdDatePicker } from "antd";
import styled from "styled-components";

const StyledDatePicker = styled(AntdDatePicker)`
  &.ant-picker {
    /* min-width: 250px; */
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
  }
`;

const DatePicker = (props) => {
  return <StyledDatePicker {...props} />;
};

export default DatePicker;
