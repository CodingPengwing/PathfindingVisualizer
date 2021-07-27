export function gridNeighbors(i, j, rows, cols) {
    const possibleNeighbors = [[i-1, j-1], [i-1, j], [i-1, j+1], [i, j-1], [i, j], [i, j+1], [i+1, j-1], [i+1, j], [i+1, j+1]];
    var neighbors = [];
    for (let k = 0; k < possibleNeighbors.length; k++) {
        if (0 <= possibleNeighbors[k][0] && possibleNeighbors[k][0] < rows) {
            if (0 <= possibleNeighbors[k][1] && possibleNeighbors[k][1] < cols) {
                neighbors.push(possibleNeighbors[k]);
            }
        }
    }
    return neighbors;
}