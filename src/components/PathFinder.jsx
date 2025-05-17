import React, {useEffect, useState} from 'react'
import FlowNode from './FlowNode';
import {dijkstra, getShortestPath} from '../algorithms/dijkstra';

const PathFinder = () => {

    const NO_ROWS = 20;
    const NO_COLS = 50;

    // const START_ROW = NO_ROWS - NO_ROWS; const START_col = NO_COLS - NO_COLS;
    // const END_ROW = NO_ROWS - 1; const END_COL = NO_COLS - 1;

    const [grid,
        setGrid] = useState([]);

    const [showPopup,
        setShowPopup] = React.useState(false);
    const [showError,
        setShowError] = React.useState(false);

    const [ALGORITHM,
        setAlgorithm] = useState("dijkstra");
    const [visitedCount,
        setVisitCount] = React.useState(0);
    const [totalTime,
        setTotalTime] = React.useState(0);
    const [distance,
        setDistance] = React.useState(0);
    const [startX,
        setStartX] = React.useState(null);
    const [startY,
        setStartY] = React.useState(null);
    const [endX,
        setEndX] = React.useState(null);
    const [endY,
        setEndY] = React.useState(null);
    const [clear,
        setReset] = React.useState(false);

    const reset = () => {
        setStartX(null);
        setStartY(null);
        setEndX(null);
        setEndY(null);
        setTotalTime(0);
        setDistance(0);
        setVisitCount(0);
        setShowPopup(false);
        const newGrid = grid.map(row => row.map(node => ({
            ...node,
            visited: false,
            isPath: false
        })));
        setGrid(newGrid);
        setReset(false);
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const notifyPathFound = () => {
        setShowPopup(true);
    };
    const openError = () => {
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
    };

    const calculatePath = async(name) => {
        if (startX == null || startY == null || endX == null || endY == null) {
            openError();
            return;
        }
        setShowError(false);
        const startTime = performance.now();
        let algorithmTime = 0;
        switch (name) {
            case "dijkstra":
                const visitedNodesInOrder = dijkstra(grid, grid[startX][startY], grid[endX][endY]);
                const shortestPathNodes = getShortestPath(grid[endX][endY]);
                const endTime = performance.now();
                algorithmTime = endTime - startTime;
                notifyPathFound();
                setTotalTime(algorithmTime);

                for (let i = 0; i < visitedNodesInOrder.length; i++) {
                    setVisitCount(i + 1);
                    const node = visitedNodesInOrder[i];
                    setDistance(prevMax => Math.max(prevMax, node.distance));

                    await sleep(1);
                    setGrid(prevGrid => prevGrid.map(row => row.map(n => {
                        if (n.row === node.row && n.col === node.col && !n.isStart && !n.isEnd && !n.visited) {
                            return {
                                ...n,
                                visited: true
                            };
                        }
                        return n;
                    })));
                }

                for (let i = 0; i < shortestPathNodes.length; i++) {
                    const node = shortestPathNodes[i];
                    await sleep(1);
                    setGrid(prevGrid => prevGrid.map(row => row.map(n => {
                        if (n.row === node.row && n.col === node.col && !n.isStart && !n.isEnd) {
                            return {
                                ...n,
                                isPath: true
                            };
                        }
                        return n;
                    })));
                }
                setReset(true);
                break;

            default:
                alert("Under Construction Please choose other Algorithms");
        }
        console.log(`Algorithm took ${algorithmTime.toFixed(2)} ms`);

    };

    const handleNodeClick = (x, y) => {
        console.log("Clicked node at:", x, y);
        if (x === startX && y === startY) {
            setStartX(null);
            setStartY(null)
        } else if (x === endX && y === endY) {
            setEndX(null);
            setEndY(null);
        } else if (!startX && !startY) {
            setStartX(x);
            setStartY(y);
        } else if (!endX && !endY) {
            setEndX(x);
            setEndY(y);
        }
    };

    useEffect(() => {
        const newGrid = [];
        for (let row = 0; row < NO_ROWS; row++) {
            const rowGrids = [];
            for (let col = 0; col < NO_COLS; col++) {
                rowGrids.push({
                    "row": row,
                    "col": col,
                    "distance": Infinity,
                    "wall": false,
                    "isPath": false,
                    "visited": false,
                    "previousNode": null,
                    "isStart": row == startX && col == startY, //row == START_ROW && col == START_col ,
                    "isEnd": row == endX && col == endY //row == END_ROW && col == END_COL
                })
            }
            newGrid.push(rowGrids);
        }
        setGrid(newGrid);
    }, [startX, startY, endX, endY]);

    return (

        <div className='container'>
            {showPopup && (
                <div className="popup-notification success">
                    Path found successfully!
                </div>
            )}

            {showError && (
                <div className="popup-notification failure">
                    Error !
                </div>
            )}
            <div className='header'>
                <h1 className='title'>Shortest Path Visualization
                    <span className='owner'>by Akashee</span>
                </h1>
            </div>
            <div className='grid'>
                {grid.map((row, rowIdx) => (
                    <div
                        key={rowIdx}
                        style={{
                        display: 'flex'
                    }}>
                        {row.map((node, nodeIdx) => (<FlowNode
                            onClick={() => handleNodeClick(rowIdx, nodeIdx)}
                            key={nodeIdx}
                            {...node}/>))}
                    </div>
                ))
}
            </div>
            <div className='footer'>

                {clear
                    ? (
                        <button className='btn' onClick={reset}>
                            Clear
                        </button>
                    )
                    : (
                        <button className='btn' onClick={() => calculatePath(ALGORITHM)}>
                            Find Short Path
                        </button>
                    )}

                <div className="footer-stats">
                    <div>
                        <strong>Visited Nodes:</strong>
                        {visitedCount}</div>
                    <div>
                        <strong>Total Time:</strong>
                        {totalTime.toFixed(2)}
                        ms</div>
                    <div>
                        <strong>Distance:</strong>
                        {distance}</div>
                </div>

                <div className="dropdown-container">

                    <select
                        className="dropdown-select"
                        value={ALGORITHM}
                        onChange={e => setAlgorithm(e.target.value)}>
                        <option value="dijkstra">Dijkstra</option>
                        <option value="a_star">A*</option>
                        <option value="bfs">BFS</option>
                        <option value="dfs">DFS</option>
                    </select>

                </div>
            </div>

        </div>
    )
}

export default PathFinder
