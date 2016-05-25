import React, { Component } from 'react';
import { keys, sortBy, values, every, flatMap } from 'lodash';

export default class App extends Component {
  constructor() {
    super();
    let tiles = this.setMines(this.buildGrid());
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        tiles[i][j].surrounding = this.calculateSurrounding(tiles[i][j], tiles);
      }
    }
    this.state = { tiles };
    this.onClick = this.onClick.bind(this);
  }
  buildGrid() {
    const tiles = {};
    for (let i = 0; i < 9; i++) {
      tiles[i] = {};
      for (let j = 0; j < 9; j++) {
        tiles[i][j] = { isMine : false, surrounding : 0, exposed : false, x : i, y : j };
      }
    }
    return tiles;
  }
  setMines(tiles) {
    for (let i = 0; i < 10; i++) {
      tiles[this.getRandomIntInclusive(0, 8)][this.getRandomIntInclusive(0, 8)].isMine = true;
    }
    return tiles;
  }
  calculateSurrounding(tile, tiles) {
    if (tile) {
      return this.getAdj(tile, tiles).filter(cell => cell.isMine).length;
    } else {
      return 0;
    }
  }
  getAdj(tile, tiles) {
    let adjacent = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (tiles[i+tile.x]) adjacent.push(tiles[i+tile.x][j+tile.y]);
      }
    }
    return adjacent.filter((cell) => cell);
  }
  getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  onClick(cell) {
    cell.exposed = true;
    if (cell.surrounding === 0) {
      this.getAdj(cell, this.state.tiles).filter((cell) => !cell.isMine && !cell.exposed).forEach(this.onClick);
    }
    this.setState({ win: this.didYouWin(this.state.tiles)});
  }
  didYouWin(tiles) {
    console.log(values(flatMap(values(tiles))));
    return every(values(flatMap(values(tiles))), (cell) => cell.isMine || cell.exposed);
  }
  render() {
    if (this.state.win) {
      return (
        <h1>You WIN!!!!</h1>
      );
    }
    return (
      <table>
        {sortBy(keys(this.state.tiles)).map((rowIdx) => {
          let row = this.state.tiles[rowIdx];
          return (
            <tr>
              {sortBy(keys(row)).map((cellIdx) => {
                let cell = row[cellIdx];
                return (
                  <td onClick={() => this.onClick(cell)}
                    style={{border : '1px solid black', height: 50, width: 50}}>
                    {cell.exposed ? (cell.isMine ? 'BOMB!!!' : cell.surrounding) : false}
                  </td>
                )
              })}
            </tr>
          )})}
      </table>
    );
  }
}
