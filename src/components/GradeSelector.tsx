import { GradeLevel } from '@/types';
import { Button } from '@/components/ui/button';

interface GradeSelectorProps {
  selectedGrade: GradeLevel | null;
  onSelect: (grade: GradeLevel) => void;
}

const grades: { value: GradeLevel; label: string; emoji: string }[] = [
  { value: 'K', label: 'Kindergarten', emoji: '🌟' },
  { value: '1', label: 'Grade 1', emoji: '🚀' },
  { value: '2', label: 'Grade 2', emoji: '🎨' },
  { value: '3', label: 'Grade 3', emoji: '📚' },
  { value: '4', label: 'Grade 4', emoji: '🔬' },
  { value: '5', label: 'Grade 5', emoji: '🏆' },
];

export function GradeSelector({ selectedGrade, onSelect }: GradeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {grades.map((grade) => (
        <Button
          key={grade.value}
          variant={selectedGrade === grade.value ? 'game' : 'kid'}
          size="lg"
          onClick={() => onSelect(grade.value)}
          className="flex flex-col items-center gap-1 h-auto py-4"
        >
          <span className="text-2xl">{grade.emoji}</span>
          <span className="font-bold">{grade.label}</span>
        </Button>
      ))}
    </div>
  );
}
