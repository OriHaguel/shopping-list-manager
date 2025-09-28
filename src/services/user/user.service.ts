import { AuthenticationError, SavedUser, User, UserSignupLogin } from "@/types";
import { httpService } from "../http.service";

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'




export async function signup(userCred: UserSignupLogin): Promise<SavedUser> {
    console.log('hey')
    try {
        const user = await httpService.post('users/signup', userCred)
        console.log("🚀 ~ signup ~ user:", user)

        return saveLoggedinUser(user)

    } catch (err) {
        throw new AuthenticationError(
            err instanceof Error ? err.message : 'An error occurred during the signup process'
        )
    }
}


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
