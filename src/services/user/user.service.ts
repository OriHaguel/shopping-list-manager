import { AuthenticationError, SavedUser, User, UserSignupLogin } from "@/types";
import { httpService } from "../http.service";
import axios from "axios";

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'




export async function signup(userCred: UserSignupLogin): Promise<SavedUser> {
    try {
        const user = await httpService.post('users/signup', userCred)
        console.log('user signup!!!!')
        return saveLoggedinUser(user.user)

    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the signup process'
        )
    }
}
export async function login(userCred: UserSignupLogin): Promise<SavedUser> {
    try {
        const user = await httpService.post('users/login', userCred)
        console.log('user loggedin!!!!')
        return saveLoggedinUser(user.user)

    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the signup process'
        )
    }
}
export async function logout() {
    try {
        await httpService.post('users/logout')
        console.log('user logout!!!!')
    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the signup process'
        )
    }
}
export async function test() {
    try {
        const what = await httpService.get('users')
        console.log(what)
    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the signup process'
        )
    }
}

// export function logoutOld() {
//     axios.post('http://localhost:3030/api/users/logout', {}, {
//         withCredentials: true,
//     }).then(() => {
//         console.log('User logged out successfully');
//     })
// }



function getLoggedinUser(): SavedUser | null {
    try {
        const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Failed to parse logged-in user data:', error);
        return null;
    }
}

function saveLoggedinUser(user: SavedUser) {
    user = {
        _id: user._id,
        email: user.email,
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}
