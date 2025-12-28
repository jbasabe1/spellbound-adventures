import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GradeSelector } from '@/components/GradeSelector';
import { GradeLevel } from '@/types';
import { Lock, Plus, Trash2, Edit3, Play } from 'lucide-react';

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
