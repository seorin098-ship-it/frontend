import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chatbot from './pages/Chatbot'
import SymptomForm from './pages/SymptomForm'
import HospitalList from './pages/HospitalList'
import Directions from './pages/Directions'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/symptom-form" element={<SymptomForm />} />
        <Route path="/hospital-list" element={<HospitalList />} />
        <Route path="/directions" element={<Directions />} />
      </Routes>
    </Router>
  )
}

export default App