import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';
import axios from 'axios';
import {
    REGISTER_USER
} from './types'

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};

function login(id, pw, from) {
    return dispatch => {
        dispatch(request({ id }));

        userService.login(id, pw)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push(from);
                    window.location.reload();
                },
                error => {
                    alert("비밀번호가 틀렸습니다.");
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(dataToSubmit) {
    const request = axios.post('http://localhost:8000/api/sign-up', dataToSubmit)
    .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(user)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}