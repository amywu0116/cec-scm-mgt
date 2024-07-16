"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

Font.register({
  family: "Noto Serif SC",
  src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-serif-sc@latest/chinese-simplified-400-normal.ttf",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Serif SC",
  },
  table: {},
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    borderTop: "2px solid black",
    borderBottom: "2px solid black",
  },
  dataRow: {
    display: "flex",
    flexDirection: "row",
  },
});

const columns = [
  { title: "商品名稱", width: "200px", dataIndex: "a" },
  { title: "售價", width: "200px", dataIndex: "b" },
  { title: "數量", width: "200px", dataIndex: "c" },
  { title: "稅別", width: "200px", dataIndex: "d" },
  { title: "條碼", width: "200px", dataIndex: "e" },
];

const data = [
  {
    a: "1",
    b: "2",
    c: "3",
    d: "4",
    e: "5",
  },
  {
    a: "1",
    b: "2",
    c: "3",
    d: "4",
    e: "5",
  },
  {
    a: "1",
    b: "2",
    c: "3",
    d: "4",
    e: "5",
  },
];

// Create Document Component
export default function MyDocument() {
  return (
    <Container>
      <PDFViewer width="100%" height="100%" frameBorder="0">
        <Document>
          <Page style={styles.page} size="A4">
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                {columns.map((col, idx) => {
                  return (
                    <View
                      key={idx}
                      style={[{ width: col.width, textAlign: "center" }]}
                    >
                      <Text>{col.title}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.tableBody}>
                {data.map((d, idx) => {
                  return (
                    <View key={idx} style={styles.dataRow}>
                      {columns.map((col, idx) => {
                        return (
                          <View key={idx} style={[{ width: col.width }]}>
                            <Text>{d[col.dataIndex]}</Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Container>
  );
}
