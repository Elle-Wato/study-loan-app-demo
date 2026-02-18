export default function SiblingsSection({ onNext, onBack }) {
  return (
    <div>
      <h2>Coming Soon: Siblings Section</h2>
      <button onClick={onBack}>Back</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
}