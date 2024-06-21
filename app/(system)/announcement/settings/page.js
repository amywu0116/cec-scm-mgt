"use client";
import { useState } from "react";
import { Breadcrumb, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import styled from "styled-components";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";

import ModalHistory from "./ModalHistory";

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

const Page = () => {
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({});

  const columns = [
    {
      title: "建立時間",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "主題",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "公告內容",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "發送分類",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "備註",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "h",
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
                          setOpenModalHistory(true);
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
      a: "2024/05/01 17:40:00",
      b: "廠商A公告",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "菸酒飲料",
      e: "",
      f: "",
    },
    {
      id: 1,
      a: "2024/04/29 17:40:00",
      b: "廠商B公告",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "可樂",
      e: "新款可樂上架，請踴躍試喝！",
      f: "",
    },
  ];

  console.log("openDropdown", openDropdown);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>公告設定</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "訊息與公告",
            },
            {
              title: "公告設定",
            },
          ]}
        />
      </LayoutHeader>

      <Table columns={columns} dataSource={data} />

      <ModalHistory
        open={openModalHistory}
        onCancel={() => setOpenModalHistory(false)}
      />
    </>
  );
};

export default Page;
