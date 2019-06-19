import {userConstants} from '../_constants';
import {userService} from '../_services';
import {alertActions} from './';
import {history} from '../_helpers';

export const userActions = {
    login,
    logout,
    getAll
};

function login(username: any, password: any) {
    return (dispatch: any) => {
        dispatch(request({username}));

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user: any) {
        return {type: userConstants.LOGIN_REQUEST, user}
    }

    function success(user: any) {
        return {type: userConstants.LOGIN_SUCCESS, user}
    }

    function failure(error: any) {
        return {type: userConstants.LOGIN_FAILURE, error}
    }
}

function logout() {
    userService.logout();
    return {type: userConstants.LOGOUT};
}

function getAll(): any {
    return (dispatch: any) => {
        dispatch(request());

        userService.getAll()
            .then(
                (users: any) => dispatch(success(users)),
                (error: any) => dispatch(failure(error))
            );
    };

    function request() {
        return {type: userConstants.GETALL_REQUEST}
    }

    function success(users: any) {
        return {type: userConstants.GETALL_SUCCESS, users}
    }

    function failure(error: any) {
        return {type: userConstants.GETALL_FAILURE, error}
    }
}