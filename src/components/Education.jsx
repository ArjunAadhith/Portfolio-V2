export default function AcademicJourney() {
  return (
    <>
      <style>{CSS}</style>
      <section className="aj">
        <p className="aj-label">Academic Journey</p>

        <div className="aj-block">
          <h2 className="aj-title">
            Bachelor of Engineering(B.E)<br />
            Computer Science &amp; Engineering
          </h2>
          <div className="aj-meta">
            <p>Karpaga Vinayaga College, Chennai</p>
            <p>Nov 2022 - May 2026</p>
            <p>CGPA: 8.2</p>
          </div>
        </div>

        <hr className="aj-rule" />

        <div className="aj-block">
          <h2 className="aj-title">
            Higher Secondary Education<br />
            Computer Science
          </h2>
          <div className="aj-meta">
            <p>Shanthi Nikethan Matric, Perambalur</p>
            <p>June 2021 - May 2022</p>
            <p>Grade: 82.6</p>
          </div>
        </div>
      </section>
    </>
  );
}

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .aj {
    background: #ffffff;
    width: 100%;
    min-height: 100vh;
    padding: 40px 88px 80px;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont,
                 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ── "Academic Journey" label ── */
  .aj-label {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    letter-spacing: 0.005em;
    margin-bottom: 56px;
    padding-left: 4px;
  }

  /* ── Education block ── */
  .aj-block {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Large bold degree title ── */
  .aj-title {
    font-size: 42px;
    font-weight: 700;
    color: #111111;
    letter-spacing: -0.022em;
    line-height: 1.2;
  }

  /* ── Meta: college / date / grade ── */
  .aj-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .aj-meta p {
    font-size: 14px;
    font-weight: 400;
    color: #1a1a1a;
    letter-spacing: 0.002em;
    line-height: 1.65;
  }

  /* ── Horizontal rule ── */
  .aj-rule {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    margin: 52px 0;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .aj          { padding: 36px 32px 64px; }
    .aj-label    { margin-bottom: 44px; }
    .aj-title    { font-size: 30px; }
    .aj-rule     { margin: 40px 0; }
  }

  @media (max-width: 480px) {
    .aj       { padding: 32px 20px 56px; }
    .aj-title { font-size: 24px; }
  }
`;