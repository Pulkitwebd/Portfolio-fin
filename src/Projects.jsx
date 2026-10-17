import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { marked } from "marked";
import data from "./data/portfolio.json";

const slugOf = (p, i) => p.slug || `project-${i + 1}`;

/* ---------------- Projects section (on the home page) ---------------- */
export function Projects() {
  const p = data.projects;
  if (!p?.enable || !p.items?.length) return null;
  return (
    <section id="projects" className="py-5">
      <div className="container">
        <h3 className="text-center">{p.title || "Projects"}</h3>
        {p.intro && <p className="text-center projects-intro">{p.intro}</p>}
        <div className="row justify-content-center px-3 px-md-3 px-lg-5 py-4 g-4">
          {p.items.map((item, i) => (
            <div className="col-lg-6 d-flex" key={i}>
              <Link to={`/projects/${slugOf(item, i)}`} className="project-card">
                <div className="project-top">
                  <span className="project-icon" aria-hidden="true">
                    <i className={item.icon || "fas fa-folder-open"}></i>
                  </span>
                  {item.period && <span className="project-period">{item.period}</span>}
                </div>
                <h5 className="project-title">{item.title}</h5>
                {item.org && <div className="project-org">{item.org}</div>}
                <p className="project-summary">{item.summary}</p>
                {item.badges?.length > 0 && (
                  <ul className="project-badges">
                    {item.badges.map((b, k) => (
                      <li key={k}>{b}</li>
                    ))}
                  </ul>
                )}
                <span className="project-more">
                  View project <i className="fas fa-arrow-right"></i>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Single project page ---------------- */
export function ProjectPage() {
  const { slug } = useParams();
  const items = data.projects?.items || [];
  const index = items.findIndex((p, i) => slugOf(p, i) === slug);
  const project = items[index];

  useEffect(() => {
    if (project) document.title = `${project.title} | ${data.title}`;
    return () => {
      document.title = data.title;
    };
  }, [project]);

  if (!project) {
    return (
      <section className="py-5 text-center project-notfound">
        <h3>Project not found</h3>
        <Link to="/#projects" className="btn">
          Back to projects
        </Link>
      </section>
    );
  }

  const prev = index > 0 ? items[index - 1] : null;
  const next = index < items.length - 1 ? items[index + 1] : null;

  return (
    <section className="py-5 project-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <Link to="/#projects" className="project-back">
              <i className="fas fa-arrow-left"></i> All projects
            </Link>

            <header className="project-hero">
              <span className="project-icon project-icon-lg" aria-hidden="true">
                <i className={project.icon || "fas fa-folder-open"}></i>
              </span>
              <h1>{project.title}</h1>
              <p className="project-lead">{project.summary}</p>

              <div className="project-meta">
                {project.org && (
                  <div>
                    <i className="fas fa-building"></i>
                    <span>Organisation</span>
                    <strong>{project.org}</strong>
                  </div>
                )}
                {project.role && (
                  <div>
                    <i className="fas fa-user-tie"></i>
                    <span>Role</span>
                    <strong>{project.role}</strong>
                  </div>
                )}
                {project.period && (
                  <div>
                    <i className="far fa-calendar"></i>
                    <span>Period</span>
                    <strong>{project.period}</strong>
                  </div>
                )}
              </div>
            </header>

            {project.image && <img className="project-cover" src={project.image} alt={project.title} />}

            {project.overview && (
              <div className="project-block">
                <h2>Overview</h2>
                <div dangerouslySetInnerHTML={{ __html: marked.parse(project.overview) }} />
              </div>
            )}

            {project.highlights?.length > 0 && (
              <div className="project-block">
                <h2>What I did</h2>
                <ul className="project-highlights">
                  {project.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.badges?.length > 0 && (
              <div className="project-block">
                <h2>Skills &amp; tools</h2>
                <ul className="project-badges">
                  {project.badges.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.links?.length > 0 && (
              <div className="project-block project-links">
                {project.links.map((l, i) => (
                  <a key={i} className="btn" href={l.url} target="_blank" rel="noreferrer">
                    {l.icon && <i className={l.icon}></i>} {l.name || "Open link"}
                  </a>
                ))}
              </div>
            )}

            <nav className="project-pager">
              {prev ? (
                <Link to={`/projects/${slugOf(prev, index - 1)}`}>
                  <small>
                    <i className="fas fa-arrow-left"></i> Previous
                  </small>
                  <span>{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link to={`/projects/${slugOf(next, index + 1)}`} className="next">
                  <small>
                    Next <i className="fas fa-arrow-right"></i>
                  </small>
                  <span>{next.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
