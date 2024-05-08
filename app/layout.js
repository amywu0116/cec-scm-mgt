import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import StyledComponentsRegistry from "../lib/registry";

import "./globals.css";

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <StyledComponentsRegistry>
        <AntdRegistry>{children}</AntdRegistry>
      </StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
