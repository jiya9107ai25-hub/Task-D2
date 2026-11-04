import { useState } from 'react'
import {
    Routes,
    Route,
    useNavigate
} from 'react-router-dom'

import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Pricing from './pages/Pricing.jsx'
import Post from './pages/Post.jsx'
import BrowsePosts from './pages/BrowsePosts.jsx'

function App() {
    const navigate = useNavigate()

    const [user, setUser] = useState(() => {
        const storedUser =
            localStorage.getItem('user')

        if (storedUser) {
            try {
                return JSON.parse(storedUser)
            } catch {
                return null
            }
        }

        return null
    })

    function handleLogin(userData) {
        setUser(userData)

        localStorage.setItem(
            'user',
            JSON.stringify(userData)
        )
    }

    function handleLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setUser(null)

        navigate('/', {
            replace: true
        })
    }

    function handleUserUpdate(userData) {
        setUser(userData)

        localStorage.setItem(
            'user',
            JSON.stringify(userData)
        )
    }

    return (
        <>
            <Header
                user={user}
                onLogout={handleLogout}
            />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={
                        <Login
                            onLogin={handleLogin}
                        />
                    }
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/pricing"
                    element={
                        <Pricing
                            user={user}
                            onUserUpdate={handleUserUpdate}
                        />
                    }
                />

                <Route
                    path="/post"
                    element={
                        <Post
                            user={user}
                        />
                    }
                />

                <Route
                    path="/browse-posts"
                    element={
                        <BrowsePosts />
                    }
                />

            </Routes>
        </>
    )
}

export default App