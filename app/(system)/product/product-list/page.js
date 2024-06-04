"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Checkbox, Divider, Pagination, Radio, Tabs } from "antd";
import styled, { css } from "styled-components";
import Link from "next/link";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

const Container = styled.div``;

const Page = () => {
  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>提品申請</LayoutHeaderTitle>
      </LayoutHeader>

      <Container>123</Container>
    </>
  );
};

export default Page;
