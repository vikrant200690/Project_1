import { useState } from 'react'
import './App.css'

function App() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setMessage('')
    setIsError(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent the default form reload
    
    if (!username || !password) {
      setMessage("Please fill in both fields.")
      setIsError(true)
      return
    }

    const endpoint = isLoginMode ? '/login' : '/signup'
    const url = `http://localhost:8000${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsError(false)
        
        if (!isLoginMode) {
          // Switch to login mode automatically after a successful signup
          setTimeout(() => setIsLoginMode(true), 1500)
        }
      } else {
        setMessage(data.detail || "An error occurred.")
        setIsError(true)
      }
    } catch (error) {
      setMessage("Failed to connect to the backend server.")
      setIsError(true)
    }
  }

  return (
    <div className="container">
      <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="toggle-link" onClick={toggleMode}>
        {isLoginMode 
          ? "Don't have an account? Sign up here." 
          : "Already have an account? Log in here."}
      </div>

      {message && (
        <div className={`message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default App