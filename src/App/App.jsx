import React, { useEffect, useState } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_Pageroute';
import { HomePage } from '../views/HomePage';
import { LoginPage } from '../views/LoginPage/LoginPage';
import { RegisterPage } from "../views/RegisterPage/RegisterPage";
import { NavBar } from '../views/NavBar';
import { ClassPage } from '../views/ClassPage';
import { FolderPage } from '../views/FolderPage/FolderPage';
import { ManageClassPage } from '../views/ManageClassPage/ManageClassPage';
import { UserInfoPage } from '../views/UserInfoPage/UserInfoPage';


function App() {
    const [is_login, setis_login] = useState(true);
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });

        const user = JSON.parse(localStorage.getItem('user'));
        // 로그인 된 상태
        if(user) {
            setis_login(true);
        } 
        // 로그인 안 된 상태
        else {
            setis_login(false);
        }
    }, []);

    return (
        <div>
            {alert.message &&
                <div className={`alert ${alert.type}`}>{alert.message}</div>
            }
            <Router history={history}>
                <NavBar/>
                <Switch>
                    {
                        is_login === false
                        ? (<Route exact path="/" component={LoginPage} />)
                        : (<Route exact path="/" component={HomePage} />)
                    }
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <PrivateRoute path='/user' component={HomePage} />
                    <PrivateRoute exact path='/class' component={ClassPage}/>
                    <PrivateRoute exact path='/folder' component={FolderPage}/>
                    <PrivateRoute exact path='/class/manage' component={ManageClassPage}/>
                    <PrivateRoute path='/userinfo' component={UserInfoPage}/>
                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export { App };