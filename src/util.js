export function gridNeighbors(i, j, rows, cols) {
    // const possibleNeighbors = [[i-1, j-1], [i-1, j], [i-1, j+1], [i, j-1], [i, j+1], [i+1, j-1], [i+1, j], [i+1, j+1]];
    const possibleNeighbors = [[i-1, j], [i, j-1], [i, j+1], [i+1, j]];
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

export function sameCoordinates(coor1, coor2) {
    return (coor1[0]===coor2[0] && coor1[1]===coor2[1]);
}

export function changeValue(dict, key, newValue) {
    dict[key].value = newValue;
}