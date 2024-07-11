import React from "react";
import { App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import StyledComponentsRegistry from "../lib/registry";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <AntdRegistry>
            <App>{children}</App>
          </AntdRegistry>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
