// app/actions/apiClient.js
// The one axios instance every file in app/actions/ uses, so the base URL,
// the required header and the error handling live in exactly one place.
// (Same setup as the top of apiActions.js in the Appleton admin.)

import axios from "axios";

import { getApiBase } from "../utils/apiUrl";
import { UNAUTHORIZED_EVENT } from "../utils/panelAuth";
const baseURL = getApiBase();

const instance = axios.create({
    baseURL: baseURL,
    // The login cookie is sent and received only because of this.
    withCredentials: true,
    headers: {
        // Required on every request. A plain cross-site form cannot send it,
        // so the API can refuse forged requests.
        "X-Gate-Request": "1",
    },
});

// No Authorization token from localStorage here (the Appleton projects keep
// one). The login is an HttpOnly cookie that scripts cannot read, which is
// what keeps it safe from script injection.

// Every reply from this API looks like { success, message, data }. Hand the
// functions below just the `data` part, and give every failed call one plain
// message (error.message) and the HTTP status (error.status) to show on screen.
//
// 401 = not logged in (or the session ended). On a call that needs a login we
// fire an event that <SessionWatcher/> turns into an in-app redirect. Calls to
// /auth/... are left alone: a wrong password or an empty session at start-up
// is not a "session ended".
instance.interceptors.response.use(
    response => {
        response.data = response.data?.data ?? null;
        return response;
    },
    error => {
        const status = error.response?.status;
        const url = error.config?.url || '';
        error.status = status || 0;
        error.message = error.response
            ? error.response.data?.message || `Something went wrong (error ${status}). Please try again.`
            : "We could not reach the server. Please check your internet connection and try again.";
        const isAuthCall = url.startsWith('/auth/');
        if (status === 401 && !isAuthCall) {
            window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT, {
                detail: { from: window.location.pathname }
            }));
        }
        return Promise.reject(error);
    }
);

export default instance;
