import { ORIGIN, GOAL, SEARCHED } from "../PathfindingVisualizer";

var takeSnapshot;

export function search(props) {
    const grid = props.grid;
    takeSnapshot = props.takeSnapshot;
    let origin;
    let goal;
    for (let i = 0; i < props.length; i++) {
        for (let j = 0; j < props; j++) {
            if (grid[i][j] === ORIGIN) {
                origin = [i, j];
            }
            if (grid[i][j] === GOAL) {
                goal = [i, j];
            }
        }
    }
    if (origin && goal) {
        BFS(grid, origin, goal);
    }
}

function BFS(grid, origin, goal) {
    
}
