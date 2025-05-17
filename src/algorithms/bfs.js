export function bfs(grid, startNode, endNode) {
    const visitedNode = [];
    startNode.distance = 0;
    const unVisitedNodes = [startNode];
    while (unVisitedNodes.length > 0) {
        const currentNode = unVisitedNodes.shift();
        if (currentNode.distance === Infinity) {
            return visitedNode;
        }
        if (currentNode.visit) {
            continue;
        }
        currentNode.visit = true;
        visitedNode.push(currentNode);
        if (currentNode === endNode) {
            return visitedNode;
        }
        let neighbors = getNeigborNodes(currentNode, grid);
        console.log("neighbors :" + neighbors);
        if (neighbors.length > 0) {
            for (let neighbor of neighbors) {
                neighbor.previousNode = currentNode;
                neighbor.distance = currentNode.distance + 1;
                unVisitedNodes.push(neighbor);
            }
        }
    }
    console.log("Visited Nodes :" + visitedNode);
}

function getNeigborNodes(node, grid) {
    const neighbors = [];
    const {row, col} = node;
    if (row > 0) {
        neighbors.push(grid[row - 1][col]);
    }
    if (row < grid.length - 1) {
        neighbors.push(grid[row + 1][col]);
    }
    if (col > 0) {
        neighbors.push(grid[row][col - 1]);
    }
    if (col < grid[0].length - 1) {
        neighbors.push(grid[row][col + 1]);
    }
    return neighbors.filter((neighbor) => (!neighbor.visit));
}