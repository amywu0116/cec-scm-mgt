import { Empty } from "antd";
import styled, { css } from "styled-components";

const TransferList = styled.div`
  height: 358px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const TransferListHeader = styled.div`
  height: 48px;
  display: flex;
  padding: 10px 16px;
  background-color: rgba(241, 244, 247, 1);
  border-bottom: 1px solid rgba(204, 204, 204, 1);

  > div {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: rgba(123, 128, 147, 1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const TransferListBody = styled.div`
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px 0;
  background-color: rgba(248, 248, 248, 1);
  overflow-y: scroll;
`;

const TransferItem = styled.div`
  position: relative;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  display: flex;

  ${(props) =>
    props.$isSelected &&
    css`
      background-color: rgba(255, 255, 232, 1);

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        width: 14px;
        height: 10px;
        background-image: url("/check.svg");
        background-size: cover;
      }
    `}

  > div {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: rgba(123, 128, 147, 1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
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

const TransferListTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: rgba(86, 101, 155, 1);
`;

const TransferListWrapper = styled.div`
  flex: 1;
`;

export default function Transfer(props) {
  const {
    title,
    columns,
    dataSource,
    selectedKey,
    selectedList,
    setSelectedList,
  } = props;

  const handleSelected = (key) => {
    setSelectedList((prevList) => {
      if (selectedList.includes(key)) {
        return prevList.filter((item) => item !== key);
      } else {
        return [...prevList, key];
      }
    });
  };

  return (
    <TransferListWrapper>
      <TransferListTitle>{title}</TransferListTitle>
      <TransferList>
        <TransferListHeader>
          {columns.map((col, idx) => {
            return <div key={idx}>{col.title}</div>;
          })}
        </TransferListHeader>

        <TransferListBody>
          {dataSource.length === 0 ? (
            <Empty
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            />
          ) : (
            dataSource.map((d, dIdx) => {
              return (
                <TransferItem
                  key={dIdx}
                  $isSelected={selectedList.includes(d[selectedKey])}
                  onClick={() => handleSelected(d[selectedKey])}
                >
                  {columns.map((col, colIdx) => {
                    return <div key={colIdx}>{d[col.dataIndex]}</div>;
                  })}
                </TransferItem>
              );
            })
          )}
        </TransferListBody>

        <TransferListFooter>總筆數：{dataSource.length}</TransferListFooter>
      </TransferList>
    </TransferListWrapper>
  );
}
