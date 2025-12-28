import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Play, BookOpen } from 'lucide-react';

export default function SavedLists() {
  const navigate = useNavigate();
  const { savedWordSets, loadSavedWordSet, deleteSavedWordSet, currentChild } = useGame();

  useEffect(() => {
    if (!currentChild) navigate('/parent', { replace: true });
  }, [currentChild, navigate]);

  if (!currentChild) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

const handleLoad = (id: string) => {
    loadSavedWordSet(id);
    navigate('/play');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteSavedWordSet(id);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-gradient-to-b from-town-sky to-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/play')}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Saved Word Lists</h1>
            <p className="text-muted-foreground text-sm">{savedWordSets.length}/10 lists saved</p>
          </div>
        </div>

        {/* Lists */}
        {savedWordSets.length === 0 ? (
          <div className="bg-card rounded-3xl shadow-card p-8 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Saved Lists Yet</h2>
            <p className="text-muted-foreground mb-6">
              Save your current word list from the home screen to practice it again later!
            </p>
            <Button variant="game" onClick={() => navigate('/play')}>
              Go Back Home
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedWordSets.map((set) => (
              <div
                key={set.id}
                className="bg-card rounded-2xl shadow-soft p-4 border border-border"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{set.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {set.grade === 'K' ? 'Kindergarten' : `Grade ${set.grade}`} • {set.words.length} words
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(set.id, set.name)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Word Preview */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {set.words.slice(0, 5).map((word, i) => (
                    <span
                      key={i}
                      className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                    >
                      {word.word}
                    </span>
                  ))}
                  {set.words.length > 5 && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                      +{set.words.length - 5} more
                    </span>
                  )}
                </div>

                <Button
                  variant="kid"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleLoad(set.id)}
                >
                  <Play className="h-4 w-4" />
                  Use This List
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}