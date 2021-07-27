import React from 'react';
import styles from "./PathfindingVisualizer.module.scss";
import { useState } from 'react';
import { Button } from '@material-ui/core';
import { search as BFS } from "./SearchingAlgorithms/BFS";
import { gridNeighbors } from "./util";

const ROWS = 20;
const COLUMNS = 38;

export const ORIGIN = 0;
export const GOAL = 1;
export const SEARCHED = 2;

const ANIMATION_TIME = 500;


const Cell = (props) => {
    const [active, setActive] = useState(false);

    const handleClick = () => {
        props.onClick();
        setActive(!active);
    }

    var color;
    switch (props.value) {
        case ORIGIN: color = "red"; break;
        case GOAL: color = "green"; break;
        case SEARCHED: color = "blue"; break;
        default: color = "white"; break;
    }

    return (
        <button 
            className={`${active? styles.cellActive : styles.cell}`} 
            // onClick={handleClick}
            style={{
                background: color
            }}
        />
    );
}
  
class Board extends React.Component {
    renderCell(i, j, key) {
        return (
            <Cell 
                value={this.props.grid[i][j].value} 
                // onClick={() => this.props.onClick(i, j)}
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
            rows.push(<div className={styles.row} key={i}>{row}</div>);
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
            grid: generateGrid(ROWS, COLUMNS),
            rows: ROWS,
            columns: COLUMNS,

            animating: false,
        };

        this.search = BFS;

        this.history = [];
        this.clearHistory = () => {
            this.history = [];
        }
        this.clearForwardHistory = () => {
        }

        this.timeoutIDArray = [];

        this.resumePoint = 0;

        this.takeSnapshot = (grid) => {
            try {
                this.history.push(copyGrid(grid));
            } catch (e) {
                console.error("Error: takeSnapshot arguments are not well defined.\n", e);
            }
        }
    }

    componentDidMount() {
    }

    goToState(i) {
        if (i < this.history.length) {
            var displayState = this.history[i];
            this.resumePoint = i;
            this.setState({
                grid: displayState, 
                // highlights: {comparing: comparing}, 
            });
        }
    }

    doSearch() {
        this.search({grid: this.state.grid, takeSnapshot: this.takeSnapshot});
        this.animateHistory(0);
    }

    animateHistory(startPoint) {
        if (!startPoint) { startPoint = 0; }
        if (this.startPoint >= this.history.length - 1) {
            return;
        }
        this.setState({animating: true});
        var pauseTime;
        var count = 1;
        for (let i = startPoint; i < this.history.length; i++) {
            pauseTime = ANIMATION_TIME * count;
            let timeoutID = setTimeout(() => {
                this.goToState(i);
                if (i === this.history.length - 1) { this.setState({animating: false}); }
            }, pauseTime);

            this.timeoutIDArray.push(timeoutID);
            count++;
        }
    }

    handleClick(i, j) {
        var grid = this.state.grid.slice();
        grid[i][j] = 1;
        this.setState({grid: grid});
    }

    render() {
        return (
            <div>
                <Board grid={this.state.grid} rows={this.state.rows} columns={this.state.columns} onClick={(i, j)=>this.handleClick(i, j)}/>
                <button onClick={()=>{this.doSearch()}}>Test</button>
            </div>
        );
    }
}

function generateGrid(rows, cols) {
    var grid = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            row.push({
                value: -1,
                neighbors: gridNeighbors(i, j, rows, cols)
            });
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
            row[j] = {
                value: grid[i][j].value,
                // We are purposefully using the same reference to neighbors 
                // because different states should have the same orientations.
                neighbors: grid[i][j].neighbors
            };
        }
        newGrid[i] = row;
    }
    return newGrid;
}
