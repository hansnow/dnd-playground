import React from "react";
import { DndProvider, DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import BoardSquare from "./BoardSquare";
import Knight from "./Knight";

function renderSquare(i, knightPosition) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  return (
    <div key={i} style={{ width: "12.5%", height: "12.5%" }}>
      <BoardSquare x={x} y={y}>
        {renderPiece(x, y, knightPosition)}
      </BoardSquare>
    </div>
  );
}

function renderPiece(x, y, [knightX, knightY]) {
  if (knightX === x && knightY === y) return <Knight />;
}

function Board({ knightPosition }) {
  const squares = [];
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, knightPosition));
  }
  return (
    // <DndProvider backend={HTML5Backend}>
    <div
      style={{
        width: "300px",
        height: "300px",
        display: "flex",
        flexWrap: "wrap",
        border: "1px solid black"
      }}
    >
      {squares}
    </div>
    // </DndProvider>
  );
}

export default DragDropContext(HTML5Backend)(Board);
