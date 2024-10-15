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
import { useEffect, useState } from "react";
import styled from "styled-components";

import Table from "./Table";

import api from "@/api";
import { numWithCommas } from "@/utils/formatted";
import { isValidEAN13 } from "@/utils/validate";

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
  delivery: {},
  deliveryText: {
    width: "50px",
    textAlign: "center",
    padding: "4px",
    border: "1px solid #000",
  },
  totalQty: {
    marginLeft: "auto",
  },
  checkout: {
    flex: 2,
  },
  checkoutRow: {
    display: "flex",
    flexDirection: "row",
    textAlign: "right",
  },
  label: {
    backgroundColor: "#eee",
    padding: 2,
    textAlign: "center",
  },
  titleSection: {
    flex: 1,
    textAlign: "center",
  },
  checkoutSection: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
  },
  promotionSection: {
    marginTop: 30,
  },
  notificationSection: {
    marginTop: 30,
  },
  notification: {
    fontSize: 8,
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: "5px 0",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    fontSize: 8,
    position: "relative",
    marginTop: 5,
  },
  websiteWrapper: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
  },
  borderOuter: {
    borderTop: "0.5px solid #000",
    paddingTop: 1,
  },
  borderInner: {
    borderTop: "0.5px solid #000",
  },
});

export default function MyDocument(props) {
  const { message } = App.useApp();
  const { params } = props;
  const ecorderShipId = params.ecorderShipId;

  const [isLoaded, setIsLoaded] = useState(false);
  const [info, setInfo] = useState({});

  const itemColumns = [
    {
      title: "商品名稱",
      width: "300px",
      dataIndex: "productName",
      render: (text, record, index) => {
        return (
          <View>
            <Text>{record.productNumber ?? "-"}</Text>
            <Text>{record.itemName ?? "-"}</Text>
            <Text>{record.itemSpec ?? "-"}</Text>
          </View>
        );
      },
    },
    {
      title: "活動",
      width: "200px",
      dataIndex: "promotion",
      align: "center",
      render: (text, record, index) => {
        return <Text>{text ?? "-"}</Text>;
      },
    },
    {
      title: "折扣前售價",
      width: "200px",
      dataIndex: "price",
      align: "center",
      render: (text, record, index) => {
        return <Text>{text ? numWithCommas(text) : "-"}</Text>;
      },
    },
    {
      title: "數量",
      width: "200px",
      dataIndex: "qty",
      align: "center",
      render: (text, record, index) => {
        return <Text>{text ?? "-"}</Text>;
      },
    },
    {
      title: "稅別",
      width: "200px",
      dataIndex: "tax",
      align: "center",
      render: (text, record, index) => {
        return <Text>{text ?? "-"}</Text>;
      },
    },
    {
      title: "折扣前小計",
      width: "200px",
      dataIndex: "subtotal",
      align: "center",
      render: (text, record, index) => {
        return <Text>{text ? numWithCommas(text) : "-"}</Text>;
      },
    },
    {
      title: "條碼",
      width: "200px",
      dataIndex: "itemEan",
      align: "center",
      render: (text, record, index) => {
        if ([null, undefined].includes(text)) {
          return <Text>-</Text>;
        }

        if (isValidEAN13(text)) {
          const canvas = document.createElement("canvas");
          JsBarcode(canvas, text, { format: "EAN13" });
          const barcode = canvas.toDataURL();
          return <Image src={barcode} alt="" />;
        } else {
          return <Text>{text}</Text>;
        }
      },
    },
  ];

  const promotionColumns = [
    { title: "代號", width: "100px", dataIndex: "code" },
    { title: "活動名稱", width: "100px", dataIndex: "name" },
  ];

  const fetchInfo = () => {
    api
      .get(`v1/scm/order/${ecorderShipId}/salesDetail`)
      .then((res) => {
        setInfo(res.data);
      })
      .catch((err) => {
        message.error(err.message);
      })
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
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.delivery}>
                      <Text style={styles.deliveryText}>
                        {info.shippingModel}
                      </Text>
                    </View>

                    <View style={{ marginTop: 15 }}>
                      <Text>訂單日期：{info.orderDate}</Text>
                      <Text>
                        收件人：{info.receiverName} | {info.receiverPhone}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.titleSection}>
                    <Text style={{ fontSize: 18 }}>商品銷貨明細</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: "right" }}>
                      訂單編號 {info.ecorderNo}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text>訂單備註：{info.orderRemark}</Text>
                </View>

                <View style={styles.totalQty}>
                  <Text>總數量：{info.totalQty}</Text>
                </View>

                <View>
                  <Table dataSource={info.itemList} columns={itemColumns} />
                </View>

                <View style={styles.checkoutSection} wrap={false}>
                  <View style={{ flex: 1 }}>
                    <Text>*課稅別:應稅為TX,免稅為N</Text>
                  </View>

                  <View style={styles.checkout}>
                    {info.itemTotal && (
                      <View style={[styles.checkoutRow, { width: 300 }]}>
                        <Text style={{ flex: 1 }}>合計</Text>
                        <Text style={{ flex: 1 }}>
                          {numWithCommas(info.itemTotal)}
                        </Text>
                      </View>
                    )}

                    {info.discount && (
                      <View style={[styles.checkoutRow, { width: 300 }]}>
                        <Text style={{ flex: 1 }}>活動折扣</Text>
                        <Text style={{ flex: 1 }}>
                          {numWithCommas(info.discount)}
                        </Text>
                      </View>
                    )}

                    {info.couponDiscount && (
                      <View style={[styles.checkoutRow, { width: 300 }]}>
                        <Text style={{ flex: 1 }}>折價券折抵</Text>
                        <Text style={{ flex: 1 }}>
                          {numWithCommas(info.couponDiscount)}
                        </Text>
                      </View>
                    )}

                    {info.shippingFee && (
                      <View style={[styles.checkoutRow, { width: 300 }]}>
                        <Text style={{ flex: 1 }}>運費(含稅)</Text>
                        <Text style={{ flex: 1 }}>
                          {numWithCommas(info.shippingFee)}
                        </Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.checkoutRow,
                        { borderTop: "1px solid #000", width: 300 },
                      ]}
                    >
                      <Text style={{ flex: 1 }}>總計</Text>
                      <Text style={{ flex: 1 }}>
                        {numWithCommas(info.total)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.checkoutRow,
                        styles.borderOuter,
                        { width: 350 },
                      ]}
                    >
                      <View
                        style={[
                          styles.checkoutRow,
                          styles.borderInner,
                          { width: 350 },
                        ]}
                      >
                        <Text style={{ flexBasis: "150px" }}>稅別</Text>
                        <Text style={{ flexBasis: "30px" }}>稅率</Text>
                        <Text style={{ flexBasis: "120px" }}>未稅金額</Text>
                        <Text style={{ flexBasis: "30px" }}>稅額</Text>
                      </View>
                    </View>

                    {info.taxableAmount && (
                      <View style={[styles.checkoutRow, { width: 350 }]}>
                        <Text style={{ flexBasis: "150px" }}>TX</Text>
                        <Text style={{ flexBasis: "30px" }}>
                          {info.taxableRate}
                        </Text>
                        <Text style={{ flexBasis: "120px" }}>
                          {numWithCommas(info.taxableAmount)}
                        </Text>
                        <Text style={{ flexBasis: "30px" }}>
                          {numWithCommas(info.taxAmount)}
                        </Text>
                      </View>
                    )}

                    {info.untaxedAmount && (
                      <View style={[styles.checkoutRow, { width: 350 }]}>
                        <Text style={{ flexBasis: "150px" }}>N</Text>
                        <Text style={{ flexBasis: "30px" }}>
                          {info.untaxedRate}
                        </Text>
                        <Text style={{ flexBasis: "120px" }}>
                          {numWithCommas(info.untaxedAmount)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {info.promotionList?.length > 0 && (
                  <View style={styles.promotionSection} wrap={false}>
                    <Text style={[styles.label, { width: 50 }]}>活動項目</Text>
                    <Table
                      columns={promotionColumns}
                      dataSource={info.promotionList}
                    />
                  </View>
                )}

                <View style={styles.notificationSection} wrap={false}>
                  <Text style={styles.label}>重要通知</Text>
                  <View style={styles.notification}>
                    <Text>
                      {
                        "※ 線上商城訂單無法至家樂福所屬實體門店退換貨。訂單商品若有疑慮或其他需求，請依以下方式反應：登入家樂福線上購物 ⮕訂單查詢 ⮕ 點選訂單編號 ⮕ 訊息詢問。"
                      }
                    </Text>

                    <Text>
                      {
                        "※ 由於安裝/卸除費用並非商品之對價，謹請您於商品安裝/卸除前，仔細考量對於商品之需求，商品一經安裝/卸除，縱使商品事後進行退貨退款，然安裝費/卸除費仍須收取，敬請您留心。"
                      }
                    </Text>

                    <Text>
                      {
                        "※ 若該商品無保固或已超過保固期間時，請自行將需維修之商品寄回，且其相關之運費與維修費等費用均應由消費者自行支出。"
                      }
                    </Text>

                    <Text>
                      {
                        "※ 依照消費者保護法規定，網路購物消費者享有商品到貨七天之猶豫期間，但退貨的商品必須為全新狀態且完整包裝未經拆封（包含內外包裝、贈品等）。此外，消耗性商品（如生鮮食品、日用品、內衣褲、個人衛生用品）以及商品銷售網頁上特別載明之商品，由於其商品屬性特殊，有保存期限、智慧財產權（如影音商品、遊戲點數、電腦軟體等）或個人衛生等問題，無法享有前開之七天猶豫期間，但此類商品仍享有本公司新品瑕疵無條件退/換貨的售後服務。"
                      }
                    </Text>

                    <Text>
                      {
                        "※ 於家樂福線上購物所購買之廠商出貨商品，暫時無法提供實體賣場換貨服務，若該商品無法滿足您的需求，煩請直接線上辦理退貨（大型家具商品、大型家電、健身器材、按摩椅等商品若需退貨，可能需要負擔配送運費）。"
                      }
                    </Text>

                    <Text>
                      {
                        "※ 不同平台及通路有不同之商品價格及促銷活動內容，恕不適用家樂福實體賣場之退價差機制。"
                      }
                    </Text>

                    <Text>
                      {
                        "※ 會員制度以各平台及通路之設定規範為準，如有疑慮，請您務必於購買前與各通路之客服確認。"
                      }
                    </Text>

                    <Text>
                      {
                        "※ 如需辦理退貨，請連同紙本發票及商品一同退回。紙本發票請務必妥善保管。"
                      }
                    </Text>
                  </View>
                </View>

                <View style={styles.footer}>
                  <Text>
                    {info.vendorName} | {info.contact}
                  </Text>

                  <View style={styles.websiteWrapper}>
                    <Text>
                      家樂福線上購物：https://online.carrefour.com.tw/
                    </Text>
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
