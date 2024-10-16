import { Flex } from "antd";
import escapeHtml from "escape-html";
import { parseDocument } from "htmlparser2";
import { useEffect, useState } from "react";
import { Text } from "slate";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import TextArea from "@/components/TextArea";
import TextEditor from "@/components/TextEditor";

export default function ModalTextEditor(props) {
  const { form, open, onCancel } = props;

  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlStr, setHtmlStr] = useState("");
  const [slateValue, setSlateValue] = useState([]);

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
  const deserialize = (node) => {
    console.log("deserialize", node);
    if (node.type === "text") {
      return { text: node.data };
    }

    const children =
      node.children.length !== 0
        ? node.children.map(deserialize)
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
        return { type: "paragraph", children, align, indent };
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
      case "span": {
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
      }
      case "ol":
        return { type: "numbered-list", children };
      case "ul":
        return { type: "bulleted-list", children };
      case "li":
        return { type: "list-item", children };
      default:
        return { type: "paragraph", children, align, indent };
    }
  };

  const getValue = (value) => {
    setSlateValue(value);
  };

  const handleSwitchMode = () => {
    if (isHtmlMode) {
      setSlateValue(
        htmlStr === ""
          ? [{ type: "paragraph", children: [{ text: "" }] }]
          : parseDocument(htmlStr).children.map(deserialize)
      );
    } else {
      let txt = "";
      slateValue.forEach((ele) => (txt += serialize(ele)));
      setHtmlStr(txt);
    }
    setIsHtmlMode((state) => !state);
  };

  const handleSave = () => {
    if (isHtmlMode) {
      form.setFieldValue("itemDetail", htmlStr);
    } else {
      let txt = "";
      slateValue.forEach((ele) => (txt += serialize(ele)));
      form.setFieldValue("itemDetail", txt);
    }
    onCancel();
  };

  useEffect(() => {
    if (open) {
      const str = form.getFieldValue("itemDetail") ?? "<p></p>";
      setHtmlStr(str);
      setSlateValue(parseDocument(str).children.map(deserialize));
    } else {
      setIsHtmlMode(false);
    }
  }, [open]);

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
        <Flex justify="space-between">
          <Button type="secondary" onClick={handleSwitchMode}>
            {isHtmlMode ? "切換排版模式" : "切換原始碼模式"}
          </Button>

          <Button type="primary" onClick={handleSave}>
            儲存
          </Button>
        </Flex>

        {isHtmlMode ? (
          <TextArea
            style={{ height: 500 }}
            value={htmlStr}
            onChange={(e) => setHtmlStr(e.target.value)}
          />
        ) : (
          <TextEditor outerValue={slateValue} getValue={getValue} />
        )}
      </Flex>
    </Modal>
  );
}
