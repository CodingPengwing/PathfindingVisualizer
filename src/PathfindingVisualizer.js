import React from 'react';
import styles from "./PathfindingVisualizer.module.scss";
import { useState } from 'react';
import { Button } from '@material-ui/core';
import { search as BFS } from "./SearchingAlgorithms/BFS";
import { gridNeighbors } from "./util";

export const ROWS = 15;
export const COLUMNS = 38;

export const GOAL = 0;
export const ORIGIN = 1;
export const PATH = 2;
export const EXPLORED = 3;
export const FRONTIER = 4;

const ANIMATION_TIME = 10;


const Node = (props) => {
    const [active, setActive] = useState(false);

    const handleClick = () => {
        props.onClick();
        setActive(!active);
    }

    var color;
    switch (props.value) {
        case GOAL: color = "green"; break;
        case ORIGIN: color = "red"; break;
        case PATH: color = "yellow"; break;
        case EXPLORED: color = "purple"; break;
        case FRONTIER: color = "#666"; break;
        default: color = "white"; break;
    }

    return (
        <button 
            className={`${active? styles.nodeActive : styles.node}`} 
            // onClick={handleClick}
            style={{
                background: color
            }}
        />
    );
}
  
class Board extends React.Component {
    renderNode(i, j, key) {
        return (
            <Node 
                value={this.props.nodes[[i,j]].value} 
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
                row.push(this.renderNode(i, j, key++));
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
            nodes: generateGrid(ROWS, COLUMNS),
            rows: ROWS,
            columns: COLUMNS,

            animating: false,
        };

        this.search = BFS;

        this.history = [];
        this.clearHistory = () => {
            this.history = [];
        }

        this.timeoutIDArray = [];
        this.clearTimeouts = () => {
            for (let i = 0; i < this.timeoutIDArray.length; i++) {
                clearTimeout(this.timeoutIDArray[i]);
            }
            this.timeoutIDArray = [];
        }
        this.resumePoint = 0;

        this.takeSnapshot = (dict) => {
            try {
                this.history.push(copyDict(dict));
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
                nodes: displayState, 
                // highlights: {comparing: comparing}, 
            });
        }
    }

    doSearch() {
        this.clearTimeouts();
        this.clearHistory();
        var nodes = generateGrid(ROWS, COLUMNS);
        this.search({nodes: nodes, takeSnapshot: this.takeSnapshot});
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

    // handleClick(i, j) {
    //     var grid = this.state.grid.slice();
    //     grid[i][j] = 1;
    //     this.setState({grid: grid});
    // }

    render() {
        return (
            <div>
                <Board nodes={this.state.nodes} rows={this.state.rows} columns={this.state.columns} />
                <button className={styles.test} onClick={()=>{ this.doSearch()}}>Test</button>
            </div>
        );
    }
}

function generateGrid(rows, cols) {
    var grid = {};
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[[i,j]] = {
                value: -1,
                neighbors: gridNeighbors(i, j, rows, cols)
            };
        }
    }
    return grid;
}

function copyDict(dict) {
    var newDict = {};
    for (var node in dict) {
        newDict[node] = {
            value: dict[node].value,
            // We don't use neighbors.slice() but actually use original neighbors on purpose
            // because the neighbors of the nodes should stay consistent throughout searching
            neighbors: dict[node].neighbors
        }
    }
    return newDict;
}
