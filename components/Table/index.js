import { Pagination, Table as AntdTable } from "antd";
import styled from "styled-components";

const StyledTable = styled(AntdTable)`
  &.ant-table-wrapper .ant-table-thead > tr > th,
  &.ant-table-wrapper .ant-table-tbody > tr > td {
    font-size: 14px;
    font-weight: 400;
    color: rgba(89, 89, 89, 1);
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
    color: rgba(89, 89, 89, 1);
  }
`;

export default function Table(props) {
  const {
    pagination = true,
    size = "small",
    loading,
    onChange,
    showSizeChanger = true,
    pageInfo = {},
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
          <div className="total">共 {pageInfo.total} 筆</div>
          <Pagination
            defaultCurrent={1}
            total={pageInfo.total}
            current={pageInfo.page}
            pageSize={pageInfo.pageSize}
            showSizeChanger={showSizeChanger}
            onChange={onChange}
          />
        </PaginationWrapper>
      )}
    </TableWrapper>
  );
}
