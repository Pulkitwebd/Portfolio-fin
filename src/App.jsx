import { useEffect, useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { marked } from "marked";
import data from "./data/portfolio.json";
import heroDots from "./data/heroDots.json";
import { Projects, ProjectPage } from "./Projects.jsx";

const md = (text) => ({ __html: marked.parse(text || "") });
const mdInline = (text) => ({ __html: marked.parseInline(text || "") });

/* ---------------- Header ---------------- */
function Header({ toggleTheme }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [showOnTop, setShowOnTop] = useState(false);
  const nav = data.navbar;
  const menus = nav.menus;

  useEffect(() => {
    if (!nav.stickyNavBar?.enable) return;
    let prev = window.pageYOffset;
    const onScroll = () => {
      const cur = window.pageYOffset;
      const show = nav.stickyNavBar.showOnScrollUp ? prev > cur : cur > 0;
      setShowOnTop(show && cur !== 0);
      prev = cur;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [nav.stickyNavBar]);

  const links = [
    ["about", data.about, "About", menus.disableAbout],
    ["projects", data.projects, "Projects", menus.disableProjects],
    ["experience", data.experience, "Experience", menus.disableExperience],
    ["education", data.education, "Education", menus.disableEducation],
    ["achievements", data.achievements, "Achievements", menus.disableAchievements],
    ["contact", data.contact, "Contact", menus.disableContact],
  ].filter(([, section, , disabled]) => section?.enable && !disabled);

  // highlight the nav link of the section currently on screen
  const [activeId, setActiveId] = useState("");
  useEffect(() => {
    const els = links.map(([id]) => document.getElementById(id)).filter(Boolean);
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      els.forEach((el) => {
        if (el.offsetTop <= y) current = el.id;
      });
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header id="profileHeader" className={showOnTop ? "showHeaderOnTop" : ""}>
      <nav className={"pt-3 navbar navbar-expand-lg" + (data.animate ? " animate" : "")}>
        <div className="container-fluid mx-xs-2 mx-sm-5 mx-md-5 mx-lg-5">
          <Link className="navbar-brand primary-font text-wrap" to="/">
            {nav.brandName || data.title}
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarContent"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            <svg aria-hidden="true" height="24" viewBox="0 0 16 16" version="1.1" width="24">
              <path
                fillRule="evenodd"
                d="M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 7.75zM1.75 12a.75.75 0 100 1.5h12.5a.75.75 0 100-1.5H1.75z"
              />
            </svg>
          </button>

          <div className={"collapse navbar-collapse text-wrap primary-font" + (open ? " show" : "")} id="navbarContent">
            <ul className={`navbar-nav ${nav.align || "ms-auto"} text-center`}>
              {links.map(([id, section, fallback]) => (
                <li className="nav-item navbar-text" key={id}>
                  <Link
                    className={"nav-link" + (activeId === id ? " active" : "")}
                    to={`/#${id}`}
                    aria-label={id}
                    aria-current={activeId === id ? "true" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {section.title || fallback}
                  </Link>
                </li>
              ))}

              <li className="nav-item navbar-text">
                <div className="text-center">
                  <button id="theme-toggle" type="button" aria-label="Toggle dark mode" onClick={toggleTheme}>
                    <svg id="moon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <svg id="sun" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const h = data.hero;
  if (!h.enable) return null;
  const anim = data.animate ? " animate" : "";
  const ext = (url) => (url.startsWith("#") ? {} : { target: "_blank", rel: "noreferrer" });
  return (
    <section id="hero" className="py-5 align-middle">
      <div className="container px-3 px-sm-5 px-md-5 px-lg-5 pt-lg-3">
        <div className="row align-items-center hero-row">
          <div className={"col-sm-12 col-md-12 col-lg-7 content" + anim} id="primary-font">
            {h.badge && (
              <span className="hero-badge">
                <span className="hero-badge-dot"></span> {h.badge}
              </span>
            )}
            <span className="subtitle">{h.intro}</span>
            <h1>{h.title}</h1>
            <h2>{h.subtitle}</h2>
            <p className="hero-content" dangerouslySetInnerHTML={mdInline(h.content)} />

            {h.tags?.length > 0 && (
              <ul className="hero-tags">
                {h.tags.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}

            <div className="hero-actions">
              {h.button?.enable && (
                <a
                  href={h.button.url}
                  className="btn"
                  download={h.button.download ? "" : undefined}
                  target={h.button.newPage ? "_blank" : undefined}
                  rel={h.button.newPage ? "noreferrer" : undefined}
                >
                  <i className="fas fa-download"></i> {h.button.name}
                </a>
              )}
              {h.secondaryButton?.enable && (
                <a href={h.secondaryButton.url} className="btn hero-btn-outline" {...ext(h.secondaryButton.url)}>
                  {h.secondaryButton.name}
                </a>
              )}
              <span className="hero-social">
                {(h.socialLinks?.fontAwesomeIcons || []).map((s, i) => (
                  <a
                    key={"fa" + i}
                    href={s.url}
                    className={"btn social-icon" + (s.brand ? ` brand-btn brand-${s.brand}` : "")}
                    aria-label={s.label || s.icon}
                    {...ext(s.url)}
                  >
                    <i className={s.icon}></i>
                    {s.label && <span>{s.label}</span>}
                  </a>
                ))}
                {(h.socialLinks?.customIcons || []).map((s, i) => (
                  <a key={"ci" + i} href={s.url} className="btn social-icon" {...ext(s.url)}>
                    <img src={s.icon} alt="" />
                  </a>
                ))}
              </span>
            </div>
          </div>

          <div className="col-sm-12 col-md-12 col-lg-5">
            <div className="row justify-content-center">
              <div className={"col-sm-12 col-md-9 col-lg-12 pt-5 pt-lg-0 image hero-image" + anim + " px-5 px-md-5 px-lg-0 text-center"}>
                <div className="hero-frame">
                  <img
                    src={h.image}
                    className={"img-thumbnail mx-auto" + (h.roundImage ? " rounded-circle" : "")}
                    alt={`${data.title} profile image`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="hero-scroll d-none d-md-flex" aria-label="Scroll down">
        <i className="fas fa-chevron-down"></i>
      </a>

      {h.bottomImage?.enable !== false && (
        <div className="hero-bottom-svg d-md-block d-lg-block d-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="201" height="201" viewBox="0 0 201 201">
            <g transform="translate(-384 -1392)">
              {heroDots.map((t, i) => (
                <rect key={i} width="12" height="2" rx="1" transform={t} fill="#282f49" />
              ))}
            </g>
          </svg>
        </div>
      )}
    </section>
  );
}

/* ---------------- About ---------------- */
function About() {
  const a = data.about;
  if (!a.enable) return null;
  return (
    <section id="about" className="py-0 py-sm-5">
      <div className="container bg-transparent">
        <h3 className="text-center bg-transparent">{a.title || "About Me"}</h3>
        <div className="bg-transparent row justify-content-center px-3 py-5">
          {a.image && (
            <div className="col-sm-12 col-md-8 col-lg-4 mb-5 mb-sm-0 mb-md-5 mb-lg-0 d-none d-sm-none d-md-block">
              <div className="image d-flex px-5">
                <img src={a.image} className="img-thumbnail mx-auto rounded-circle" alt={`${data.title} profile picture`} />
              </div>
            </div>
          )}
          <div className="col-sm-12 col-md-12 col-lg-8 content">
            <div className="about-text" dangerouslySetInnerHTML={md(a.content)} />
            {/* {a.stats?.length > 0 && (
              <div className="about-stats">
                {a.stats.map((s, i) => (
                  <div className="about-stat" key={i}>
                    <span className="about-stat-value">{s.value}</span>
                    <span className="about-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            )} */}
            {a.skills?.enable && (
              <>
                <p className="about-skills-title">{a.skills.title}</p>
                <ul className="about-skills">
                  {a.skills.items.map((s, i) => (
                    <li key={i} dangerouslySetInnerHTML={mdInline(s)} />
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Experience (timeline) ---------------- */
// bold the numbers (58, 50+, 15%...) so key results stand out; skips HTML tags
const highlightNumbers = (html) =>
  html
    .split(/(<[^>]+>)/g)
    .map((part) =>
      part.startsWith("<") ? part : part.replace(/(\d[\d,.]*\+?%?)/g, '<strong class="exp-num">$1</strong>')
    )
    .join("");

function Experience() {
  const e = data.experience;
  if (!e.enable) return null;

  // one card per job, newest first (same order as the JSON)
  const entries = e.items.flatMap((item) =>
    (item.jobs || []).map((job) => ({ company: item.company, companyUrl: item.companyUrl, job }))
  );

  return (
    <section id="experience" className="py-5">
      <div className="container">
        <h3 className="text-center">{e.title || "Experience"}</h3>
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-10 col-lg-8 py-5">
            <ol className="exp-timeline">
              {entries.map(({ company, companyUrl, job }, i) => (
                <li className="exp-item" key={i}>
                  <span className="exp-dot" aria-hidden="true">
                    <i className="fas fa-briefcase"></i>
                  </span>
                  <article className="exp-card">
                    <header className="exp-head">
                      <div className="exp-heading">
                        <h4 className="exp-role">{job.name}</h4>
                        <div className="exp-company">
                          <i className="fas fa-building"></i>
                          {companyUrl ? (
                            <a href={companyUrl} target="_blank" rel="noreferrer">
                              {company}
                            </a>
                          ) : (
                            <span>{company}</span>
                          )}
                        </div>
                      </div>
                      <div className="exp-meta">
                        {i === 0 && <span className="exp-latest">Latest</span>}
                        <span className="exp-date">
                          <i className="far fa-calendar"></i> {job.date}
                        </span>
                      </div>
                    </header>
                    <div className="exp-body" dangerouslySetInnerHTML={{ __html: highlightNumbers(marked.parse(job.content || "")) }} />
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Education ---------------- */
function Education() {
  const ed = data.education;
  if (!ed.enable) return null;
  return (
    <section id="education" className="py-5">
      <div className="container">
        <h3 className="text-center">{ed.title || "Education"}</h3>
        <div className="row justify-content-center py-5">
          {ed.items.map((item, i) => (
            <div className="col-12 p-0" key={i}>
              <div className="row row align-items-center justify-content-center m-1 mb-4">
                {ed.index && (
                  <div className="col-md-1 text-center me-2 p-0 d-none d-md-block">
                    <div className="py-2">
                      <span className="index shadow-lg">{i + 1}</span>
                    </div>
                  </div>
                )}
                <div className="col-md-9">
                  <div className="card">
                    <div className="card-body">
                      <div className="float-end">
                        <small>{item.date}</small>
                      </div>
                      <h5 className="card-title">{item.title}</h5>
                      {item.school?.url ? (
                        <a href={item.school.url} target="_blank" rel="noreferrer">
                          <h6>{item.school.name}</h6>
                        </a>
                      ) : (
                        item.school?.name
                      )}
                      {item.GPA && (
                        <div className="py-1">
                          GPA:{" "}
                          <i>
                            <small>{item.GPA}</small>
                          </i>
                        </div>
                      )}
                      <div className="py-1 education-content" dangerouslySetInnerHTML={md(item.content)} />
                      {item.featuredLink?.enable && (
                        <div className="py-1">
                          <a href={item.featuredLink.url} className="btn">
                            {item.featuredLink.name || "Featured"}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Achievements / Certifications ---------------- */
function Achievements() {
  const a = data.achievements;
  if (!a.enable) return null;
  return (
    <section id="achievements" className="py-5">
      <div className="container">
        <h3 className="text-center">{a.title || "Achievements"}</h3>
        <div className="px-0 px-md-3 px-lg-5">
          <div className="row justify-content-center px-3 px-md-3 px-lg-5 py-5 g-4">
            {a.items.map((item, i) => {
              const body = (
                <>
                  <div className="cert-top">
                    <span className="cert-icon" aria-hidden="true">
                      <i className={item.icon || "fas fa-award"}></i>
                    </span>
                    {item.date && (
                      <span className="cert-date">
                        <i className="far fa-calendar"></i> {item.date}
                      </span>
                    )}
                  </div>
                  <h5 className="cert-title">{item.title}</h5>
                  {item.issuer && <div className="cert-issuer">{item.issuer}</div>}
                  {item.image && <img className="card-img-top" src={item.image} alt="" />}
                  {item.points?.length > 0 && (
                    <ul className="cert-points">
                      {item.points.map((pt, k) => (
                        <li key={k}>{pt}</li>
                      ))}
                    </ul>
                  )}
                  {item.content && <p className="cert-text">{item.content}</p>}
                  {item.url && (
                    <span className="cert-link">
                      View credential <i className="fas fa-arrow-up-right-from-square"></i>
                    </span>
                  )}
                </>
              );
              return (
                <div className="col-lg-4 col-md-6 d-flex" key={i}>
                  {item.url ? (
                    <a className="cert-card" href={item.url} title={item.title} target="_blank" rel="noreferrer">
                      {body}
                    </a>
                  ) : (
                    <div className="cert-card" title={item.title}>
                      {body}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  const c = data.contact;
  if (!c.enable) return null;
  const telHref = c.phone ? `tel:${c.phone.replace(/[^\d+]/g, "")}` : null;
  const cards = [
    c.email && { icon: "fas fa-envelope", label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.phone && { icon: "fas fa-phone", label: "Phone", value: c.phone, href: telHref },
    c.location && { icon: "fas fa-location-dot", label: "Location", value: c.location },
    c.linkedin && { icon: "fab fa-linkedin-in", label: "LinkedIn", value: "Connect with me", href: c.linkedin, external: true },
  ].filter(Boolean);

  return (
    <section id="contact" className="py-5">
      <div className="container">
        <h3 className="text-center">{c.title || "Get in Touch"}</h3>
        <div className="px-0 px-md-3 px-lg-5">
          <div className="row justify-content-center px-md-3">
            <div className="col-lg-9 py-4">
              <div className="text-center contact-intro" dangerouslySetInnerHTML={md(c.content)} />

              <div className="row g-3 justify-content-center contact-cards">
                {cards.map((card, i) => {
                  const inner = (
                    <>
                      <span className="contact-icon" aria-hidden="true">
                        <i className={card.icon}></i>
                      </span>
                      <span className="contact-info">
                        <span className="contact-label">{card.label}</span>
                        <span className="contact-value">{card.value}</span>
                      </span>
                    </>
                  );
                  return (
                    <div className="col-12 col-md-6" key={i}>
                      {card.href ? (
                        <a className="contact-card" href={card.href} {...(card.external && { target: "_blank", rel: "noreferrer" })}>
                          {inner}
                        </a>
                      ) : (
                        <div className="contact-card">{inner}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="contact-actions text-center">
                {(c.btnLink || c.email) && (
                  <a href={c.btnLink || `mailto:${c.email}`} className="btn">
                    <i className="fas fa-paper-plane"></i> {c.btnName || "Mail me"}
                  </a>
                )}
                {telHref && (
                  <a href={telHref} className="btn">
                    <i className="fas fa-phone"></i> Call me
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const social = data.footer?.socialNetworks || {};
  const brand = (key, icon) =>
    social[key] && (
      <span className="px-1">
        <a href={social[key]} target="_blank" rel="noreferrer" aria-label={key}>
          <i className={`fab fa-${icon} fa-2x`}></i>
        </a>
      </span>
    );
  return (
    <footer>
      <div className="text-center pt-2">
        {brand("github", "github")}
        {social.linkedin && (
          <span className="px-1">
            <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="linkedin">
              <svg xmlns="http://www.w3.org/2000/svg" width="2.4em" height="2.4em" fill="#fff" aria-label="LinkedIn" viewBox="0 0 512 512">
                <rect width="512" height="512" fill="#0077b5" rx="15%" />
                <circle cx="142" cy="138" r="37" />
                <path stroke="#fff" strokeWidth="66" d="M244 194v198M142 194v198" />
                <path d="M276 282c0-20 13-40 36-40 24 0 33 18 33 45v105h66V279c0-61-32-89-76-89-34 0-51 19-59 32" />
              </svg>
            </a>
          </span>
        )}
        {brand("twitter", "twitter")}
        {brand("instagram", "instagram")}
        {brand("facebook", "facebook")}
      </div>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-4 text-center">
            &copy; {new Date().getFullYear()} {data.copyright} {data.terms?.copyright || "All Rights Reserved"}
            <div className="text-secondary">
              Made with <span className="text-danger">&#10084;</span> and{" "}
              <a href="https://github.com/gurusabarish/hugo-profile" target="_blank" rel="noreferrer" title="Designed and developed by gurusabarish">
                Hugo Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  const [dark, setDark] = useState(() => !!window.__dark);
  const location = useLocation();

  // after changing page: jump to #section if given, otherwise to the top
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash, location.key]);

  useEffect(() => {
    document.title = data.title;
    // Like the Hugo theme: body always keeps "light" (theme.css paints the page with it);
    // "dark" is added on top and swaps the colour variables.
    document.body.classList.add("light");
    document.body.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // scroll progress bar, back-to-top button
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      setShowTop(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fade sections in as they scroll into view
  useEffect(() => {
    const sections = document.querySelectorAll("#content > section:not(#hero)");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.08 }
    );
    sections.forEach((s) => {
      s.classList.add("reveal");
      io.observe(s);
    });
    return () => io.disconnect();
  }, [location.pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem("pref-theme", next ? "dark" : "light");
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <Header toggleTheme={toggleTheme} />
      <div id="content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Projects />
                <Experience />
                <Education />
                <Achievements />
                <Contact />
              </>
            }
          />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route
            path="*"
            element={
              <section className="py-5 text-center project-notfound">
                <h3>Page not found</h3>
                <Link to="/" className="btn">Back to home</Link>
              </section>
            }
          />
        </Routes>
      </div>
      <Footer />
      <button
        type="button"
        className={"back-to-top" + (showTop ? " show" : "")}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
}
