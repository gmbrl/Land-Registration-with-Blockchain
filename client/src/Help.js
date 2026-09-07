import React from "react";
import Faq from "react-faq-component";
import "./help.css";
import "./index.css";

const faqData = {
  rows: [
    {
      title: "What are the prerequisites for using the system?",
      content:
        "You need the MetaMask browser extension and Ganache to run the system on a local Ethereum blockchain.",
    },
    {
      title: "How can I understand how the system works?",
      content:
        "Use this FAQ page to learn about registration, verification, land requests, and property listing workflows.",
    },
    {
      title: "Where can I find the project source code?",
      content: (
        <p>
          The complete source code is available in our{" "}
          <a
            href="https://github.com/gmbrl/SE-Project"
            target="_blank"
            rel="noreferrer"
          >
            GitHub repository
          </a>
          .
        </p>
      ),
    },
    {
      title: "What should I register as?",
      content:
        "If you own land and want to sell it, register as a Seller. If you want to purchase land, register as a Buyer.",
    },
    {
      title: "Why can't I request land after registering as a Buyer?",
      content:
        "Your account profile and documents must first be verified by the Land Inspector. Once approved, you can request a land property.",
    },
    {
      title: "Why can't I add a land property after registering as a Seller?",
      content:
        "Seller accounts must also be verified by the Land Inspector before adding a land property to the system.",
    },
    {
      title: "Who created this project?",
      content:
        "This project was created by Mrunal Kotkar, Divya Kharode, and Vrinda Ahuja.",
    },
  ],
};

const faqStyles = {
  bgColor: "transparent",
  titleTextColor: "#172033",
  rowTitleColor: "#172033",
  rowContentColor: "#667085",
  rowContentPaddingBottom: "20px",
  rowContentPaddingTop: "8px",
  transitionDuration: "0.35s",
  timingFunc: "ease",
  arrowColor: "#4f46e5",
};

const faqConfig = {
  animate: true,
  tabFocus: true,
};

function Help() {
  const goToDashboard = () => {
    window.location.href = "http://localhost:3000/#loaded";
  };

  return (
    <main className="help-page">
      <section className="help-hero">
        <div className="help-hero-content">
          <button
            type="button"
            className="back-dashboard-button"
            onClick={goToDashboard}
          >
            <span aria-hidden="true">←</span>
            Back to Dashboard
          </button>

          <span className="help-eyebrow">SUPPORT CENTER</span>

          <h1>
            Everything you need
            <span> to get started.</span>
          </h1>

          <p>
            Find clear answers about land registration, account verification,
            and buying or selling property on the blockchain.
          </p>

          <div className="help-hero-stats">
            <div>
              <strong>{faqData.rows.length}</strong>
              <span>Helpful answers</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Platform roles</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Self-service help</span>
            </div>
          </div>
        </div>

        <div className="help-hero-decoration" aria-hidden="true">
          <div className="decoration-orbit decoration-orbit-one" />
          <div className="decoration-orbit decoration-orbit-two" />
          <div className="decoration-center">?</div>
          <div className="decoration-card decoration-card-one">
            <span>✓</span>
            Verified
          </div>
          <div className="decoration-card decoration-card-two">
            <span>◆</span>
            Blockchain secured
          </div>
        </div>
      </section>

      <section className="help-content">
        <div className="process-strip">
          <div className="process-intro">
            <span className="help-eyebrow">AT A GLANCE</span>
            <h2>How it works</h2>
            <p>Three simple steps to get started with the platform.</p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <span className="process-number">01</span>
              <div>
                <h3>Connect</h3>
                <p>Set up MetaMask and access your account.</p>
              </div>
            </div>

            <div className="process-step">
              <span className="process-number">02</span>
              <div>
                <h3>Verify</h3>
                <p>Submit your profile and required documents.</p>
              </div>
            </div>

            <div className="process-step">
              <span className="process-number">03</span>
              <div>
                <h3>Transact</h3>
                <p>Request or list property securely.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section-heading">
          <span className="help-eyebrow">FAQ</span>
          <h2>Frequently asked questions</h2>
          <p>
            Browse the topics below to quickly find the information you need.
          </p>
        </div>

        <div className="faq-card">
          <Faq data={faqData} styles={faqStyles} config={faqConfig} />
        </div>

        <div className="help-contact-card">
          <div>
            <span className="help-eyebrow">STILL NEED HELP?</span>
            <h3>Explore the project source code</h3>
            <p>
              Visit the GitHub repository to learn more about the project and
              connect with the team.
            </p>
          </div>

          <a
            className="github-button"
            href="https://github.com/gmbrl/SE-Project"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}

export default Help;