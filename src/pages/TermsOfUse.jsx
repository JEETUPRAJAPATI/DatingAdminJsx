import React from "react";
import {
  ArrowLeft,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Scale,
  Phone,
  Heart,
} from "lucide-react";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/80 border-b border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a
              href="/"
              className="flex items-center space-x-2 text-cyan-400 hover:opacity-80 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </a>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">
                HEART2GET
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-black/20 border border-gray-800 rounded-xl p-6 md:p-10 backdrop-blur-md shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full mx-auto flex items-center justify-center">
              <FileText className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4">
              Terms of Use
            </h1>
            <p className="text-gray-400 text-sm mt-2">Last Updated: 7.7.2025</p>
          </div>

          <p className="mb-4 text-gray-300">
            Welcome to <strong>HEART2GET</strong> (“we,” “our,” “us,” or “the
            App”). These Terms of Use (“Terms”) govern your access to and use of
            the HEART2GET mobile application, website, and related services
            (collectively, the “Services”). By accessing or using HEART2GET, you
            agree to be bound by these Terms.
          </p>

          <p className="mb-6 font-medium text-red-400">
            If you do not agree to these Terms, you must not use our Services.
          </p>

          {/* Sections */}
          {sections.map((section, idx) => (
            <Section key={idx} title={section.title} icon={section.icon}>
              {section.content}
            </Section>
          ))}

          <div className="text-center text-xs text-gray-500 mt-10">
            &copy; {new Date().getFullYear()} HEART2GET. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
};

// Section reusable component
const Section = ({ title, children, icon: Icon }) => (
  <div className="mb-10">
    <div className="flex items-center mb-3">
      {Icon && <Icon className="h-5 w-5 text-cyan-500 mr-2" />}
      <h2 className="text-lg md:text-xl font-semibold text-cyan-500">
        {title}
      </h2>
    </div>
    <div className="text-gray-300 text-sm leading-relaxed space-y-2">
      {children}
    </div>
  </div>
);

// Terms Sections
const sections = [
  {
    title: "1. Eligibility",
    icon: Users,
    content: (
      <>
        <ul className="list-disc list-inside">
          <li>You must be at least 18 years old to use HEART2GET.</li>
          <li>
            By creating an account, you represent that:
            <ul className="list-disc ml-5">
              <li>You have the legal capacity to enter into this agreement.</li>
              <li>All information provided is accurate and truthful.</li>
              <li>
                You will comply with all applicable laws (local, Israeli, EU,
                and international).
              </li>
            </ul>
          </li>
        </ul>
        <p className="pt-2">
          We may suspend or terminate any account that violates these
          requirements.
        </p>
      </>
    ),
  },
  {
    title: "2. Account Registration",
    icon: Shield,
    content: (
      <ul className="list-disc list-inside">
        <li>You must provide accurate and up-to-date information.</li>
        <li>You are responsible for your account and credentials.</li>
        <li>Notify us of any unauthorized use or security breach.</li>
      </ul>
    ),
  },
  {
    title: "3. User Conduct",
    icon: Users,
    content: (
      <>
        <p>You agree to use HEART2GET responsibly and NOT to:</p>
        <ul className="list-disc list-inside">
          <li>Harass, abuse, defame, or impersonate users.</li>
          <li>Share obscene, illegal, or offensive content.</li>
          <li>Solicit money, engage in scams, or prostitution.</li>
          <li>Collect or misuse others’ personal info.</li>
          <li>Use bots, scripts, or automation.</li>
          <li>Violate any IP or privacy rights.</li>
          <li>Upload viruses or harmful code.</li>
        </ul>
        <p className="text-cyan-500 font-medium pt-2">
          Violations may result in suspension, legal action, and reporting to
          authorities.
        </p>
      </>
    ),
  },
  {
    title: "4. Safety and Disclaimers",
    icon: AlertTriangle,
    content: (
      <ul className="list-disc list-inside">
        <li>No background checks — be cautious.</li>
        <li>We are not responsible for user behavior or harm.</li>
        <li>Offline meetings are at your own risk.</li>
      </ul>
    ),
  },
  {
    title: "5. Premium Services and Payments",
    icon: Scale,
    content: (
      <ul className="list-disc list-inside">
        <li>Some features require payment.</li>
        <li>Payments handled via third parties.</li>
        <li>Prices may change (not during active subscription).</li>
        <li>Auto-renew applies unless canceled before renewal.</li>
        <li>
          <strong>No Refund Policy</strong>, except where required by law.
        </li>
      </ul>
    ),
  },
  {
    title: "6. Content You Share",
    icon: FileText,
    content: (
      <ul className="list-disc list-inside">
        <li>You own the content you post.</li>
        <li>You grant us license to use content to operate the app.</li>
        <li>Do not post illegal or infringing content.</li>
      </ul>
    ),
  },
  {
    title: "7. Intellectual Property",
    icon: FileText,
    content: (
      <ul className="list-disc list-inside">
        <li>All app content and IP is owned by HEART2GET.</li>
        <li>Do not copy or reverse-engineer without permission.</li>
      </ul>
    ),
  },
  {
    title: "8. Privacy and Data Protection",
    icon: Shield,
    content: (
      <p>
        Your use of HEART2GET is subject to our Privacy Policy. By using the
        app, you consent to our data practices.
      </p>
    ),
  },
  {
    title: "9. Account Suspension and Termination",
    icon: AlertTriangle,
    content: (
      <ul className="list-disc list-inside">
        <li>We may suspend or terminate for violations or fraud.</li>
        <li>You can delete your account anytime.</li>
      </ul>
    ),
  },
  {
    title: "10. Third-Party Services and Links",
    icon: FileText,
    content: (
      <p>
        We are not responsible for content or policies of third-party services
        linked in the app.
      </p>
    ),
  },
  {
    title: "11. Limitation of Liability",
    icon: Scale,
    content: (
      <ul className="list-disc list-inside">
        <li>Services are provided "AS IS" without warranty.</li>
        <li>We are not liable for indirect or emotional damages.</li>
        <li>Total liability is limited to your last 6 months' payments.</li>
      </ul>
    ),
  },
  {
    title: "12. Consumer Rights (Israel & EU)",
    icon: Scale,
    content: (
      <ul className="list-disc list-inside">
        <li>EU: 14-day digital withdrawal right applies.</li>
        <li>Israel: Protection under Israeli Consumer Protection Law, 1981.</li>
      </ul>
    ),
  },
  {
    title: "13. Indemnification",
    icon: Shield,
    content: (
      <p>
        You agree to indemnify HEART2GET and its team from any claims due to
        your actions or breach of Terms.
      </p>
    ),
  },
  {
    title: "14. Governing Law and Jurisdiction",
    icon: Scale,
    content: (
      <ul className="list-disc list-inside">
        <li>Israel: Governed by Israeli law, Tel Aviv courts.</li>
        <li>EU: GDPR applies, but disputes handled in Israel.</li>
      </ul>
    ),
  },
  {
    title: "15. Changes to Terms",
    icon: FileText,
    content: (
      <p>
        We may update Terms. Major changes will be notified via email or in-app.
        Continued use = agreement.
      </p>
    ),
  },
  {
    title: "16. Contact Us",
    icon: Phone,
    content: (
      <p>
        For questions, email us at:{" "}
        <a
          href="mailto:support@heart2getapp.com"
          className="text-cyan-400 underline hover:text-cyan-300"
        >
          support@heart2getapp.com
        </a>
      </p>
    ),
  },
];

export default TermsOfUse;
