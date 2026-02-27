import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

/* ---------------- DASHBOARD ---------------- */

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero-bg-section">
        <section className="hero">
          <div className="container hero-grid hero-center">
            <div>
              <h1>
                Innovate for <span>Smarter Cities</span>
              </h1>
              <p>
                A platform where students submit innovative ideas to reduce
                pressure on city resources, transport networks and logistics
                infrastructure.
              </p>

              <div className="hero-actions hero-actions-center">
                <button className="btn" onClick={() => navigate("/ideas")}>
                  Explore Ideas
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/submit")}
                >
                  Submit Idea
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="section-title">Core Innovation Areas</h2>

            <div className="features">
              {[
                "Smart Transport",
                "Waste Management",
                "Energy Optimization",
                "Logistics Automation",
                "AI & Data Analytics",
                "Sustainable Cities",
              ].map((item) => (
                <div key={item} className="feature-card">
                  <h3 className="feature-title">{item}</h3>
                  <p>
                    Student-driven ideas focused on {item.toLowerCase()} and
                    real-world urban challenges.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="cta-strip">
        <div className="container cta-content cta-center">
          <h2>Have an idea that can improve city life?</h2>
          <button className="btn" onClick={() => navigate("/submit")}>
            Submit Your Idea
          </button>
        </div>
      </section>
    </>
  );
}

/* ---------------- IDEAS ---------------- */

function Ideas() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/ideas")
      .then((res) => res.json())
      .then((data) => setIdeas(data));
  }, []);

  return (
    <div className="page-center">
      <div className="container">
        <h1>Ideas</h1>

        {ideas.length === 0 && <p>No ideas found.</p>}

        <div className="features">
          {ideas.map((idea) => (
            <div key={idea._id} className="feature-card">
              <h3 className="feature-title">{idea.title}</h3>
              <p><strong>Category:</strong> {idea.category}</p>
              <p>{idea.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUBMIT IDEA ---------------- */

function SubmitIdea() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!token) {
      alert("Please login to submit an idea");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5001/api/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, category, description }),
    });

    alert("Idea submitted successfully!");
    navigate("/ideas");
  };

  return (
    <div className="page-center">
      <div className="container">
        <h1>Submit Your Idea</h1>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            placeholder="Idea Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoComplete="off"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option>Smart Transport</option>
            <option>Waste Management</option>
            <option>Energy Optimization</option>
            <option>Logistics Automation</option>
            <option>AI & Data Analytics</option>
            <option>Sustainable Cities</option>
          </select>

          <textarea
            placeholder="Describe your idea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            autoComplete="off"
          />

          <button className="btn">Submit Idea</button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- LOGIN ---------------- */

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      navigate("/submit");
      window.location.reload();
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="page-center">
      <div className="container">
        <h1>Login</h1>

        <form className="contact-form" onSubmit={handleLogin}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- SIGNUP ---------------- */

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5001/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    navigate("/login");
  };

  return (
    <div className="page-center">
      <div className="container">
        <h1>Sign Up</h1>

        <form className="contact-form" onSubmit={handleSignup}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn">Create Account</button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- ABOUT ---------------- */

function About() {
  return (
    <div className="page-center">
      <div className="container about-container">
        <h1>About Us</h1>

        <div className="about-cards">
          <div className="about-card">
            <div className="avatar">SB</div>
            <h3>Sahil Bhardwaj</h3>
            <p>Full Stack Developer</p>
            <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>

          <div className="about-card">
            <div className="avatar">TM</div>
            <h3>Vivek</h3>
            <p>Database / FrontEnd Contributor</p>
            <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <div className="about-card">
            <div className="avatar">TM</div>
            <h3>Swayam</h3>
            <p>Database / FrontEnd Contributor</p>
            <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- APP ---------------- */

function AppLayout() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="container nav-inner">
          <h2 className="logo">Student Innovation</h2>

          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/ideas">Ideas</Link>
            <Link to="/submit">Submit</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="nav-auth">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/signup" className="btn">Sign Up</Link>
              </>
            ) : (
              <button className="btn btn-logout" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/submit" element={<SubmitIdea />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <footer className="footer">
        © 2025 Student Innovation — Smart Cities through Student Ideas
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
