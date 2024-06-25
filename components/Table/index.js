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
  }

  &.ant-table-wrapper .ant-table-tbody tr {
    min-height: 80px;
  }

  &.ant-table-wrapper .ant-table.ant-table-middle .ant-table-cell,
  .ant-table-wrapper .ant-table.ant-table-middle .ant-table-thead > tr > th {
    padding: 25px 16px;
  }

  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell,
  .ant-table-wrapper .ant-table.ant-table-small .ant-table-thead > tr > th {
    padding: 13px 16px;
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
  const {
    pagination = true,
    size = "middle",
    total,
    loading,
    pageSize,
    onChange,
  } = props;

  return (
    <TableWrapper>
      <StyledTable
        size={size}
        pagination={false}
        loading={loading}
        {...props}
      />

      {pagination && (
        <PaginationWrapper>
          <div className="total">共 {total} 筆</div>
          <Pagination
            defaultCurrent={1}
            total={total}
            pageSize={pageSize}
            onChange={onChange}
          />
        </PaginationWrapper>
      )}
    </TableWrapper>
  );
};

export default Table;
