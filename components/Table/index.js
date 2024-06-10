import { Pagination, Table as AntdTable } from "antd";
import styled from "styled-components";

const StyledTable = styled(AntdTable)`
  &.ant-table-wrapper .ant-table-thead > tr > th,
  &.ant-table-wrapper .ant-table-tbody > tr > td {
    font-size: 14px;
    font-weight: 400;
    color: #7b8093;
    border-bottom: 1px solid #cccccc;
  }

  &.ant-table-wrapper .ant-table-thead > tr > th {
    background: #f1f4f7;
    padding: 25px 16px;
  }

  &.ant-table-wrapper .ant-table-tbody tr {
    min-height: 80px;
  }
`;

const TableWrapper = styled.div``;

const PaginationWrapper = styled.div`
  margin-top: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .total {
    font-size: 14px;
    font-weight: 400;
    color: #7b8093;
  }
`;

const Table = (props) => {
  const { pagination = true } = props;

  return (
    <TableWrapper>
      <StyledTable pagination={false} {...props} />

      {pagination && (
        <PaginationWrapper>
          <div className="total">共500筆</div>
          <Pagination defaultCurrent={1} total={500} />
        </PaginationWrapper>
      )}
    </TableWrapper>
  );
};

export default Table;
