"use client";
import { useEffect, useState } from "react";
import { Breadcrumb, Radio, Spin } from "antd";
import styled from "styled-components";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import TextArea from "@/components/TextArea";

import { PATH_PRODUCT_PRODUCT_LIST } from "@/constants/paths";
import api from "@/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
`;

const Row = styled.div`
  display: flex;
  gap: 0 32px;
`;

const Item = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7b8093;
  width: 64px;
  flex-shrink: 0;
`;

const CategoryLabel = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: rgba(89, 89, 89, 1);
`;

const Page = () => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState({ page: false });

  const [isEditing, setIsEditing] = useState(false);

  const [info, setInfo] = useState({});

  const fetchInfo = () => {
    api
      .get(`v1/scm/product/${params.productId}`)
      .then((res) => setInfo(res.data))
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <Spin spinning={loading.page}>
      <LayoutHeader>
        <LayoutHeaderTitle>商品列表</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link href={PATH_PRODUCT_PRODUCT_LIST}>商品列表</Link>,
            },
            {
              title: "商品資料",
            },
          ]}
        />

        <ButtonGroup style={{ marginLeft: "auto" }}>
          {isEditing ? (
            <>
              <Button type="default" onClick={() => setIsEditing(false)}>
                取消
              </Button>

              <Button type="primary" onClick={() => setIsEditing(false)}>
                確認修改
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              編輯修改
            </Button>
          )}

          {!isEditing && (
            <Button
              type="secondary"
              onClick={() => router.push("/product/123/image-maintenance")}
            >
              圖片維護
            </Button>
          )}

          <Button type="secondary">PDF預覽</Button>
        </ButtonGroup>
      </LayoutHeader>

      <Container>
        <Wrapper>
          <Title>基本設定</Title>

          <Row>
            <Item>
              <ItemLabel>內部分類</ItemLabel>
              <CategoryLabel>
                {info.scmCategoryCode} / {info.scmCategoryName}
              </CategoryLabel>
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>品名</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>生產國家</ItemLabel>
              <Input disabled={!isEditing} value={info.itemCountry} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>中文品名</ItemLabel>
              <Input disabled={!isEditing} value={info.itemName} />
            </Item>

            <Item>
              <ItemLabel>英文品名</ItemLabel>
              <Input disabled={!isEditing} value={info.itemNameEn} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>供應商商品編號</ItemLabel>
              <Input disabled={!isEditing} value={info.vendorProdCode} />
            </Item>

            <Item>
              <ItemLabel>規格</ItemLabel>
              <Input disabled={!isEditing} value={info.itemSpec} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>條碼</ItemLabel>
              <Input disabled={!isEditing} value={info.itemEan} />
            </Item>

            <Item>
              <ItemLabel>應/免稅</ItemLabel>
              <Input
                disabled={!isEditing}
                value={info.isTax ? "應稅" : "免稅"}
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>原價</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>促銷價</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <Title>容量和重量</Title>

          {/* <Row>
            <Item>
              <ItemLabel>容量</ItemLabel>
              <Input disabled={!isEditing} value={info.v_capacity} />
            </Item>

            <Item>
              <ItemLabel>容量單位</ItemLabel>
              <Input disabled={!isEditing} value={info.vunit} />
            </Item>

            <Item>
              <ItemLabel>庫存單位</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row> */}

          {/* <Row>
            <Item>
              <ItemLabel>陳列單位(數字)</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>陳列容量</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item></Item>
          </Row> */}

          <Row>
            <Item>
              <ItemLabel>商品高度(cm)</ItemLabel>
              <Input disabled={!isEditing} value={info.productHeight} />
            </Item>

            <Item>
              <ItemLabel>商品寬度(cm)</ItemLabel>
              <Input disabled={!isEditing} value={info.productWidth} />
            </Item>

            <Item>
              <ItemLabel>商品長度(cm)</ItemLabel>
              <Input disabled={!isEditing} value={info.productLength} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>重量-淨重</ItemLabel>
              <Input disabled={!isEditing} value={info.netWeight} />
            </Item>

            <Item>
              <ItemLabel>重量-毛重</ItemLabel>
              <Input disabled={!isEditing} value={info.grossWeight} />
            </Item>

            <Item></Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <Title>其他資訊</Title>

          <Row>
            <Item>
              <ItemLabel>保存日期</ItemLabel>
              <Input disabled={!isEditing} value={info.expDateValue} />
            </Item>

            <Item>
              <ItemLabel>保存日期單位</ItemLabel>
              <Input disabled={!isEditing} value={info.expDateUnit} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>電源規格</ItemLabel>
              <Input disabled={!isEditing} value={info.powerSpec} />
            </Item>

            <Item>
              <ItemLabel>保存方式(文字)</ItemLabel>
              <Input disabled={!isEditing} value={info.itemStoreway} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>顏色</ItemLabel>
              <Input disabled={!isEditing} value={info.vcolor} />
            </Item>

            <Item>
              <ItemLabel>尺寸</ItemLabel>
              <Input disabled={!isEditing} value={info.vsize} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>容量</ItemLabel>
              <Input disabled={!isEditing} value={info.v_capacity} />
            </Item>

            <Item>
              <ItemLabel>入數</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>款式</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item></Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>庫存</ItemLabel>
              <Radio.Group
                style={{ display: "flex", flex: 1, alignItems: "center" }}
                disabled={!isEditing}
                defaultValue={1}
                // onChange={() => {}}
                // value={1}
              >
                <Radio value={1}>不庫控</Radio>
                <Radio value={2}>
                  活動庫存{" "}
                  <Input
                    style={{ width: 102, marginLeft: 8 }}
                    placeholder="數量"
                    disabled={!isEditing}
                  />
                  <Input
                    style={{ width: 102, marginLeft: 8 }}
                    placeholder="起始日期"
                    disabled={!isEditing}
                  />
                </Radio>
              </Radio.Group>
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>商品特色說明</ItemLabel>
              <TextArea
                placeholder="請輸入商品特色說明"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled={!isEditing}
              />
            </Item>

            <Item>
              <ItemLabel>商品完整說明(文字)</ItemLabel>
              <TextArea
                placeholder="請輸入商品完整說明(文字)"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled={!isEditing}
                value={info.itemDetail}
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>產品成份及食品添加物(文字)</ItemLabel>
              <TextArea
                placeholder="請輸入商品特色說明"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled={!isEditing}
                value={info.ingredients}
              />
            </Item>

            <Item>
              <ItemLabel>營養標示(文字)</ItemLabel>
              <TextArea
                placeholder="請輸入商品完整說明(文字)"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled={!isEditing}
                value={info.nutrition}
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>產品責任險</ItemLabel>
              <TextArea
                placeholder="請輸入商品特色說明"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled={!isEditing}
                value={info.dutyInsurance}
              />
            </Item>

            <Item>
              <ItemLabel>產品核准字號</ItemLabel>
              <TextArea
                placeholder="請輸入商品完整說明(文字)"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled={!isEditing}
                value={info.approvalId}
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>保固範圍(文字)</ItemLabel>
              <TextArea
                placeholder="請輸入商品特色說明"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled={!isEditing}
                value={info.warrantyScope}
              />
            </Item>

            <Item>
              <ItemLabel>其他證明(文字)</ItemLabel>
              <TextArea
                placeholder="請輸入商品完整說明(文字)"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled={!isEditing}
              />
            </Item>
          </Row>
        </Wrapper>
      </Container>
    </Spin>
  );
};

export default Page;
