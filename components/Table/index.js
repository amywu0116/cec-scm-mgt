import { Table as AntdTable } from "antd";
import styled from "styled-components";

const StyledTable = styled(AntdTable)`
  &.ant-table-wrapper .ant-table-thead > tr > th,
  &.ant-table-wrapper .ant-table-tbody > tr > td {
    font-size: 14px;
    font-weight: 400;
    color: #7b8093;
    border-bottom: 1px solid #cccccc;
  }

  .ant-table-thead tr {
    height: 72px;
  }

  .ant-table-tbody tr {
    height: 80px;
  }
`;

const Table = (props) => {
  return <StyledTable {...props} />;
};

export default Table;
