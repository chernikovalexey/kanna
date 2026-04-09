import { useCallback, useRef, useState } from "react"

const STORAGE_KEY = "kanna:sidebar-width"
const DEFAULT_WIDTH = 275
const MIN_WIDTH = 225
const MAX_WIDTH = 480

function loadWidth(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const n = Number(raw)
      if (!Number.isNaN(n)) return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, n))
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_WIDTH
}

function saveWidth(width: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(width))
  } catch {
    /* ignore */
  }
}

export function useSidebarResize() {
  const [width, setWidth] = useState(loadWidth)
  const [isResizing, setIsResizing] = useState(false)
  const widthRef = useRef(width)
  widthRef.current = width

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = widthRef.current

    function onMove(ev: MouseEvent) {
      const next = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startW + (ev.clientX - startX)))
      setWidth(next)
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      setIsResizing(false)
      saveWidth(widthRef.current)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    setIsResizing(true)
  }, [])

  const onDoubleClick = useCallback(() => {
    setWidth(DEFAULT_WIDTH)
    saveWidth(DEFAULT_WIDTH)
  }, [])

  return { width, isResizing, onMouseDown, onDoubleClick }
}
