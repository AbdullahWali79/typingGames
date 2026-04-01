const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "games", label: "Games Library" },
  { id: "test", label: "Typing Test" },
  { id: "result", label: "Result Card" },
  { id: "progress", label: "My Progress" },
  { id: "about", label: "About" }
];

export default function NavBar({ route, onNavigate }) {
  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-badge" />
        <span className="brand-text">Typing Adventure Kids</span>
      </div>
      <nav className="nav-links">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${route === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
