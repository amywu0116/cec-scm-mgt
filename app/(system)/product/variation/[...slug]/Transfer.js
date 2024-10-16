import { Empty, Table as AntdTable } from "antd";
import styled, { css } from "styled-components";

const StyledTable = styled(AntdTable)`
  &.ant-table-wrapper .ant-table-thead > tr > th,
  &.ant-table-wrapper .ant-table-tbody > tr > td {
    font-size: 14px;
    font-weight: 400;
    color: rgba(89, 89, 89, 1);
    border-bottom: 1px solid rgba(204, 204, 204, 1);
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
const TransferList = styled.div`
  height: 358px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const TransferListFooter = styled.div`
  height: 48px;
  background-color: rgba(248, 248, 248, 1);
  border-top: 1px solid rgba(204, 204, 204, 1);
  font-size: 14px;
  font-weight: 400;
  color: rgba(123, 128, 147, 1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TransferListWrapper = styled.div`
  flex: 1;
`;

export default function Transfer(props) {
  const {
    dataSource,
    size = "small",
  } = props;

  return (
    <TransferListWrapper>
      <TransferList>
      <StyledTable
        scroll={{
          x: 400,
          y: 200,
        }}
        pagination={false}
        size={size}
        {...props}
      />
      <TransferListFooter>總筆數：{dataSource.length}</TransferListFooter>
      </TransferList>


    </TransferListWrapper>
  );
}
