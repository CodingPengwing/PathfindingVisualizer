import { ORIGIN, GOAL, FRONTIER, EXPLORED, PATH, ROWS, COLUMNS } from "../PathfindingVisualizer";
import { sameCoordinates, changeValue, randomIntFromInterval } from "../util";
var takeSnapshot;

export function search(props) {
    const nodes = props.nodes;
    takeSnapshot = props.takeSnapshot;
    let origin_c;
    let goal_c;

    let x1 = randomIntFromInterval(0, ROWS-1);
    let y1 = randomIntFromInterval(0, COLUMNS-1);
    let x2 = randomIntFromInterval(0, ROWS-1);
    let y2 = randomIntFromInterval(0, COLUMNS-1);
    // Hard code for testing purposes
    nodes[[x1,y1]].value = ORIGIN;
    nodes[[x2,y2]].value = GOAL;
    // ------------------------------

    for (var node in nodes) {
        if (nodes[node].value === ORIGIN) {
            origin_c = node;
        }
        if (nodes[node].value === GOAL) {
            goal_c = node;
        }
    }
    if (origin_c && goal_c) {
        BFS(nodes, origin_c, goal_c);
    }
}

function BFS(nodes, origin_c, goal_c) {
    takeSnapshot(nodes);

    if (sameCoordinates(origin_c, goal_c)) {
        return [origin_c];
    }
    var frontier = [], explored = [], traverseFrom = {};
    frontier.push("" + origin_c);
    traverseFrom["" + origin_c] = null;
    takeSnapshot(nodes);

    var _c, node;
    while (true) {
        // Failed to find the goal
        if (!frontier.length) {
            return [];
        }
        _c = frontier[0];
        explored.push(_c);
        frontier.shift();
        if (_c !== "" + origin_c) {
            changeValue(nodes, _c, EXPLORED);
        }
        takeSnapshot(nodes);

        node = nodes[_c];
        for (let i = 0; i < node.neighbors.length; i++) {
            let neighbor = "" + node.neighbors[i];
            if (!frontier.includes(neighbor) && !explored.includes(neighbor)) {
                if (goalTest(nodes[neighbor])) {
                    traverseFrom[neighbor] = _c;
                    let path = [neighbor];
                    let curr = neighbor;
                    while (curr) {
                        path.push(traverseFrom[curr]);
                        curr = traverseFrom[curr];
                        if (curr) {
                            if (curr !== "" + origin_c) {
                                changeValue(nodes, curr, PATH);
                            }
                            takeSnapshot(nodes);
                        }
                    }
                    
                    return path;
                }
                frontier.push("" + neighbor);
                traverseFrom[neighbor] = _c;
                // console.log(traverseFrom);
                changeValue(nodes, neighbor, FRONTIER);
                takeSnapshot(nodes);
            }
        }
    }
}

function goalTest(node) {
    if (node.value === GOAL) { return true; }
    return false;
}
