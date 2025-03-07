import React, { useState, useEffect } from 'react';
import { auth, signInWithEmail, signUpWithEmail, logout } from "./utils/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import Homepage from './pages/mainpage';

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            {!user ? (
                <div  className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-4 bg-gray-700 rounded"
                    />
                    <button
                        onClick={() => signInWithEmail(email, password)}
                        className="w-full bg-green-500 p-2 rounded hover:bg-green-600"
                    >
                        Login
                    </button>
                </div>
                </div>
            ) : (
                <Homepage />
            ) 
            }
        </div>
    );
}

export default App;