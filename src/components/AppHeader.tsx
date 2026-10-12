import { Link, useNavigate, useLocation } from "react-router-dom";
import { AudioLines, LogOut, Library, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/vibe";
import { useAuth } from "@/hooks/useAuth";

export const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b border-vb-line bg-vb-bg">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 min-h-20 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" aria-label="StoryFlow home" className="inline-flex items-center gap-3 font-display font-semibold text-xl">
          <span className="h-10 w-10 rounded-full bg-vb-ink text-vb-ink-inverse flex items-center justify-center"><AudioLines className="w-5 h-5" /></span>
          <span>StoryFlow<span className="ml-1 text-vb-ink-tertiary text-sm font-sans">AI</span></span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-1 order-3 w-full sm:order-none sm:w-auto">
          <Button variant="ghost" asChild className={pathname === "/" ? "bg-vb-bg-muted" : "text-vb-ink-secondary"}><Link to="/"><PenLine />Create a story</Link></Button>
          <Button variant="ghost" asChild className={pathname === "/library" ? "bg-vb-bg-muted" : "text-vb-ink-secondary"}><Link to="/library"><Library />My stories</Link></Button>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          {user ? (
            <Button variant="ghost" size="icon" title="Sign out" aria-label="Sign out" onClick={handleSignOut}><LogOut /></Button>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
