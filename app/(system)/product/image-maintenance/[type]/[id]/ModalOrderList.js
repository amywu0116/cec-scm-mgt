import {
  DeleteOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Flex, Image, Space, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Button from "@/components/Button";
import Modal from "@/components/Modal";

export default function ModalOrderList(props) {
  const { rowInfo, open, loading, onOk, onCancel } = props;

  const [orderList, setOrderList] = useState([]);

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    background: "transparent",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: "lightgrey",
    display: "flex",
    padding: grid,
    overflow: "auto",
  });

  const handleDragEnd = (result) => {
    const newList = [...orderList];
    const sourceIdx = result.source.index;
    const item = newList.splice(sourceIdx, 1)[0];
    const destinationIdx = result.destination.index;
    newList.splice(destinationIdx, 0, item);
    setOrderList(newList);
  };

  useEffect(() => {
    if (!open) return;
    setOrderList(rowInfo.imgList);
  }, [open]);

  return (
    <Modal
      title="編輯圖片排序"
      centered
      closeIcon={false}
      width={1000}
      open={open}
      onCancel={onCancel}
      footer={(_, { OkBtn, CancelBtn }) => (
        <Flex gap={16} justify="flex-end" align="center">
          <Button disabled={loading} onClick={onCancel}>
            取消
          </Button>

          <Button
            type="primary"
            loading={loading}
            onClick={() => onOk(rowInfo.imgType, orderList)}
          >
            確定
          </Button>
        </Flex>
      )}
    >
      <Spin spinning={loading}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {orderList.map((t, index) => (
                  <Draggable
                    key={String(t.id)}
                    draggableId={String(t.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <Image
                          width={80}
                          height={80}
                          src={t.imgUrl}
                          alt=""
                          preview={false}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Spin>
    </Modal>
  );
}
