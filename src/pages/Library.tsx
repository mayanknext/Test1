import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { StoryOutput } from "@/components/StoryOutput";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, BookOpen } from "lucide-react";

interface StoryRow {
  id: string;
  title: string;
  content: string;
  style: string;
  tone: string;
  length: string;
  created_at: string;
}

const Library = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<StoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StoryRow | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "Couldn't load your stories", description: error.message, variant: "destructive" });
      } else {
        setStories(data ?? []);
        setSelected((data ?? [])[0] ?? null);
      }
      setLoading(false);
    };
    load();
  }, [user, toast]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
      return;
    }
    const remaining = stories.filter((s) => s.id !== id);
    setStories(remaining);
    if (selected?.id === id) setSelected(remaining[0] ?? null);
    toast({ title: "Story deleted" });
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account and all saved stories? This can't be undone.")) return;
    const { error } = await supabase.rpc("delete_own_account");
    if (error) {
      toast({ title: "Couldn't delete account", description: error.message, variant: "destructive" });
      return;
    }
    await signOut();
    toast({ title: "Account deleted" });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="display-40">My stories</h1>
          <p className="text-muted-foreground">Everything you've created, saved to your account.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : stories.length === 0 ? (
          <div className="py-20 text-center space-y-4 border-y border-vb-line">
            <BookOpen className="w-10 h-10 text-primary mx-auto" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">No stories yet</h2>
              <p className="text-muted-foreground">Generate your first story and save it here.</p>
            </div>
            <Button  onClick={() => navigate("/")}>
              Create a story
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              {stories.map((story) => (
                <div key={story.id} className={`flex items-start gap-2 p-2 rounded-xl border ${selected?.id === story.id ? "border-vb-cobalt bg-vb-cobalt-soft" : "border-vb-line bg-vb-bg"}`}>
                  <Button variant="ghost" onClick={() => setSelected(story)} aria-pressed={selected?.id === story.id} className="h-auto p-3 min-w-0 flex-1 whitespace-normal text-left items-start justify-start rounded-lg">
                    <div className="min-w-0 space-y-2"><h3 className="font-medium break-words">{story.title}</h3><p className="text-xs text-vb-ink-tertiary capitalize">{story.style} · {story.tone} · {story.length}</p><p className="mono-12 text-vb-ink-tertiary">{new Date(story.created_at).toLocaleDateString()}</p></div>
                  </Button>
                  <Button variant="ghost" size="icon" title="Delete story" aria-label={`Delete ${story.title}`} onClick={() => handleDelete(story.id)}><Trash2 className="text-vb-danger" /></Button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selected && (
                <StoryOutput
                  key={selected.id}
                  story={selected.content}
                  isLoading={false}
                  title={selected.title}
                />
              )}
            </div>
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-vb-line text-xs text-vb-ink-tertiary">
          <span>Signed in as {user?.email}</span>
          <Button variant="ghost" size="sm" className="text-vb-danger" onClick={handleDeleteAccount}>
            <Trash2 />Delete account
          </Button>
        </footer>
      </main>
    </div>
  );
};

export default Library;
