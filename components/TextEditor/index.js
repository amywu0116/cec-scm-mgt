"use client";
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
import {
  Editable,
  Slate,
  useSlate,
  useSlateStatic,
  withReact,
} from "slate-react";

import { Button, Icon, Toolbar } from "./components.js";
import styled from "styled-components";

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

const removeFormatting = (editor) => {
  const marks = Editor.marks(editor);
  if (marks) {
    Object.keys(marks).forEach((mark) => {
      Editor.removeMark(editor, mark);
    });
  }
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
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
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
  return (
    <Button active={isActive} onMouseDown={onOpen}>
      <Icon>{icon}</Icon>
      {open && (
        <div style={{ position: "absolute", zIndex: 9999 }}>
          <div style={{ position: "fixed", inset: 0 }} onClick={onClose} />
          <SketchPicker color={color} onChangeComplete={onChangeComplete} />
        </div>
      )}
    </Button>
  );
};

const RemoveFormatButton = () => {
  const editor = useSlateStatic();
  return (
    <Button
      onMouseDown={(e) => {
        e.preventDefault();
        removeFormatting(editor);
      }}
    >
      <Icon>format_clear</Icon>
    </Button>
  );
};

const undo = (editor) => {
  HistoryEditor.undo(editor);
};

const UndoButton = () => {
  const editor = useSlate();
  const canUndo = editor.history.undos.length > 0;
  return (
    <Button
      active={canUndo}
      onMouseDown={(e) => {
        e.preventDefault();
        undo(editor);
      }}
    >
      <Icon>undo</Icon>
    </Button>
  );
};

const redo = (editor) => {
  HistoryEditor.redo(editor);
};

const RedoButton = () => {
  const editor = useSlate();
  const canRedo = editor.history.redos.length > 0;
  return (
    <Button
      active={canRedo}
      onMouseDown={(e) => {
        e.preventDefault();
        redo(editor);
      }}
    >
      <Icon>redo</Icon>
    </Button>
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

  useEffect(() => {
    setValue(outerValue);
  }, [outerValue]);

  console.log("value", value);

  return (
    <Container>
      <Slate
        editor={editor}
        initialValue={outerValue}
        value={value}
        onChange={(newValue) => {
          console.log("newValue", newValue);
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
            onClose={() => {
              setShowColorPicker((state) => ({
                ...state,
                textColor: false,
              }));
            }}
            onChangeComplete={handleCompleteTextColor}
          />
          <ColorButton
            format="textBgColor"
            icon="format_color_fill"
            color={textBgColor}
            open={showColorPicker.textBgColor}
            onOpen={handleOpenTextBgColorPicker}
            onClose={() => {
              setShowColorPicker((state) => ({
                ...state,
                textBgColor: false,
              }));
            }}
            onChangeComplete={handleCompleteTextBgColor}
          />

          <BlockButton format="left" icon="format_align_left" />
          <BlockButton format="center" icon="format_align_center" />
          <BlockButton format="right" icon="format_align_right" />

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
