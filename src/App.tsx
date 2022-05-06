import { GameState } from "./GameState"
import { useVanillaState } from "./module"
import "./App.css"

function shouldHighlight(x: number, y: number, game: GameState) {
  return (
    game.winState()?.line?.some(([thisY, thisX]) => {
      return thisY === y && thisX === x
    }) ?? false
  )
}

function getClassNames(x: number, y: number, game: GameState) {
  const lx = `loc-x-${x}`
  const ly = `loc-y-${y}`
  const end = !!game.winState() ? "finished" : ""
  const active = game.boardState()[y][x] ? "disabled" : "enabled"
  const highlight = shouldHighlight(x, y, game) ? "highlight" : ""
  return `box ${active} ${highlight} ${end} ${lx} ${ly}`
}

function makeBoxProps(x: number, y: number, game: GameState) {
  const content = game.boardState()[y][x]
  return {
    children: content,
    className: getClassNames(x, y, game),
    onClick: () => game.play({ x, y }).rerender(),
    disabled: Boolean(content ?? game.winState())
  }
}

function App() {
  const game = useVanillaState(GameState)
  const winDetails = game.winState()
  const playCount = game.playCount()

  return (
    <div className="App">
      {winDetails?.mark === "DRAW" ? (
        <h1>Draw</h1>
      ) : winDetails ? (
        <h1>Winner: {winDetails.mark}</h1>
      ) : (
        <h1>Turn: {game.turn()}</h1>
      )}

      <div className="board">
        <div className="row">
          <button {...makeBoxProps(0, 0, game)} />
          <button {...makeBoxProps(0, 1, game)} />
          <button {...makeBoxProps(0, 2, game)} />
        </div>
        <div className="row">
          <button {...makeBoxProps(1, 0, game)} />
          <button {...makeBoxProps(1, 1, game)} />
          <button {...makeBoxProps(1, 2, game)} />
        </div>
        <div className="row">
          <button {...makeBoxProps(2, 0, game)} />
          <button {...makeBoxProps(2, 1, game)} />
          <button {...makeBoxProps(2, 2, game)} />
        </div>
      </div>

      <button
        disabled={!playCount}
        onClick={() => game.restart().rerender()}
        className={`btn ${playCount ? "show" : "hide"}`}
      >
        restart
      </button>
    </div>
  )
}

export default App
