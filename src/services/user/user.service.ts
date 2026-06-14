import { AuthenticationError, SavedUser, UserLogin, UserSignup } from "@/types";
import { httpService } from "../http.service";
import { tokenService } from "./token.service";
import { removeItem, setItem } from "@/utils/localStorage";

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser';
// saveLoggedinUser AND getLoggedinUser MIGHT NOT BE NEEDED 
export async function signup(userCred: UserSignup): Promise<SavedUser> {
    try {
        const response = await httpService.post('users/signup', userCred);

        // Store access token if provided
        if (response.accessToken) {
            tokenService.setAccessToken(response.accessToken);
        }
        // MIGHT NOT BE NEEDED 
        removeItem('userId'); // Clear any existing guest user ID
        return saveLoggedinUser(response.user);
    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the signup process'
        );
    }
}


export async function createGuest(): Promise<void> {
    try {
        const response = await httpService.post('users/create-guest');

        // Store access token if provided
        if (response.accessToken) {
            tokenService.setAccessToken(response.accessToken);
        }
        // MIGHT NOT BE NEEDED 
        setItem('userId', response.user._id);
    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the signup process'
        );
    }
}

export async function loginGuest(userId: string): Promise<void> {
    try {
        const response = await httpService.post('users/login-guest', { userId });
        // Store access token if provided
        if (response.accessToken) {
            tokenService.setAccessToken(response.accessToken);
        }

    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the login process'
        );
    }
}
export async function login(userCred: UserLogin): Promise<SavedUser> {
    try {
        const response = await httpService.post('users/login', userCred);
        // Store access token if provided
        if (response.accessToken) {
            tokenService.setAccessToken(response.accessToken);
        }
        // MIGHT NOT BE NEEDED 
        return saveLoggedinUser(response.user);
    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the login process'
        );
    }
}

export async function getUsersEmail(usersId: string[]): Promise<SavedUser> {
    try {
        const user = await httpService.post('users/email', { usersId });
        return user
    } catch (err) {
        console.log("error getting user", err)
        throw err
    }
}


export async function logout() {
    try {
        await httpService.post('users/logout');

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
export async function getUserEmail(): Promise<string | undefined> {
    try {
        const response = await httpService.get('users');
        return response.email;
    } catch (err) {
        console.log("error getting user email", err)
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the logout process'
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