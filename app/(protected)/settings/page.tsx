import {auth, signOut} from "@/auth"

const SettingsPage = async () => {
    const session = await auth();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {JSON.stringify(session)}
            <form action={async () => {
                "use server";
                await signOut();   
            }}> 
                <button type="submit">
                    Sign out
                </button>
            </form>
        </div>
    );
}

export default SettingsPage;