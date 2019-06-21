import React, { useState } from "react";
import { DragDropContext, useDrag, useDrop } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Table, Button } from "antd";
import styled from "styled-components";

const Tr = styled.tr`
  cursor: move;
  opacity: ${props => (props.isDragging ? 0.5 : 1)};
  ${props =>
    props.dropOverDirection === "down"
      ? "border-bottom: 2px dashed #1890ff;"
      : ""}
  ${props =>
    props.dropOverDirection === "up" ? "border-top: 2px dashed #1890ff;" : ""}
`;

const DEFAULT_DATASOURCE = [
  { name: "张三", age: 16, addr: "北京市朝阳区" },
  { name: "李四", age: 17, addr: "北京市东城区" },
  { name: "王五", age: 18, addr: "北京市西城区" }
];

const COLUMNS = [
  { title: "姓名", dataIndex: "name" },
  { title: "年龄", dataIndex: "age" },
  { title: "住址", dataIndex: "addr" }
];

function DraggableRow({
  index,
  draggingIndex,
  setDraggingIndex,
  moveRow,
  ...restProps
}) {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: "row" },
    begin: () => {
      setDraggingIndex(index);
      return { index };
    },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });
  const [{ isOver }, dropRef] = useDrop({
    accept: "row",
    drop: item => {
      const dragIndex = item.index;
      if (index === dragIndex) return; // 相同行
      moveRow(index, dragIndex);
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });
  let dropOverDirection = "";
  if (isOver) {
    if (index > draggingIndex) {
      dropOverDirection = "down";
    }
    if (index < draggingIndex) {
      dropOverDirection = "up";
    }
  }
  return (
    <Tr
      {...restProps}
      ref={node => dropRef(dragRef(node))}
      isDragging={isDragging}
      dropOverDirection={dropOverDirection}
    />
  );
}

function DraggableTable() {
  const [dataSource, setDataSource] = useState(DEFAULT_DATASOURCE);
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const moveRow = (srcIdx, dstIdx) => {
    const newDataSource = [...dataSource];
    // https://stackoverflow.com/questions/872310/javascript-swap-array-elements
    [newDataSource[srcIdx], newDataSource[dstIdx]] = [
      newDataSource[dstIdx],
      newDataSource[srcIdx]
    ];
    setDataSource(newDataSource);
  };
  return (
    <Table
      pagination={false}
      columns={COLUMNS}
      dataSource={dataSource}
      components={{ body: { row: DraggableRow } }}
      onRow={(_, index) => ({
        index,
        moveRow,
        draggingIndex,
        setDraggingIndex
      })}
      footer={() => (
        <Button onClick={() => console.table(dataSource)}>Log DataSource</Button>
      )}
    />
  );
}

export default DragDropContext(HTML5Backend)(DraggableTable);
