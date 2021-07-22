import React from 'react';

import './PathfindingVisualizer.css';

function Cell(props) {
    return (
        <button className="cell" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderCell(i, j, key) {
        return (
            <Cell 
                value={this.props.grid[i][j]} 
                onClick={() => this.props.onClick(i, j)}
                key={key}
            />
        );
    }

    render() {
        var rows = [];
        var key = 0;
        for (let i = 0; i < this.props.rows; i++) {
            var row = [];
            for (let j = 0; j < this.props.columns; j++) {
                row.push(this.renderCell(i, j, key++));
            }
            rows.push(<div className="row" key={i}>{row}</div>);
        }
        return (
            <div className="board">
                {rows}
            </div>
        );
    }
}

export default class PathfindingVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: generateGrid(30, 30),
            rows: 30,
            columns: 30,

        };
    }

    componentDidMount() {
    }

    handleClick(i, j) {
        var grid = this.state.grid.slice();
        grid[i][j] = 1;
        this.setState({grid: grid});
    }

    render() {
        return (
            <div>
                <Board grid={this.state.grid} rows={this.state.rows} columns={this.state.columns} onClick={(i, j)=>this.handleClick(i, j)}> </Board>
            </div>
        );
    }
}

function generateGrid(rows, columns) {
    var grid = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push(0);
        }
        grid.push(row);
    }
    return grid;
}

function copyGrid(grid) {
    var newGrid = [];
    for (let i = 0; i < grid.length; i++) {
        var row = [];
        for (let j = 0; j < grid[i].length; j++) {
            row[j] = grid[i][j];
        }
        newGrid[i] = row;
    }
    return newGrid;
}
