"use client";
import { App, Col, Row, Spin } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import Modal from "@/components/Modal";

import PreviewImgZoom from "./PreviewImgZoom";
import ServiceDescription from "./ServiceDescription";

import api from "@/api";

import "swiper/css";

const Container = styled.div`
  background-color: #f0f0f0;
  height: 70vh;
  overflow-y: scroll;
  padding: 20px;

  p {
    font-size: 16px;
    color: #333;
  }
`;

const ProductDetail = styled.div`
  background-color: #fff;
  display: flex;
  gap: 0 20px;
  padding: 20px;
`;

const Preview = styled.div`
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  gap: 15px 0;
`;

const Detail = styled.div`
  flex: 0 0 500px;
`;

const Suggestion = styled.div`
  flex: 1;
  position: relative;
`;

const PreviewImgList = styled.div`
  width: 400px;
`;

const ContactList = styled.div`
  display: flex;
  gap: 0 5px;
`;

const ProductImgWrapper = styled.div`
  width: 90px;
  height: 90px;
  padding: 2px;
  position: relative;
  border: 2px solid transparent;

  ${(props) =>
    props.$isActive &&
    css`
      border: 2px solid #5078eb;
    `}
`;

const ItemName = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const ItemPriceWrapper = styled.div`
  padding: 15px 0;
  border-top: 1px solid #ebeae8;
  border-bottom: 1px solid #ebeae8;
  display: flex;
  align-items: baseline;
  margin-top: 20px;
`;

const ItemLabel = styled.div`
  width: 60px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  margin-right: 20px;
`;

const Price = styled.div`
  font-size: 42px;
  font-weight: 700;
  color: #fd0202;
  margin-right: 5px;

  > span {
    font-size: 24px;
  }
`;

const SpecialPrice = styled.div`
  text-decoration: line-through;
  font-size: 20px;
  font-weight: 400;
  color: #888888;
`;

const ItemOthers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px 0;
  margin-top: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #ebeae8;
`;

const ItemQuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 7px;
`;

const ItemQuantity = styled.div`
  width: 83px;
  height: 32px;
  border: 1px solid #ebeae8;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: #333;
`;

const ItemOthersRow = styled.div`
  display: flex;
  align-items: center;
`;

const SelectDiscountBtn = styled.div`
  font-size: 14px;
  color: #2e5bff;
`;

const ItemShipping = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #333;
`;

const PurchaseWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 5px;
  margin-top: 30px;
`;

const PurchaseBtnWrapper = styled.div`
  flex: 1;
  border-radius: 62px;
  display: flex;
  border: 1px solid #fd4848;
  overflow: hidden;

  > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    font-size: 20px;

    &:nth-child(1) {
      color: #fd5151;
    }

    &:nth-child(2) {
      color: #fff;
      background-color: #fd5151;
    }
  }
`;

const FavoriteBtn = styled.div`
  display: flex;
  filter: grayscale(1);
  opacity: 0.22;
`;

const Commodity = styled.div`
  display: flex;
  gap: 0 20px;
`;

const Popularity = styled.div`
  position: relative;
  width: 220px;
  height: 775px;
`;

const ProductDescriptionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px 0;
`;

const ProductDescription = styled.div`
  background-color: #fff;
  padding: 8px 16px;
`;

const Related = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
`;

const ProductDescriptionTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  gap: 0 45px;
`;

const ProductDescriptionTab = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #6a6a6a;
  padding: 8px 0;
  cursor: pointer;

  ${(props) =>
    props.$active &&
    css`
      color: #0e3368;
      border-bottom: 1px solid #fd5151;
    `}

  &:hover {
    color: #0e3368;
  }

  &:first-child {
    margin-left: 15px;
  }
`;

const ProductDescriptionContent = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  gap: 20px 0;
`;

const FeatureImagesList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductDescriptionTable = styled.div`
  table {
    width: 100%;
    border: 1px solid #ddd;
    border-collapse: collapse;

    tr > td {
      padding: 10px;
      color: #555;
      font-size: 16px;
      border: 1px solid #ddd;

      &:first-child {
        width: 200px;
        background-color: #eee;
      }
    }
  }
`;

const Popular = styled.div`
  position: relative;
  width: 100%;
  height: 370px;
`;

const TAB = {
  INFO: "0", // 商品資訊
  SERVICE: "1", // 配送售後服務說明
};

const descriptionTabList = [
  {
    label: "商品資訊",
    key: TAB.INFO,
  },
  {
    label: "配送售後服務說明",
    key: TAB.SERVICE,
  },
];

export default function ModalPreviewPDP(props) {
  const { type, id, open, onCancel } = props;
  const { message } = App.useApp();

  const isApply = type === "apply";
  const isProduct = type === "product";

  const [loading, setLoading] = useState({ page: true });

  const [selectedImg, setSelectedImg] = useState();
  const [selectedTab, setSelectedTab] = useState(descriptionTabList[0].key);
  const [info, setInfo] = useState({});

  const columns = [
    {
      title: "商品來源國家",
      dataIndex: "itemCountry",
    },
    {
      title: "容量",
      dataIndex: "vCapacity",
    },
    {
      title: "款式",
      dataIndex: "vStyle",
    },
    {
      title: "入數",
      dataIndex: "vUnit",
    },
    {
      title: "素食種類",
      dataIndex: "veggieType",
    },
    {
      title: "能源效率",
      dataIndex: "energyEfficiency",
    },
    {
      title: "國內負責廠商名稱",
      dataIndex: "manufacturer",
    },
    {
      title: "國內負責廠商電話",
      dataIndex: "manufacturerPhone",
    },
    {
      title: "國內負責廠商地址",
      dataIndex: "manufacturerAddress",
    },
    {
      title: "顏色",
      dataIndex: "vColor",
    },
    {
      title: "尺寸",
      dataIndex: "vSize",
    },
    {
      title: "產品成份及內容添加物",
      dataIndex: "ingredients",
      render: (text, record) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
        );
      },
    },
    {
      title: "營養成份",
      dataIndex: "nutrition",
      render: (text, record) => {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
        );
      },
    },
    {
      title: "產品責任險",
      dataIndex: "dutyInsurance",
    },
    {
      title: info.isFood ? "食品業者登錄字號" : "產品核准字號",
      dataIndex: "approvalId",
    },
    {
      title: "保存天數",
      dataIndex: "expDate",
    },
    {
      title: "保存方式",
      dataIndex: "itemStoreway",
    },
    {
      title: "電源規格",
      dataIndex: "powerSpec",
    },
    {
      title: "保固範圍",
      dataIndex: "warrantyScope",
    },
    {
      title: "保固期間",
      dataIndex: "warrantyPeriod",
    },
    {
      title: "標章",
      dataIndex: "certMark",
    },
    {
      title: "應免稅",
      dataIndex: "isTax",
      render: (text, record) => {
        return text ? "應稅" : "免稅";
      },
    },
  ];

  const fetchInfo = () => {
    const apiUrl = isApply
      ? "v1/scm/product/apply/pdp"
      : isProduct
        ? "v1/scm/product/pdp"
        : "";

    const params = isApply
      ? { applyId: id }
      : isProduct
        ? { productId: id }
        : undefined;

    setLoading((state) => ({ ...state, page: true }));
    api
      .get(apiUrl, { params })
      .then((res) => {
        setInfo(res.data);
        setSelectedImg(res.data.productImages[0]);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  useEffect(() => {
    if (open) {
      fetchInfo();
    } else {
      setInfo({});
      setSelectedImg(undefined);
    }
  }, [open]);

  return (
    <>
      <Modal
        title="PDP預覽"
        centered
        width={1250}
        destroyOnClose
        open={open}
        onCancel={onCancel}
        footer={null}
      >
        <Spin spinning={loading.page}>
          <Container>
            <Row gutter={[0, 20]}>
              <Col span={24}>
                <ProductDetail>
                  <Preview>
                    <PreviewImgZoom src={selectedImg} />

                    <PreviewImgList>
                      <Swiper spaceBetween={10} slidesPerView={4}>
                        {info?.productImages?.map((img, idx) => {
                          return (
                            <SwiperSlide key={idx}>
                              <ProductImgWrapper
                                $isActive={selectedImg === img}
                                onClick={() => setSelectedImg(img)}
                              >
                                <Image src={img} fill alt="" />
                              </ProductImgWrapper>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </PreviewImgList>

                    <ContactList>
                      <Image src="/fb.svg" width={45} height={45} />
                      <Image src="/line.svg" width={45} height={45} />
                      <Image src="/mail.svg" width={45} height={45} />
                    </ContactList>
                  </Preview>

                  <Detail>
                    <ItemName>{info.itemName}</ItemName>

                    <ItemPriceWrapper>
                      {info.specialPrice ? (
                        <>
                          <ItemLabel>促銷價</ItemLabel>
                          <Price>
                            <span>$</span>
                            {info.specialPrice}
                          </Price>
                          <SpecialPrice>${info.price}</SpecialPrice>
                        </>
                      ) : (
                        <>
                          <ItemLabel>原價</ItemLabel>
                          <Price>
                            <span>$</span>
                            {info.price}
                          </Price>
                        </>
                      )}
                    </ItemPriceWrapper>

                    <ItemOthers>
                      <ItemOthersRow>
                        <ItemLabel>數量</ItemLabel>

                        <ItemQuantityWrapper>
                          <Image
                            src="/subtract.svg"
                            width={20}
                            height={20}
                            alt="subtract"
                          />

                          <ItemQuantity>1</ItemQuantity>

                          <Image
                            src="/add.svg"
                            width={20}
                            height={20}
                            alt="add"
                          />
                        </ItemQuantityWrapper>
                      </ItemOthersRow>

                      <ItemOthersRow>
                        <ItemLabel>出貨方式</ItemLabel>
                        <ItemShipping>線上商城 廠商出貨</ItemShipping>
                      </ItemOthersRow>

                      <ItemOthersRow>
                        <ItemLabel>折價券</ItemLabel>

                        <SelectDiscountBtn>查看適用折價券</SelectDiscountBtn>
                      </ItemOthersRow>
                    </ItemOthers>

                    <PurchaseWrapper>
                      <FavoriteBtn>
                        <Image
                          src="/heart.svg"
                          width={22}
                          height={20}
                          alt="heart"
                        />
                      </FavoriteBtn>

                      <PurchaseBtnWrapper>
                        <div>立即購買</div>
                        <div>加入購物車</div>
                      </PurchaseBtnWrapper>
                    </PurchaseWrapper>
                  </Detail>

                  <Suggestion>
                    <Image src="/suggestion.png" fill />
                  </Suggestion>
                </ProductDetail>
              </Col>

              <Col span={24}>
                <Commodity>
                  <Popularity>
                    <Image src="/popularity.png" fill />
                  </Popularity>

                  <ProductDescriptionWrapper>
                    <Related>
                      <Image src="/related.png" fill />
                    </Related>

                    <ProductDescription>
                      <ProductDescriptionTabs>
                        {descriptionTabList.map((tab, idx) => {
                          return (
                            <ProductDescriptionTab
                              key={idx}
                              $active={selectedTab === tab.key}
                              onClick={() => setSelectedTab(tab.key)}
                            >
                              {tab.label}
                            </ProductDescriptionTab>
                          );
                        })}
                      </ProductDescriptionTabs>

                      <ProductDescriptionContent>
                        {selectedTab === TAB.INFO && (
                          <>
                            {info.featureImages?.length > 0 && (
                              <FeatureImagesList>
                                {info.featureImages?.map((img, idx) => {
                                  return (
                                    <Image
                                      style={{ width: "100%", height: "auto" }}
                                      key={idx}
                                      src={img}
                                      width={0}
                                      height={0}
                                      sizes="100vw"
                                    />
                                  );
                                })}
                              </FeatureImagesList>
                            )}

                            {info.itemDetail && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: info.itemDetail,
                                }}
                              />
                            )}

                            <ProductDescriptionTable>
                              <table>
                                <tbody>
                                  {columns.map((c, idx) => {
                                    if (info[c.dataIndex] === null) return;
                                    return (
                                      <tr key={idx}>
                                        <td>{c.title}</td>
                                        <td>
                                          {c.render
                                            ? c.render(info[c.dataIndex], info)
                                            : info[c.dataIndex]}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </ProductDescriptionTable>
                          </>
                        )}

                        {selectedTab === TAB.SERVICE && <ServiceDescription />}
                      </ProductDescriptionContent>
                    </ProductDescription>

                    <Popular>
                      <Image src="/popular.png" fill />
                    </Popular>
                  </ProductDescriptionWrapper>
                </Commodity>
              </Col>
            </Row>
          </Container>
        </Spin>
      </Modal>
    </>
  );
}
