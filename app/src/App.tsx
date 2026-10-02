import { DictionaryProvider } from './dict/DictionaryProvider'
import { AppRoutes } from './routes'

function App() {
  return (
    <DictionaryProvider>
      <AppRoutes />
    </DictionaryProvider>
  )
}

export default App
