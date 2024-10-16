"use client";
import { Tooltip } from "antd";
import isHotkey from "is-hotkey";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SketchPicker } from "react-color";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { Editable, Slate, useSlate, withReact } from "slate-react";
import styled from "styled-components";

import { Button, Icon, Toolbar } from "./components.js";

const Container = styled.div`
  width: 100%;
  height: 500px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
`;

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+shift+x": "strikethrough",
  "mod+z": "undo",
  "mod+y": "redo",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const toggleTextColor = (editor, color) => {
  Editor.addMark(editor, "textColor", color);
};

const toggleTextBgColor = (editor, color) => {
  Editor.addMark(editor, "textBgColor", color);
};

const Element = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };

  const indentLevel = element.indent || 0;
  const paddingLeft = `${indentLevel * 40}px`;

  switch (element.type) {
    case "heading-one":
      return (
        <h1 style={{ ...style, paddingLeft }} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={{ ...style, paddingLeft: "revert" }} {...attributes}>
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul style={{ ...style, paddingLeft: "revert" }} {...attributes}>
          {children}
        </ul>
      );
    default:
      return (
        <p style={{ ...style, paddingLeft }} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <i>{children}</i>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  if (leaf.textColor) {
    children = <span style={{ color: leaf.textColor }}>{children}</span>;
  }

  if (leaf.textBgColor) {
    children = (
      <span style={{ backgroundColor: leaf.textBgColor }}>{children}</span>
    );
  }

  return <span {...attributes}>{children}</span>;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  if (["textColor", "textBgColor"].includes(format)) {
    return marks && !!marks[format];
  }
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();

  let tooltipTitle = "";
  switch (format) {
    case "bold":
      tooltipTitle = "粗體";
      break;
    case "italic":
      tooltipTitle = "斜體";
      break;
    case "underline":
      tooltipTitle = "底線";
      break;
    case "strikethrough":
      tooltipTitle = "刪除線";
      break;
    default:
      break;
  }

  return (
    <Tooltip placement="bottom" title={tooltipTitle}>
      <Button
        active={isMarkActive(editor, format)}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, format);
        }}
      >
        <Icon>{icon}</Icon>
      </Button>
    </Tooltip>
  );
};

const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        return (
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n["type"] === format
        );
      },
    })
  );

  return !!match;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();

  let tooltipTitle = "";
  switch (format) {
    case "heading-one":
      tooltipTitle = "標題一";
      break;
    case "heading-two":
      tooltipTitle = "標題二";
      break;
    case "heading-three":
      tooltipTitle = "標題三";
      break;
    case "numbered-list":
      tooltipTitle = "編號清單";
      break;
    case "bulleted-list":
      tooltipTitle = "項目符號清單";
      break;
    case "increase-indent":
      tooltipTitle = "增加縮排";
      break;
    case "decrease-indent":
      tooltipTitle = "減沙縮排";
      break;
    default:
      break;
  }

  const increaseIndent = (editor) => {
    const { selection } = editor;
    if (!selection) return;

    const [match] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n),
    });

    if (match) {
      const [node] = match;
      const indentLevel = node.indent || 0;
      Transforms.setNodes(editor, { indent: indentLevel + 1 });
    }
  };

  const decreaseIndent = (editor) => {
    const { selection } = editor;
    if (!selection) return;

    const [match] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n),
    });

    if (match) {
      const [node] = match;
      const indentLevel = node.indent || 0;
      if (indentLevel > 0) {
        Transforms.setNodes(editor, { indent: indentLevel - 1 });
      }
    }
  };

  return (
    <Tooltip placement="bottom" title={tooltipTitle}>
      <Button
        active={isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          if (format === "increase-indent") {
            increaseIndent(editor);
          } else if (format === "decrease-indent") {
            decreaseIndent(editor);
          } else {
            toggleBlock(editor, format);
          }
        }}
      >
        <Icon>{icon}</Icon>
      </Button>
    </Tooltip>
  );
};

const AlignButton = ({ format, icon }) => {
  const editor = useSlate();

  let tooltipTitle = "";
  switch (format) {
    case "left":
      tooltipTitle = "靠左對齊";
      break;
    case "center":
      tooltipTitle = "置中對齊";
      break;
    case "right":
      tooltipTitle = "靠右對齊";
      break;
    default:
      break;
  }

  const isActive = () => {
    const { selection } = editor;
    if (!selection) return false;
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n["align"] === format,
      })
    );
    return !!match;
  };

  const toggle = () => {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        !TEXT_ALIGN_TYPES.includes(format),
      split: true,
    });

    const newProperties = {
      align: isActive() ? undefined : format,
    };

    Transforms.setNodes(editor, newProperties);

    if (!isActive()) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  return (
    <Tooltip placement="bottom" title={tooltipTitle}>
      <Button
        active={isActive()}
        onMouseDown={(e) => {
          e.preventDefault();
          toggle();
        }}
      >
        <Icon>{icon}</Icon>
      </Button>
    </Tooltip>
  );
};

const ColorButton = ({
  format,
  icon,
  color,
  open,
  onOpen,
  onClose,
  onChangeComplete,
}) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);

  let tooltipTitle = "";
  switch (format) {
    case "textColor":
      tooltipTitle = "文字顏色";
      break;
    case "textBgColor":
      tooltipTitle = "醒目顯示顏色";
      break;
    default:
      break;
  }

  return (
    <Tooltip placement="bottom" title={tooltipTitle}>
      <Button active={isActive} onMouseDown={onOpen}>
        <Icon>{icon}</Icon>
        {open && (
          <div style={{ position: "absolute", zIndex: 9999 }}>
            <div style={{ position: "fixed", inset: 0 }} onClick={onClose} />
            <SketchPicker color={color} onChangeComplete={onChangeComplete} />
          </div>
        )}
      </Button>
    </Tooltip>
  );
};

const RemoveFormatButton = () => {
  const editor = useSlate();

  const isActive = () => {
    const { selection } = editor;
    if (!selection) return false;

    const marks = Editor.marks(editor);
    const isMarkActive = marks && Object.keys(marks).length > 0;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) => {
          return (
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            (n["align"] || n["indent"])
          );
        },
      })
    );
    const isBlockActive = !!match;

    return isMarkActive || isBlockActive;
  };

  const removeFormatting = () => {
    const marks = Editor.marks(editor);
    if (marks) {
      Object.keys(marks).forEach((mark) => {
        Editor.removeMark(editor, mark); // 移除所有 inline 樣式
      });
    }

    // 移除區塊屬性 align 和 indent
    Transforms.setNodes(
      editor,
      { align: undefined, indent: undefined },
      { match: (n) => SlateElement.isElement(n) }
    );
  };

  return (
    <Tooltip placement="bottom" title="清除格式">
      <Button
        active={isActive()}
        onMouseDown={(e) => {
          e.preventDefault();
          removeFormatting(editor);
        }}
      >
        <Icon>format_clear</Icon>
      </Button>
    </Tooltip>
  );
};

const undo = (editor) => {
  HistoryEditor.undo(editor);
};

const UndoButton = () => {
  const editor = useSlate();
  const canUndo = editor.history.undos.length > 0;
  return (
    <Tooltip placement="bottom" title="復原">
      <Button
        active={canUndo}
        onMouseDown={(e) => {
          e.preventDefault();
          undo(editor);
        }}
      >
        <Icon>undo</Icon>
      </Button>
    </Tooltip>
  );
};

const redo = (editor) => {
  HistoryEditor.redo(editor);
};

const RedoButton = () => {
  const editor = useSlate();
  const canRedo = editor.history.redos.length > 0;
  return (
    <Tooltip placement="bottom" title="取消復原">
      <Button
        active={canRedo}
        onMouseDown={(e) => {
          e.preventDefault();
          redo(editor);
        }}
      >
        <Icon>redo</Icon>
      </Button>
    </Tooltip>
  );
};

export default function TextEditor(props) {
  const { outerValue, getValue } = props;

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [value, setValue] = useState([{ text: "" }]);

  const [textColor, setTextColor] = useState("");
  const [textBgColor, setTextBgColor] = useState("");

  const [showColorPicker, setShowColorPicker] = useState({
    textColor: false,
    textBgColor: false,
  });

  const handleCompleteTextColor = (color) => {
    toggleTextColor(editor, color.hex);
    setTextColor(color.hex);
    setShowColorPicker((state) => ({ ...state, textColor: false }));
  };

  const handleCompleteTextBgColor = (color) => {
    toggleTextBgColor(editor, color.hex);
    setTextBgColor(color.hex);
    setShowColorPicker((state) => ({ ...state, textBgColor: false }));
  };

  const handleOpenTextColorPicker = (e) => {
    e.preventDefault();
    const marks = Editor.marks(editor);
    if (marks && marks.textColor) {
      setTextColor(marks.textColor);
    }
    setShowColorPicker((state) => ({ ...state, textColor: true }));
  };

  const handleOpenTextBgColorPicker = (e) => {
    e.preventDefault();
    const marks = Editor.marks(editor);
    if (marks && marks.textBgColor) {
      setTextBgColor(marks.textBgColor);
    }
    setShowColorPicker((state) => ({ ...state, textBgColor: true }));
  };

  const handleKeyDown = (e) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, e)) {
        e.preventDefault();

        if (hotkey === "mod+z") {
          undo(editor);
        } else if (hotkey === "mod+y") {
          redo(editor);
        } else {
          const mark = HOTKEYS[hotkey];
          toggleMark(editor, mark);
        }
      }
    }
  };

  const handleCloseColorPicker = (key) => {
    setShowColorPicker((state) => ({
      ...state,
      [key]: false,
    }));
  };

  useEffect(() => {
    setValue(outerValue);
  }, [outerValue]);

  return (
    <Container>
      <Slate
        editor={editor}
        initialValue={outerValue}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          getValue(newValue);
        }}
      >
        <Toolbar>
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <MarkButton format="strikethrough" icon="format_strikethrough" />

          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" />
          <BlockButton format="heading-three" icon="looks_3" />

          <ColorButton
            format="textColor"
            icon="format_color_text"
            color={textColor}
            open={showColorPicker.textColor}
            onOpen={handleOpenTextColorPicker}
            onClose={() => handleCloseColorPicker("textColor")}
            onChangeComplete={handleCompleteTextColor}
          />
          <ColorButton
            format="textBgColor"
            icon="format_color_fill"
            color={textBgColor}
            open={showColorPicker.textBgColor}
            onOpen={handleOpenTextBgColorPicker}
            onClose={() => handleCloseColorPicker("textBgColor")}
            onChangeComplete={handleCompleteTextBgColor}
          />

          <AlignButton format="left" icon="format_align_left" />
          <AlignButton format="center" icon="format_align_center" />
          <AlignButton format="right" icon="format_align_right" />

          <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" />

          <BlockButton format="increase-indent" icon="format_indent_increase" />
          <BlockButton format="decrease-indent" icon="format_indent_decrease" />

          <RemoveFormatButton />

          <UndoButton />
          <RedoButton />
        </Toolbar>

        <Editable
          style={{ overflowX: "hidden", height: 380, padding: 5 }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          onKeyDown={handleKeyDown}
        />
      </Slate>
    </Container>
  );
}
