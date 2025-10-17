import { AuthenticationError, SavedUser, User, UserSignupLogin } from "@/types";
import { httpService } from "../http.service";
import { tokenService } from "./token.service";

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';

export async function signup(userCred: UserSignupLogin): Promise<SavedUser> {
    try {
        const response = await httpService.post('users/signup', userCred);
        console.log('user signup!!!!');

        // Store access token if provided
        if (response.accessToken) {
            tokenService.setAccessToken(response.accessToken);
        }

        return saveLoggedinUser(response.user);
    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the signup process'
        );
    }
}

export async function login(userCred: UserSignupLogin): Promise<SavedUser> {
    try {
        const response = await httpService.post('users/login', userCred);
        console.log('user loggedin!!!!');
        // Store access token if provided
        if (response.accessToken) {
            tokenService.setAccessToken(response.accessToken);
        }

        return saveLoggedinUser(response.user);
    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the login process'
        );
    }
}

export async function logout() {
    try {
        await httpService.post('users/logout');
        console.log('user logout!!!!');

        // Clear tokens on logout
        tokenService.clearTokens();
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
    } catch (err) {
        // Even if logout fails, clear local data
        tokenService.clearTokens();
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);

        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the logout process'
        );
    }
}

export async function test() {
    try {
        const what = await httpService.get('users');
        console.log(what);
    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the test request'
        );
    }
}

export function getLoggedinUser(): SavedUser | null {
    try {
        const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Failed to parse logged-in user data:', error);
        return null;
    }
}

function saveLoggedinUser(user: SavedUser): SavedUser {
    const savedUser = {
        _id: user._id,
        email: user.email,
    };
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(savedUser));
    return savedUser;
}