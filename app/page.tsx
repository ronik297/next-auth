import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_#38bdf8,_#1e40af)]">
      <div className="space-y-6">
        <h1
          className={cn(
            ` text-6xl font-semibold text-white drop-shadow-md`,
            font.className
          )}
        >
          🔐 Auth
        </h1>
        <p className="text-white text-lg">A Simple Authentication Service</p>
        <div className="flex justify-center">
          <LoginButton mode="redirect">
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
