export function dijkstra(grid, startNode, endNode) {
    const visitedNode = [];
    startNode.distance = 0;
    const unVisitedNodes = getAllNodes(grid);

    while (unVisitedNodes.length > 0) {
        unVisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
        const closestNode = unVisitedNodes.shift();
        if (closestNode.distance === Infinity){
            return visitedNodesInOrder;
        } 
        if (closestNode.visit){
            continue;
        }
        closestNode.visit = true;
        console.log("Visited X :"+closestNode.row +" Y :"+closestNode.col);
        console.log("Distance "+closestNode.distance );
        visitedNode.push(closestNode);
        if (closestNode === endNode) {
            return visitedNode;
        }
        updateUnvisitedNeighbors(closestNode, grid);
    }
    console.log(visitedNode);
    return visitedNode;
}

function updateUnvisitedNeighbors(node, grid) {
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (let neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
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

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

export function getShortestPath(endNode) {
    const path = [];
    let current = endNode;
    console.log(current);
    while (current !== null) {
        path.unshift(current);
        current = current.previousNode;
    }
    return path;
}