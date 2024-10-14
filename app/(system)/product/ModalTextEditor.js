import { Flex } from "antd";
import parse from "html-react-parser";
import { Text, Node } from "slate";
import { parseDocument } from "htmlparser2";
import escapeHtml from "escape-html";
import { useState } from "react";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import TextEditor from "@/components/TextEditor";

export default function ModalTextEditor(props) {
  const { form, open, onCancel } = props;

  const [textEditorValue, setTextEditorValue] = useState();

  const htmlString = form.getFieldValue("itemDetail") ?? "<p></p>";
  // const htmlString =
  //   '<p>This is editable <strong>rich</strong> text, <i>much</i> better than a !</p><p>Since it&#39;s rich text, you can do things like turn a selection of text <strong>bold</strong>, or add a semantically rendered block quote in the middle of the page, like this:</p><p style="text-align:center;">Try it out for yourself!</p>';

  const value = [
    {
      type: "paragraph",
      children: [
        { text: "This is editable " },
        { text: "rich", bold: true },
        { text: " text, " },
        { text: "much", italic: true },
        { text: " better than a " },
        { text: "!" },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: "bold", bold: true },
        {
          text: ", or add a semantically rendered block quote in the middle of the page, like this:",
        },
      ],
    },
    {
      type: "paragraph",
      align: "center",
      children: [{ text: "Try it out for yourself!" }],
    },
  ];

  const serialize = (node) => {
    if (Text.isText(node)) {
      let string = escapeHtml(node.text);

      if (node.bold) {
        string = `<strong>${string}</strong>`;
      }

      if (node.italic) {
        string = `<i>${string}</i>`;
      }

      if (node.underline) {
        string = `<u>${string}</u>`;
      }

      if (node.strikethrough) {
        string = `<s>${string}</s>`;
      }

      if (node.textColor && node.textBgColor) {
        string = `<span style="background-color:${node.textBgColor}; color:${node.textColor};">${string}</span>`;
      } else if (node.textColor) {
        string = `<span style="color:${node.textColor};">${string}</span>`;
      } else if (node.textBgColor) {
        string = `<span style="background-color:${node.textBgColor};">${string}</span>`;
      }

      return string;
    }

    const children = node.children.map((n) => serialize(n)).join("");

    let stylesStr = "";

    if (node.align) {
      stylesStr += `text-align:${node.align};`;
    }

    if (node.indent) {
      stylesStr += `padding-left:${node.indent * 40}px;`;
    }

    const styles = stylesStr ? ` style="${stylesStr}"` : "";

    switch (node.type) {
      case "paragraph":
        return `<p${styles}>${children}</p>`;
      case "heading-one":
        return `<h1${styles}>${children}</h1>`;
      case "heading-two":
        return `<h2${styles}>${children}</h2>`;
      case "heading-three":
        return `<h3${styles}>${children}</h3>`;
      case "numbered-list":
        return `<ol${styles}>${children}</ol>`;
      case "bulleted-list":
        return `<ul${styles}>${children}</ul>`;
      case "list-item":
        return `<li${styles}>${children}</li>`;
      default:
        return children;
    }
  };

  // 將 HTML DOM 節點映射為 Slate 格式
  const deserializeNode = (node) => {
    console.log("node", node);
    if (node.type === "text") {
      return { text: node.data };
    }

    const children =
      node.children.length !== 0
        ? node.children.map(deserializeNode)
        : [{ text: "" }];

    const align = node.attribs?.style?.includes("text-align:center;")
      ? "center"
      : node.attribs?.style?.includes("text-align:left;")
        ? "left"
        : node.attribs?.style?.includes("text-align:right;")
          ? "right"
          : undefined;

    // 使用正規表達式匹配 padding-left 的數值
    const paddingLeftMatch = node.attribs?.style?.match(
      /\bpadding-left:\s*(\d+)px\b/
    );

    const indent = paddingLeftMatch ? Number(paddingLeftMatch[1]) / 40 : null;

    switch (node.name) {
      case "p":
        return { type: "paragraph", align, indent, children };
      case "strong":
        return { ...children[0], bold: true };
      case "i":
        return { ...children[0], italic: true };
      case "u":
        return { ...children[0], underline: true };
      case "s":
        return { ...children[0], strikethrough: true };
      case "h1":
        return { type: "heading-one", children, align, indent };
      case "h2":
        return { type: "heading-two", children, align, indent };
      case "h3":
        return { type: "heading-three", children, align, indent };
      case "span":
        // 嚴格匹配屬性名稱
        const backgroundColorMatch = node.attribs?.style?.match(
          /\bbackground-color:\s*(#[0-9a-fA-F]{6});?/i
        );
        const colorMatch = node.attribs?.style?.match(
          /(?<!background-)\bcolor:\s*(#[0-9a-fA-F]{6});?/i
        );

        const textBgColor = backgroundColorMatch
          ? backgroundColorMatch[1]
          : null;
        const textColor = colorMatch ? colorMatch[1] : null;

        return { ...children[0], textColor, textBgColor };
      case "ol":
        return { type: "numbered-list", children };
      case "ul":
        return { type: "bulleted-list", children };
      case "li":
        return { type: "list-item", children };
      default:
        return children;
    }
  };

  // 解析 HTML 字串並轉換為 Slate 格式
  const slateValue = parseDocument(htmlString).children.map(deserializeNode);

  const getValue = (value) => {
    setTextEditorValue(value);
  };

  console.log("htmlString", htmlString);
  console.log("slateValue", slateValue);

  return (
    <Modal
      title="商品完整說明"
      centered
      width={1250}
      destroyOnClose
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Flex vertical gap={16}>
        <div>
          <Button
            type="primary"
            onClick={() => {
              let txt = "";
              textEditorValue.forEach((ele) => (txt += serialize(ele)));
              form.setFieldValue("itemDetail", txt);
              onCancel();
            }}
          >
            儲存
          </Button>
        </div>

        <TextEditor outerValue={slateValue} getValue={getValue} />
      </Flex>
    </Modal>
  );
}
