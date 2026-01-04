import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GradeSelector } from '@/components/GradeSelector';
import { GradeLevel, Word } from '@/types';
import { Lock, Plus, Trash2, Edit3, Play } from 'lucide-react';
import { addCustomWord, getGradeLetterCap, getWordsByGrade, listCustomWords, removeCustomWord } from '@/data/wordBank';

export default function ParentPortal() {
  const navigate = useNavigate();
  const {
    parentPinSet,
    setParentPin,
    childProfiles,
    createChildProfile,
    updateChildProfile,
    deleteChildProfile,
    selectChildProfile,
  } = useGame();

  // First-time setup
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [firstChildName, setFirstChildName] = useState('');
  const [firstGrade, setFirstGrade] = useState<GradeLevel | null>(null);

  // Add child (after setup)
  const [newChildName, setNewChildName] = useState('');
  const [newGrade, setNewGrade] = useState<GradeLevel | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Custom words
  const [customWordText, setCustomWordText] = useState('');
  const [customWordGrade, setCustomWordGrade] = useState<GradeLevel>('1');
  const [customWords, setCustomWords] = useState<Word[]>(() => listCustomWords());

  const refreshCustomWords = () => setCustomWords(listCustomWords());

  const handleAddCustomWord = () => {
    if (!customWordGrade) {
      setError('Pick a grade first.');
      setWarning(null);
      return;
    }

    const normalized = customWordText.trim().toLowerCase();

    const cap = getGradeLetterCap(customWordGrade);
    if (cap !== null && normalized.length > cap) {
      setWarning(
        `Note: "${normalized}" is ${normalized.length} letters. Typical max for grade ${customWordGrade === 'K' ? 'K' : customWordGrade} is ${cap}. It will still be saved and used in games.`
      );
    } else {
      setWarning(null);
    }
    const existsInBase = getWordsByGrade(customWordGrade).some(w => w.word.toLowerCase() === normalized);
    const existsInCustom = customWords.some(
      w => w.grade === customWordGrade && w.word.toLowerCase() === normalized
    );

    if (existsInBase || existsInCustom) {
      setError('That word is already in the word bank for this grade.');
      setWarning(null);
      return;
    }

    const created = addCustomWord(customWordText, customWordGrade);
    if (!created) {
      setError('Could not add that word. Make sure it is letters only and not already in the bank for that grade.');
      setWarning(null);
      return;
    }
    setError(null);
    setCustomWordText('');
    refreshCustomWords();
  };

  const handleRemoveCustomWord = (id: string) => {
    removeCustomWord(id);
    refreshCustomWords();
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingGrade, setEditingGrade] = useState<GradeLevel | null>(null);

  const canAddMore = childProfiles.length < 5;

  const gradeLabel = (g: GradeLevel) => (g === 'K' ? 'Kindergarten' : `Grade ${g}`);

  const handleCreateFamily = () => {
    setError(null);
    const cleanedPin = pin.trim();
    if (cleanedPin.length < 4) return setError('PIN must be at least 4 characters.');
    if (cleanedPin !== pinConfirm.trim()) return setError('PINs do not match.');
    if (!firstChildName.trim()) return setError('Please enter your child\'s name.');

    setParentPin(cleanedPin);
    const profile = createChildProfile(firstChildName.trim(), firstGrade || '1');
    if (!profile) return setError('Could not create profile. Try again.');
    selectChildProfile(profile.id);
    navigate('/play', { replace: true });
  };

  const handleAddChild = () => {
    setError(null);
    if (!newChildName.trim()) return setError('Please enter a child name.');
    const profile = createChildProfile(newChildName.trim(), newGrade || '1');
    if (!profile) return setError('You can create up to 5 child accounts.');
    setNewChildName('');
    setNewGrade(null);
  };

  const beginEdit = (id: string) => {
    const p = childProfiles.find(c => c.id === id);
    if (!p) return;
    setEditingId(id);
    setEditingName(p.name);
    setEditingGrade(p.grade);
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateChildProfile(editingId, { name: editingName.trim() || 'Player', grade: (editingGrade || '1') as GradeLevel });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingGrade(null);
  };

  const sortedProfiles = useMemo(() => {
    return [...childProfiles].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }, [childProfiles]);

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-gradient-to-b from-slate-50 to-background">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Parent Portal</h1>
          <p className="text-muted-foreground">Create and manage up to 5 child profiles.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-2xl p-4 mb-6">
            {error}
          </div>
        )}

        {!parentPinSet ? (
          <div className="bg-card rounded-3xl shadow-card p-6">
            <h2 className="text-xl font-bold mb-4">First-time Setup</h2>

            <div className="space-y-3 mb-6">
              <label className="text-sm font-medium text-muted-foreground">Create a Parent PIN</label>
              <Input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN (at least 4 characters)"
                type="password"
              />
              <Input
                value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value)}
                placeholder="Confirm PIN"
                type="password"
              />
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-sm font-medium text-muted-foreground">Child Name</label>
              <Input
                value={firstChildName}
                onChange={(e) => setFirstChildName(e.target.value)}
                placeholder="e.g., Mia"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Starting Grade (optional, defaults to Grade 1)
              </label>
              <GradeSelector selectedGrade={firstGrade} onSelect={setFirstGrade} />
            </div>

            <Button variant="game" size="xl" className="w-full" onClick={handleCreateFamily}>
              Create Profile & Start
            </Button>
          </div>
        ) : (
          <>
            {/* Child profiles */}
            <div className="bg-card rounded-3xl shadow-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Child Accounts</h2>

              {sortedProfiles.length === 0 ? (
                <p className="text-muted-foreground">No child profiles yet.</p>
              ) : (
                <div className="space-y-3">
                  {sortedProfiles.map((child) => (
                    <div
                      key={child.id}
                      className="border border-border rounded-2xl p-4 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-foreground">{child.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {gradeLabel(child.grade)} • Level {child.level} • {child.coins} coins
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="kid"
                          size="icon-sm"
                          onClick={() => {
                            selectChildProfile(child.id);
                            navigate('/play');
                          }}
                          title="Play"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => beginEdit(child.id)}
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteChildProfile(child.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Edit panel */}
            {editingId && (
              <div className="bg-card rounded-3xl shadow-card p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Edit Child Profile</h3>
                <div className="space-y-3 mb-4">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Grade</label>
                  <GradeSelector selectedGrade={editingGrade} onSelect={setEditingGrade} />
                </div>
                <div className="flex gap-3">
                  <Button variant="game" className="flex-1" onClick={saveEdit}>Save</Button>
                  <Button variant="outline" className="flex-1" onClick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Add child */}
            <div className="bg-card rounded-3xl shadow-card p-6">
              <h2 className="text-xl font-bold mb-4">Add a Child</h2>
              <div className="space-y-3 mb-4">
                <label className="text-sm font-medium text-muted-foreground">Child Name</label>
                <Input
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="e.g., Jayden"
                  disabled={!canAddMore}
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Starting Grade (optional, defaults to Grade 1)
                </label>
                <GradeSelector selectedGrade={newGrade} onSelect={setNewGrade} />
              </div>

              <Button
                variant="kid"
                className="w-full gap-2"
                onClick={handleAddChild}
                disabled={!canAddMore}
              >
                <Plus className="h-5 w-5" />
                Add Child
              </Button>

              {!canAddMore && (
                <p className="text-sm text-muted-foreground mt-3">
                  You already have 5 child accounts. Delete one to add another.
                </p>
              )}
            </div>

            
            {/* Custom words */}
            <div className="bg-card rounded-3xl shadow-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-2">Custom Words</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add your own words to the practice bank by grade. These words will appear in random word sets and rerolls.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Word</label>
                  <Input
                    value={customWordText}
                    onChange={(e) => setCustomWordText(e.target.value)}
                    placeholder="e.g., volcano"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Grade</label>
                  <GradeSelector selectedGrade={customWordGrade} onSelect={setCustomWordGrade} />
                </div>

                <Button variant="kid" className="w-full gap-2" onClick={handleAddCustomWord}>
                  <Plus className="h-5 w-5" />
                  Add Custom Word
                </Button>

                {customWords.length > 0 ? (
                  <div className="mt-4">
                    <div className="text-sm font-semibold mb-2">Saved Custom Words</div>
                    <div className="space-y-2 max-h-56 overflow-auto pr-1">
                      {customWords
                        .slice()
                        .sort((a, b) => (a.grade === b.grade ? a.word.localeCompare(b.word) : String(a.grade).localeCompare(String(b.grade))))
                        .map((w) => (
                          <div
                            key={w.id}
                            className="flex items-center justify-between gap-2 border border-border rounded-2xl px-3 py-2"
                          >
                            <div className="text-sm">
                              <span className="font-semibold">{w.word}</span>
                              <span className="text-muted-foreground"> • {w.grade === 'K' ? 'K' : `Grade ${w.grade}`}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleRemoveCustomWord(w.id)}
                              aria-label="Delete custom word"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-3">No custom words yet.</p>
                )}
              </div>
            </div>


            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => navigate('/play')} className="gap-2">
                <Play className="h-4 w-4" />
                Back to Play
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
