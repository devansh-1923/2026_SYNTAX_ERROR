import { useState, useCallback } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import Explorer from './pages/Explorer.jsx'
import './App.css'

export default function App() {
  const [route, setRoute] = useState('landing')

  const goToExplorer = useCallback(() => {
    setRoute('explorer')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const goToLanding = useCallback(() => {
    setRoute('landing')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  if (route === 'explorer') {
    return <Explorer onBack={goToLanding} />
  }

  return <LandingPage onEnterExplorer={goToExplorer} />
}