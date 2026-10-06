// app/utils/panelAuth.js

/**
 * Fired by actions/apiClient.js when the server says "not logged in" (401) on a call
 * that needs a login. <SessionWatcher/> listens for it and checks the session,
 * and the panel then sends the person to the login page. This file lives
 * outside React, so it cannot redirect by itself (same idea as adminAuth.js in
 * the Appleton admin).
 *
 * Unlike Appleton there is nothing to clear in localStorage: the login is an
 * HttpOnly cookie that scripts cannot read, so no token is kept in the browser.
 */
export const UNAUTHORIZED_EVENT = "gate:unauthorized";
