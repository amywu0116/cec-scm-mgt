"use client";
import { useState } from "react";
import { Breadcrumb, Radio } from "antd";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import TextArea from "@/components/TextArea";

import { PATH_PRODUCT_PRODUCT_LIST } from "@/constants/paths";

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

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
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
                家電處/大家電/冰箱/三門以上冰箱/四門以上冰{"<"}500公升
              </CategoryLabel>
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>中文品名</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>英文品名</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>供應商商品編號</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>銷售碼Unitcode</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>條碼</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>應/免稅</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>建議售價(含稅)</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>生產國家</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <Title>容量和重量</Title>

          <Row>
            <Item>
              <ItemLabel>容量</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>容量單位</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>庫存單位</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>陳列單位(數字)</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>陳列容量</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item></Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>商品高度(cm)</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>商品寬度(cm)</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>商品長度(cm)</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>重量-毛重</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>重量-淨重</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item></Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <Title>其他資訊</Title>

          <Row>
            <Item>
              <ItemLabel>保存日期</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>保存日期單位</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>電源規格</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>影片檔Youtube之影音URL</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>顏色</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>尺寸</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>等級</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>

            <Item>
              <ItemLabel>保存方式(文字)</ItemLabel>
              <Input disabled={!isEditing} />
            </Item>
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

            <Item></Item>
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
    </>
  );
};

export default Page;
