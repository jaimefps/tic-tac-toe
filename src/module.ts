import { useCallback, useState } from "react"

type Rerender = () => void

export abstract class VanillaState {
  rerender
  constructor(rerender: Rerender) {
    this.rerender = rerender
  }
}

export function useVanillaState<T extends VanillaState>(CustomState: {
  new (rerender: Rerender): T
}) {
  const [, setNum] = useState(0)
  const rerender = useCallback(() => setNum((num) => num + 1), [setNum])
  const [entity] = useState(() => new CustomState(rerender))
  return entity
}
