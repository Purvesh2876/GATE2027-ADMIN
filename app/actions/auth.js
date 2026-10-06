import instance from "./apiClient";

/* Mirrors backend routes/authRoutes.js 1:1. One file per backend area: this
   one is auth; stalls.js, bookings.js and so on get added the same way. */

/* ─── Sign-up: details → email code → SMS code → password ───
   Every step after the first carries the `signupKey` returned by the first. */

export async function startSignup(details) {
    try {
        const response = await instance.post("/auth/signup", details);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function verifySignup(signupKey, code) {
    try {
        const response = await instance.post("/auth/signup/verify", {
            signupKey,
            code
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function resendSignup(signupKey) {
    try {
        const response = await instance.post("/auth/signup/resend", {
            signupKey
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function signupStatus(signupKey) {
    try {
        const response = await instance.post("/auth/signup/status", {
            signupKey
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function completeSignup(signupKey, password) {
    try {
        const response = await instance.post("/auth/signup/password", {
            signupKey,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/* ─── Login: password → SMS code. The code step carries the `loginKey`. ─── */

export async function startLogin(identifier, password) {
    try {
        const response = await instance.post("/auth/login", {
            identifier,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function resendLoginCode(loginKey) {
    try {
        const response = await instance.post("/auth/login/resend", {
            loginKey
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function finishLogin(loginKey, code) {
    try {
        const response = await instance.post("/auth/login/verify", {
            loginKey,
            code
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        const response = await instance.post("/auth/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await instance.get("/auth/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}

/* ─── Passwords ─── */

export async function forgotPassword(identifier) {
    try {
        const response = await instance.post("/auth/password/forgot", {
            identifier
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function resetPassword(token, password) {
    try {
        const response = await instance.post("/auth/password/reset", {
            token,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function changePassword(currentPassword, newPassword) {
    try {
        const response = await instance.post("/auth/password/change", {
            currentPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/* ─── Staff invitation link ─── */

export async function startInvite(token) {
    try {
        const response = await instance.post("/auth/invite/start", {
            token
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function acceptInvite(token, code, password) {
    try {
        const response = await instance.post("/auth/invite/accept", {
            token,
            code,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
