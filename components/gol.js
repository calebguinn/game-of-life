import React, { useState, useCallback, useRef } from "react";
import { Button, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";

const numRows = 50;
const numCols = 100;

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

function Game() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newX = i + x;
              const newY = j + y;
              if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
                neighbors += g[newX][newY];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  const activeColor = useColorModeValue('#202023','#f0e7db')
  const inactiveColor = useColorModeValue('#f0e7db', '#202023')

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 10px)`
        }}
      >
        {grid.map((rows, i) => rows.map((col, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][j] = grid[i][j] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            style={{
              width: 10,
              height: 10,
              backgroundColor: grid[i][j] ? `${activeColor}` : undefined,
              border: "solid 0.5px",
              borderColor: `${inactiveColor}`
            }} />
          ))
        )}
      </div>
      <Button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </Button>
      <Button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        random
      </Button>
      <Button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </Button>
    </>
  );
}


export default Game;
