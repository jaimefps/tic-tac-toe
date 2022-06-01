import { rerender, VanillaState } from "use-vanilla-state"
import "./App.css"

const initBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
] as (Mark | null)[][]

type Mark = "X" | "O"
type Board = typeof initBoard

type WinState =
  | {
      mark: Mark
      line: number[][]
    }
  | {
      mark: "DRAW"
      line: null
    }
  | null

export class GameState extends VanillaState {
  private board: Board = this.cloneBoard(initBoard)

  @rerender
  play(loc: { y: number; x: number }) {
    const nextBoard = this.cloneBoard(this.board)
    nextBoard[loc.y][loc.x] = this.turn()
    this.board = nextBoard
    return this
  }

  @rerender
  restart() {
    this.board = this.cloneBoard(initBoard)
    return this
  }

  private cloneBoard(b: Board) {
    return b.map((r) => [...r])
  }
  private winMark(): Mark {
    return this.turn() === "O" ? "X" : "O"
  }
  private findWinRow() {
    const b = this.board
    for (let i = 0; i < 3; i++) {
      const row = b[i]
      if (this.hasWinLine(row)) {
        return {
          mark: this.winMark(),
          line: [
            [i, 0],
            [i, 1],
            [i, 2]
          ]
        }
      }
    }
  }
  private findWinColumn() {
    const b = this.board
    for (let i = 0; i < 3; i++) {
      const column = i
      if (this.hasWinLine([b[0][column], b[1][column], b[2][column]])) {
        return {
          mark: this.winMark(),
          line: [
            [0, column],
            [1, column],
            [2, column]
          ]
        }
      }
    }
  }
  private findWinForwardSlash() {
    const b = this.board
    if (this.hasWinLine([b[0][0], b[1][1], b[2][2]])) {
      return {
        mark: this.winMark(),
        line: [
          [0, 0],
          [1, 1],
          [2, 2]
        ]
      }
    }
  }
  private findWinBackSlash() {
    const b = this.board
    if (this.hasWinLine([b[0][2], b[1][1], b[2][0]])) {
      return {
        mark: this.winMark(),
        line: [
          [0, 2],
          [1, 1],
          [2, 0]
        ]
      }
    }
  }
  private hasMarkedAll() {
    return (
      this.board.filter((r) => {
        return r.every(Boolean)
      }).length === 3
    )
  }
  private hasWinLine(line: Board[number]) {
    return (
      line.every((mark) => mark === "X") || line.every((mark) => mark === "O")
    )
  }
  turn(): Mark {
    let xCount = 0
    let oCount = 0
    this.board.forEach((r) => {
      r.forEach((el) => {
        if (el === "O") oCount++
        if (el === "X") xCount++
      })
    })
    return xCount > oCount ? "O" : "X"
  }
  winState(): WinState {
    const rowWin = this.findWinRow()
    if (rowWin) {
      return rowWin
    }
    const columnWin = this.findWinColumn()
    if (columnWin) {
      return columnWin
    }
    const fSlashWin = this.findWinForwardSlash()
    if (fSlashWin) {
      return fSlashWin
    }
    const bSlashWin = this.findWinBackSlash()
    if (bSlashWin) {
      return bSlashWin
    }
    if (this.hasMarkedAll())
      return {
        mark: "DRAW",
        line: null
      }
    return null
  }
  boardState() {
    return this.board
  }
  playCount() {
    let playCount = 0
    this.boardState().forEach((row) => {
      row.forEach((box) => {
        if (box) playCount++
      })
    })
    return playCount
  }
}
