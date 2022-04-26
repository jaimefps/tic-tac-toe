import { useCallback, useState } from "react"
import "./App.css"

type TurnChar = "X" | "O"
type Board = (TurnChar | null)[][]

const initialState = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
] as Board

function cloneBoard(b: Board) {
  return [[...b[0]], [...b[1]], [...b[2]]]
}

function isWin(line: (TurnChar | null)[]) {
  return line.every((box) => box === "X") || line.every((box) => box === "O")
}

function getWinState(b: Board) {
  for (let i = 0; i < 3; i++) {
    const row = b[i]
    if (isWin(row)) {
      return {
        win: true,
        type: "ROW",
        line: i
      } as const
    }
  }
  for (let i = 0; i < 3; i++) {
    const column = i
    if (isWin([b[0][column], b[1][column], b[2][column]])) {
      return {
        win: true,
        type: "COLUMN",
        line: i
      } as const
    }
  }
  if (isWin([b[0][0], b[1][1], b[2][2]])) {
    return {
      win: true,
      type: "FORWARD_SLASH",
      line: -1
    } as const
  }
  if (isWin([b[0][2], b[1][1], b[2][0]])) {
    return {
      win: true,
      type: "BACK_SLASH",
      line: -1
    } as const
  }
  return null
}

function useGame() {
  const [board, setBoard] = useState<Board>(() => cloneBoard(initialState))
  const [turn, setTurn] = useState<TurnChar | null>("X")
  const [winner, setWinner] = useState<TurnChar | "DRAW" | null>(null)
  const [details, setDetails] = useState<ReturnType<typeof getWinState>>(null)
  const [count, setCount] = useState(0)

  const restart = useCallback(() => {
    setBoard(cloneBoard(initialState))
    setTurn("X")
    setWinner(null)
    setDetails(null)
    setCount(0)
  }, [])

  const pick = useCallback(
    (char: TurnChar, loc: { x: number; y: number }) => {
      const isFinished = !!winner
      const isTaken = !!board[loc.y][loc.x]
      if (isTaken || isFinished) {
        return
      }

      const newCount = count + 1
      const newTurn = turn === "O" ? "X" : "O"
      const newBoard = cloneBoard(board)
      newBoard[loc.y][loc.x] = char

      if (newCount < 9) {
        setCount(count + 1)
      }

      const winState = getWinState(newBoard)
      if (winState?.win) {
        setWinner(turn)
        setDetails(winState)
      } else if (newCount > 8) {
        setWinner("DRAW")
      } else {
        setTurn(newTurn)
      }

      setBoard(newBoard)
    },
    [turn, setTurn, board, setBoard, count, setCount, winner]
  )

  return {
    pick,
    restart,
    board,
    turn,
    winner,
    count,
    details
  }
}

function App() {
  const { pick, restart, board, turn, winner, count, details } = useGame()

  function shouldHighlight(x: number, y: number) {
    if (details?.type === "ROW") {
      return y === details.line
    }
    if (details?.type === "COLUMN") {
      return x === details.line
    }
    if (details?.type === "FORWARD_SLASH") {
      const b1 = y === 0 && x === 0
      const b2 = y === 1 && x === 1
      const b3 = y === 2 && x === 2
      return b1 || b2 || b3
    }
    if (details?.type === "BACK_SLASH") {
      const b1 = y === 2 && x === 0
      const b2 = y === 1 && x === 1
      const b3 = y === 0 && x === 2
      return b1 || b2 || b3
    }
    return false
  }

  function getBoxStyles(x: number, y: number) {
    const lx = `loc-x-${x}`
    const ly = `loc-y-${y}`
    const a = board[y][x] ? "disabled" : "enabled"
    const h = shouldHighlight(x, y) ? "highlight" : ""
    const w = winner ? "finished" : ""
    return `box ${a} ${w} ${h} ${lx} ${ly}`
  }

  function getBoxProps(x: number, y: number) {
    const children = board[y][x]
    return {
      children,
      className: getBoxStyles(x, y),
      onClick: () => pick(turn as TurnChar, { x, y })
    }
  }

  return (
    <div className="App">
      {winner === "DRAW" ? (
        <h1>Draw</h1>
      ) : winner ? (
        <h1>Winner: {winner}</h1>
      ) : (
        <h1>Turn: {turn}</h1>
      )}

      <div className="board">
        <div className="row">
          <div {...getBoxProps(0, 0)} />
          <div {...getBoxProps(0, 1)} />
          <div {...getBoxProps(0, 2)} />
        </div>
        <div className="row">
          <div {...getBoxProps(1, 0)} />
          <div {...getBoxProps(1, 1)} />
          <div {...getBoxProps(1, 2)} />
        </div>
        <div className="row">
          <div {...getBoxProps(2, 0)} />
          <div {...getBoxProps(2, 1)} />
          <div {...getBoxProps(2, 2)} />
        </div>
      </div>

      <button
        disabled={!count}
        className={`btn ${count ? "show" : "hide"}`}
        onClick={restart}
      >
        restart
      </button>
    </div>
  )
}

export default App
