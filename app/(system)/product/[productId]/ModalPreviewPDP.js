"use client";
import styled, { css } from "styled-components";
import { App, Row, Col, Spin } from "antd";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

import PreviewImgZoom from "./PreviewImgZoom";

import "swiper/css";
import api from "@/api";
import Modal from "@/components/Modal";

const Container = styled.div`
  background-color: #f0f0f0;
  height: 70vh;
  overflow-y: scroll;
  padding: 20px;
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
  border-left: 1px solid #ebeae8;
`;

const PreviewImg = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid #000;
`;

const PreviewImgList = styled.div`
  width: 100%;
`;

const PreviewImgListItem = styled.div``;

const ContactList = styled.div`
  display: flex;
  gap: 0 5px;
`;

const ProductImgWrapper = styled.div`
  width: 90px;
  height: 90px;
  overflow: hidden;
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

const ItemText = styled.div`
  display: flex;
  gap: 0 20px;
  font-size: 16px;
  font-weight: 400;
  color: #999;
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

const SpecialPrice = styled.div`
  font-size: 42px;
  font-weight: 700;
  color: #fd0202;
  margin-right: 5px;

  > span {
    font-size: 24px;
  }
`;

const Price = styled.div`
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
  filter: grayscale(1);
  opacity: 0.22;
`;

const SuggestionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  text-align: center;
`;

const SuggestionList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px 0;
`;

const SuggestionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  position: relative;
`;

const SuggestionItemImg = styled.div`
  height: 100px;
  text-align: center;
`;

const SuggestionItemName = styled.div`
  font-size: 14px;
  color: #000;
  text-align: center;
`;

const SuggestionItemPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #e13d3d;
  text-align: center;
`;

const Commodity = styled.div`
  display: flex;
  gap: 0 20px;
`;

const Popularity = styled.div`
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  gap: 15px 0;
`;

const PopularityTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1e5bc6;
`;

const PopularityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
`;

const PopularityItem = styled.div`
  border-radius: 10px;
  background-color: #fff;
  display: flex;
`;

const PopularityItemImg = styled.div`
  display: flex;
  align-self: center;
`;

const PopularityItemContent = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const PopularityItemName = styled.div``;

const PopularityItemPriceWrapper = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const PopularityItemPrice = styled.div`
  font-size: 12px;
  color: #999999;
  text-decoration: line-through;
`;

const PopularityItemSpecialPrice = styled.div`
  font-size: 20px;
  color: #fd0202;
  font-weight: bold;
  margin-left: auto;

  > span {
    font-size: 12px;
  }
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

const RelatedWrapper = styled.div`
  background-color: #fff;
  padding: 15px 10px;
  display: flex;
  gap: 0 15px;
`;

const RelatedTitle = styled.div`
  font-size: 14px;
  color: #999;
  align-self: center;
`;

const RelatedList = styled.div`
  gap: 10px;
  display: flex;
`;

const RelatedTag = styled.div`
  padding: 5px;
  border: 1px solid #1e5bc6;
  border-radius: 10px;
  background-color: #e8eff9;
  color: #1e5bc6;
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

  &:hover {
    color: #0e3368;
  }
`;

const ProductDescriptionContent = styled.div`
  height: 1000px;
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

const FeatureImagesWrapper = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
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

const relatedTagList = [
  "童年 零食",
  "科學 童年",
  "零食 科學",
  "家庭號 分享",
  "零食 分享",
  "分享 童年",
  "家庭號 科學",
  "家庭號 童年",
  "科學 分享",
];

const popularityList = [
  {
    name: "聯華七小喜多包",
    price: 62,
    specialPrice: 55,
    url: "/popularity-1.jpg",
  },
  {
    name: "味王小王子麵",
    price: null,
    specialPrice: 47,
    url: "/popularity-2.jpg",
  },
  {
    name: "真魷味歡樂包-紅燒口味12gx12",
    price: 69,
    specialPrice: 55,
    url: "/popularity-3.jpg",
  },
  {
    name: "華元神氣包-三色野菜園",
    price: null,
    specialPrice: 55,
    url: "/popularity-4.jpg",
  },
  {
    name: "可樂果古早味量販包48gx4",
    price: 63,
    specialPrice: 53,
    url: "/popularity-5.jpg",
  },
  {
    name: "可樂果辣味量販包",
    price: 63,
    specialPrice: 53,
    url: "/popularity-6.jpg",
  },
  {
    name: "小王子麵-原味(減鹽)",
    price: null,
    specialPrice: 47,
    url: "/popularity-7.jpg",
  },
];

export default function ModalPreviewPDP(props) {
  const { open, onCancel } = props;
  const { message } = App.useApp();

  const [loading, setLoading] = useState({ page: true });
  const [info, setInfo] = useState({});
  const [selectedImg, setSelectedImg] = useState();

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/scm/product/apply/pdp`, { params: { applyId: 215 } })
      .then((res) => {
        setInfo(res.data);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <>
      <Spin spinning={loading.page}>
        <Modal
          title="PDP預覽"
          centered
          width={1250}
          destroyOnClose
          open={open}
          onCancel={onCancel}
          footer={null}
        >
          <Container>
            <Row gutter={[0, 20]}>
              <Col span={24}>
                <ProductDetail>
                  <Preview>
                    <PreviewImgZoom src={selectedImg} />

                    <PreviewImgList>
                      <Swiper
                        spaceBetween={10}
                        slidesPerView={4}
                        onSlideChange={() => console.log("slide change")}
                        onSwiper={(swiper) => console.log(swiper)}
                      >
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

                    <ItemText>
                      <div>◎品牌：{info.brand}</div>
                      <div>◎規格：{info.itemSpec}</div>
                    </ItemText>

                    <ItemPriceWrapper>
                      <ItemLabel>促銷價</ItemLabel>

                      {info.specialPrice && (
                        <SpecialPrice>
                          <span>$</span>
                          {info.specialPrice}
                        </SpecialPrice>
                      )}

                      <Price>${info.price}</Price>
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
                    <SuggestionTitle>猜你也喜歡</SuggestionTitle>
                    <SuggestionList>
                      <SuggestionItem>
                        <SuggestionItemImg>
                          <Image
                            src="/suggestion-1.jpg"
                            alt=""
                            width={100}
                            height={100}
                          />
                        </SuggestionItemImg>
                        <SuggestionItemName>
                          華元大吉利超值包
                        </SuggestionItemName>
                        <SuggestionItemPrice>$55</SuggestionItemPrice>
                      </SuggestionItem>

                      <SuggestionItem>
                        <SuggestionItemImg>
                          <Image
                            src="/suggestion-2.jpg"
                            alt=""
                            width={100}
                            height={100}
                          />
                        </SuggestionItemImg>
                        <SuggestionItemName>聯華七小喜多包</SuggestionItemName>
                        <SuggestionItemPrice>$55</SuggestionItemPrice>
                      </SuggestionItem>

                      <SuggestionItem>
                        <SuggestionItemImg>
                          <Image
                            src="/suggestion-3.jpg"
                            alt=""
                            width={100}
                            height={100}
                          />
                        </SuggestionItemImg>
                        <SuggestionItemName>
                          來一客-鮮蝦魚板-63g
                        </SuggestionItemName>
                        <SuggestionItemPrice>$65</SuggestionItemPrice>
                      </SuggestionItem>
                    </SuggestionList>
                  </Suggestion>
                </ProductDetail>
              </Col>

              <Col span={24}>
                <Commodity>
                  <Popularity>
                    <PopularityTitle>人氣熱銷</PopularityTitle>
                    <PopularityList>
                      {popularityList.map((item, idx) => {
                        return (
                          <PopularityItem key={idx}>
                            <PopularityItemImg>
                              <Image
                                src={item.url}
                                width={100}
                                height={100}
                                alt=""
                              />
                            </PopularityItemImg>

                            <PopularityItemContent>
                              <PopularityItemName>
                                {item.name}
                              </PopularityItemName>

                              <PopularityItemPriceWrapper>
                                {item.price && (
                                  <PopularityItemPrice>
                                    ${item.price}
                                  </PopularityItemPrice>
                                )}

                                <PopularityItemSpecialPrice>
                                  <span>$</span>
                                  {item.specialPrice}
                                </PopularityItemSpecialPrice>
                              </PopularityItemPriceWrapper>
                            </PopularityItemContent>
                          </PopularityItem>
                        );
                      })}
                    </PopularityList>
                  </Popularity>

                  <ProductDescriptionWrapper>
                    <RelatedWrapper>
                      <RelatedTitle>相關搜尋</RelatedTitle>
                      <RelatedList>
                        {relatedTagList.map((tag, idx) => {
                          return <RelatedTag key={idx}>{tag}</RelatedTag>;
                        })}
                      </RelatedList>
                    </RelatedWrapper>

                    <ProductDescription>
                      <ProductDescriptionTabs>
                        <ProductDescriptionTab>商品資訊</ProductDescriptionTab>
                        <ProductDescriptionTab>
                          配送及售後服務說明
                        </ProductDescriptionTab>
                      </ProductDescriptionTabs>

                      <ProductDescriptionContent>
                        <FeatureImagesList>
                          {info.featureImages?.map((img, idx) => {
                            return (
                              <FeatureImagesWrapper key={idx}>
                                <Image
                                  key={idx}
                                  src={img}
                                  fill
                                  objectFit="contain"
                                />
                              </FeatureImagesWrapper>
                            );
                          })}
                        </FeatureImagesList>

                        <ProductDescriptionTable>
                          <table>
                            <tbody>
                              <tr>
                                <td>商品來源國家</td>
                                <td>{info.itemCountry}</td>
                              </tr>

                              <tr>
                                <td>商品高度</td>
                                <td>{info.productHeight}</td>
                              </tr>

                              <tr>
                                <td>商品寬度</td>
                                <td>{info.productWidth}</td>
                              </tr>

                              <tr>
                                <td>保存天數</td>
                                <td>{info.expDate}</td>
                              </tr>

                              <tr>
                                <td>應免稅</td>
                                <td>{info.isTax ? "應稅" : "免稅"}</td>
                              </tr>
                              <tr></tr>
                            </tbody>
                          </table>
                        </ProductDescriptionTable>
                      </ProductDescriptionContent>
                    </ProductDescription>
                  </ProductDescriptionWrapper>
                </Commodity>
              </Col>
            </Row>
          </Container>
        </Modal>
      </Spin>
    </>
  );
}
