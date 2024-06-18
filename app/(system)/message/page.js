"use client";
import { useState } from "react";
import { Breadcrumb, Dropdown } from "antd";
import styled, { css } from "styled-components";
import { MoreOutlined } from "@ant-design/icons";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

import ModalHistory from "./ModalHistory";
import ModalMessageContent from "./ModalMessageContent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-btn-link {
    padding: 0;
    min-width: 0;

    span {
      font-size: 14px;
      font-weight: 400;
      color: #212b36;
      text-decoration: underline;
    }
  }
`;

const Card = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7b8093;
  width: 64px;
  flex-shrink: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0 16px;

  ${(props) =>
    props.justifyContent &&
    css`
      justify-content: ${props.justifyContent};
    `}
`;

const DropdownWrapper = styled.div`
  width: 160px;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
`;

const DropdownItem = styled.div`
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: 0.2s all;

  &:hover {
    background-color: rgba(233, 246, 254, 1);
    color: rgba(23, 119, 255, 1);
  }
`;

const Page = (props) => {
  const [openDropdown, setOpenDropdown] = useState({});
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openModalMessageContent, setOpenModalMessageContent] = useState(false);

  const columns = [
    {
      title: "訂單編號",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "提問時間",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "問題類別",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "提問內容",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "狀態",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "f",
      align: "center",
      render: (text, record) => {
        return (
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "1",
                  label: "歷程查詢",
                },
                {
                  key: "2",
                  label: "回覆訊息內容",
                },
              ],
            }}
            open={openDropdown[record.id]}
            dropdownRender={(menus) => {
              return (
                <DropdownWrapper>
                  {menus.props.items.map((item) => {
                    return (
                      <DropdownItem
                        key={item.key}
                        onClick={() => {
                          setOpenDropdown((state) => ({
                            ...state,
                            [record.id]: false,
                          }));

                          if (item.key === "1") {
                            setOpenModalHistory(true);
                          }

                          if (item.key === "2") {
                            setOpenModalMessageContent(true);
                          }
                        }}
                      >
                        {item.label}
                      </DropdownItem>
                    );
                  })}
                </DropdownWrapper>
              );
            }}
            onOpenChange={(nextOpen, info) => {
              if (info.source === "trigger" || nextOpen) {
                setOpenDropdown((state) => ({
                  ...state,
                  [record.id]: nextOpen,
                }));
              }
            }}
          >
            <Button
              type="link"
              size="large"
              icon={<MoreOutlined style={{ fontSize: 30 }} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  const data = [
    {
      id: 0,
      a: "10124881",
      b: "2024/03/28 17:40:00",
      c: "問題反應/服務品品質",
      d: "購買時有效期限就過期，拿回換貨...",
      e: "未回覆",
      f: "",
    },
    {
      id: 1,
      a: "10124881",
      b: "2024/03/28 17:40:00",
      c: "問題反應/服務品品質",
      d: "購買時有效期限就過期，拿回換貨...",
      e: "未回覆",
      f: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>訊息列表</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "訊息與公告",
            },
            {
              title: "訊息列表",
            },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Card>
          <Row>
            <Item>
              <ItemLabel>問題類別</ItemLabel>
              <Select
                style={{ width: 285 }}
                placeholder="請選擇問題類別"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item>
              <ItemLabel>訂單編號</ItemLabel>
              <Input style={{ width: 285 }} placeholder="輸入ID" />
            </Item>

            <ButtonGroup style={{ marginLeft: "auto" }}>
              <Button type="secondary">查詢</Button>
              <Button type="link">清除查詢條件</Button>
            </ButtonGroup>
          </Row>
        </Card>

        <Table columns={columns} dataSource={data} />
      </Container>

      <ModalHistory
        open={openModalHistory}
        onCancel={() => setOpenModalHistory(false)}
      />

      <ModalMessageContent
        open={openModalMessageContent}
        onCancel={() => setOpenModalMessageContent(false)}
      />
    </>
  );
};

export default Page;
