import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Registration from "./Components/Login/registration";

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/" exact component={Registration} />
                    {/* Add more routes here as needed */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;