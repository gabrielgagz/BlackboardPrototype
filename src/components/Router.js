import React from 'react'
import { Switch, Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
import { Blackboard as BlackboardPage } from './Blackboard';
import { Login as LoginPage } from './Login';

export const AppRouter = () => {
    return (
        <Router>
            <>
                <Switch>
                    <Route exact path="/" component={ LoginPage }/>
                    <Route exact path="/blackboard/:token" component={ BlackboardPage }/>
                    <Redirect to="/" />
                </Switch>
            </>
        </Router>
    )
}
