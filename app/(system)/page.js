"use client";
import { Breadcrumb } from "antd";
import Image from "next/image";
import styled from "styled-components";

import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Page() {
  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>首頁</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[{ title: "家樂福線上商城供應商服務系統" }]}
        />
      </LayoutHeader>

      <Container>
        <Image src="/banner.svg" alt="" width={580} height={453} />
      </Container>
    </>
  );
}
