export default function AboutPage() {
  return (
    <section className="page">
      <div className="about-card">
        <h2>About for Parents and Teachers</h2>
        <p>
          Typing Adventure Kids is a lightweight React website built for practice
          at home or in class. It runs entirely in the browser and does not use
          a backend, database, or account system.
        </p>
        <ul>
          <li>Designed for quick sessions with colorful, child-friendly visuals.</li>
          <li>Stores only small local progress data in browser localStorage.</li>
          <li>Includes game-based practice and a timed typing test.</li>
          <li>Lets learners download typing result cards as PNG images.</li>
          <li>Works on desktop and mobile with responsive layout.</li>
        </ul>
      </div>
    </section>
  );
}
