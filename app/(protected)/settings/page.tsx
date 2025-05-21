"use client"

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {
    const user = useCurrentUser();

    const handleSignOut = () => {
       logout();
    }

    return (
        <div className="bg-white p-10 rounded-xl">
            {JSON.stringify(user)}
            <button onClick={handleSignOut}  type="submit">
                Sign out
            </button>
        </div>
    );
}

export default SettingsPage;