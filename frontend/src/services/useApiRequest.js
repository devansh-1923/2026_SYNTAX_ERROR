import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Standard loading/error/data lifecycle for API calls.
 *
 * Usage:
 *   const { data, status, error, retry } = useApiRequest(
 *     (signal) => getPlanets({ signal }),
 *     [] // dependency array, like useEffect
 *   )
 *
 * status is one of: 'idle' | 'loading' | 'success' | 'error'
 *
 * On error, `data` stays null — components must render an explicit
 * error/unavailable state and must NOT fall back to placeholder or
 * fabricated content.
 */
export function useApiRequest(requestFn, deps = [], { enabled = true } = {}) {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const requestFnRef = useRef(requestFn)
  requestFnRef.current = requestFn

  const [retryToken, setRetryToken] = useState(0)

  const retry = useCallback(() => setRetryToken((t) => t + 1), [])

  useEffect(() => {
    if (!enabled) {
      setStatus('idle')
      return
    }

    const controller = new AbortController()
    let cancelled = false

    setStatus('loading')
    setError(null)

    requestFnRef
      .current(controller.signal)
      .then((result) => {
        if (cancelled) return
        setData(result)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError') return
        setError(err)
        setStatus('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, retryToken, ...deps])

  return {
    data,
    status,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    retry,
  }
}