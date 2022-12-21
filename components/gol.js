import React, { useState, useCallback, useRef } from "react";
import { IoPlay, IoStop } from "react-icons/io5";
import { Box, Button, Center, useColorModeValue, Stack } from "@chakra-ui/react";
import produce from "immer";

const numRows = 50;
const numCols = 120;

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

  const activeColor = useColorModeValue('black','white')
  const inactiveColor = useColorModeValue('#f0e7db', '#3d3d42')

  return (
    <Box w='100%' bg="#202023" p={5} mt='10' borderRadius='lg'>
      <Center>
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
      </Center>
      <Stack justifyContent='center' direction='row' pt={5} spacing={4} align='center'>
        <Button
          bgColor='#EB4595'
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
          Random
        </Button>
        <Button
          bgColor='#EB4595'
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? <IoStop /> : <IoPlay />}
          {running ? "Stop" : "Start"}
        </Button>
        <Button
          bgColor='#EB4595'
        >
          Next
        </Button>
        <Button
          bgColor='#EB4595'
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
}


export default Game;
