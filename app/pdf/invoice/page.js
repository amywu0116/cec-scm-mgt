"use client";
import {
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { App } from "antd";
import JsBarcode from "jsbarcode";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import styled from "styled-components";

import api from "@/api";
import { isUAT } from "@/constants";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

Font.register({
  family: "FontFamily",
  src: "/fonts/NotoSansTC-Regular.ttf",
});

Font.registerHyphenationCallback((word) => {
  if (word.length === 1) {
    return [word];
  }

  return Array.from(word)
    .map((char) => [char, ""])
    .reduce((arr, current) => {
      arr.push(...current);
      return arr;
    }, []);
});

const pxToPt = (px) => px * 0.75;

const styles = StyleSheet.create({
  page: {
    fontFamily: "FontFamily",
    fontSize: 10,
    padding: "20px 20px 40px",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 20,
    right: 20,
    color: "#000",
  },
  invoiceWrapper: {
    paddingTop: pxToPt(24),
    paddingHorizontal: pxToPt(18),
    width: pxToPt(273),
    height: pxToPt(431),
    border: "1px solid black",
  },
  logoWrapper: {
    alignItems: "center",
  },
  logo: {
    width: pxToPt(222),
  },
  title: {
    fontSize: pxToPt(33),
    lineHeight: 1,
    alignItems: "center",
    marginBottom: 10,
  },
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  barcode: {
    height: pxToPt(30),
  },
});

export default function MyDocument(props) {
  const { message } = App.useApp();

  const searchParams = useSearchParams();
  const period = searchParams.get("period");
  const accountNo = searchParams.get("accountNo");

  const [isLoaded, setIsLoaded] = useState(false);

  const [info, setInfo] = useState({});
  const [barcode, setBarcode] = useState("");
  const [qrCode1, setQRCode1] = useState("");
  const [qrCode2, setQRCode2] = useState("");

  const fetchInfo = () => {
    const params = {
      period,
      accountNo,
    };

    api
      .get(`v1/scm/report/invoice/download`, { params })
      .then((res) => {
        setInfo(res.data);

        // 處理 barcode
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, res.data.barcode, {
          format: "CODE128",
          displayValue: false,
          width: 1,
          height: 50,
          margin: 0,
        });
        setBarcode(canvas.toDataURL());

        // 處理 QRCode
        QRCode.toDataURL(res.data.invoice_qrcode1).then((data) => {
          setQRCode1(data);
        });
        QRCode.toDataURL(res.data.invoice_qrcode2).then((data) => {
          setQRCode2(data);
        });
      })
      .catch((err) => message.error(err.message))
      .finally(() => {});
  };

  useEffect(() => {
    setIsLoaded(true);
    fetchInfo();
  }, []);

  return (
    <>
      {isLoaded && (
        <Container>
          <PDFViewer width="100%" height="100%" frameBorder="0">
            <Document>
              <Page style={styles.page} size="A4">
                <View style={styles.invoiceWrapper}>
                  <View style={styles.logoWrapper}>
                    <Image style={styles.logo} src="/invoice_logo.png" />
                  </View>

                  {isUAT && (
                    <View>
                      <Text
                        style={{
                          lineHeight: 1,
                          color: "red",
                          textAlign: "center",
                        }}
                      >
                        UAT
                      </Text>
                    </View>
                  )}

                  <View style={styles.title}>
                    <Text>電子發票證明聯</Text>
                    <Text>{info.invoice_date_display}</Text>
                    <Text>{info.invoice_no}</Text>
                  </View>

                  <View>
                    <Text>{info.create_date}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text>隨機碼：{info.random_no}</Text>
                    <Text>總計 ${info.amount}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text>賣方 {info.seller_tax_id}</Text>
                    {info.tax_id && <Text>買方 {info.tax_id}</Text>}
                  </View>

                  <View style={{ marginTop: pxToPt(10) }}>
                    <Image style={styles.barcode} src={barcode} />
                  </View>

                  <View style={styles.row}>
                    <Image src={qrCode1} />
                    <Image src={qrCode2} />
                  </View>

                  <View style={styles.row}>
                    <Text>EC {info.store_code}</Text>
                    <Text>單 {info.order_number}</Text>
                  </View>
                </View>

                <Text
                  style={styles.pageNumber}
                  render={({ pageNumber, totalPages }) =>
                    `頁次 ${pageNumber} / ${totalPages}`
                  }
                  fixed
                />
              </Page>
            </Document>
          </PDFViewer>
        </Container>
      )}
    </>
  );
}
