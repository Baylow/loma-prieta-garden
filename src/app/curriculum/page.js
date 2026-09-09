import CurriculumTabs from './CurriculumTabs';

export default function Curriculum() {
  return (
    <div className="container mt-8 animate-fade-in-up">
      <h1 className="text-center mb-2">Garden Curriculum & Volunteer Guide</h1>
      <p className="text-center mb-8 text-muted" style={{ maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
        Lesson plans, volunteer protocols, and class leadership assignments for the Loma Prieta School Garden.
      </p>

      <CurriculumTabs />
    </div>
  );
}
