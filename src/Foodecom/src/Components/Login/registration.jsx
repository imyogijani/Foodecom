// filepath: /home/yogesh/Documents/new project/Foodecom/src/Components/Login/registration.jsx
import { useState } from "react";

export default function Registration() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(null);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                setLoggedInUser(data.user);
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Server error");
        }
    }

    function handleLogout() {
        setLoggedInUser(null);
        setForm({ username: "", password: "" });
    }

    if (loggedInUser) {
        return (
            <div>
                <h2>Welcome, {loggedInUser.username}!</h2>
                <p>Your role: {loggedInUser.role}</p>
                {loggedInUser.role === "admin" ? (
                    <div>
                        <h3>Admin Panel</h3>
                        <p>Only visible to admins.</p>
                    </div>
                ) : (
                    <div>
                        <h3>User Dashboard</h3>
                        <p>Only visible to users.</p>
                    </div>
                )}
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}