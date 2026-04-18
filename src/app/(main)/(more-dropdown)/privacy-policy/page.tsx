"use client";

import React from "react";
import LegalSidebar from "@/app/(main)/(more-dropdown)/legal/LegalSidebar";

export default function PrivacyPolicy() {
  const Link = ({ children }: { children: React.ReactNode }) => (
    <span className="cursor-pointer text-[#044DD2] hover:underline transition-colors">
      {children}
    </span>
  );

  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-white-smoke text-xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="flex justify-between bg-chinese-black text-white-smoke font-sans">

      {/* MAIN CONTENT */}
      <div className="w-[68%] min-w-xl">
        <main className="flex-1 max-w-3xl text-[14px] leading-relaxed text-white-smoke">
          <h1 className="text-3xl font-bold text-white-smoke mb-6">
            BeatZa Privacy Policy
          </h1>

          <p className="mb-4">
            BeatZa Global Limited & Co. KG (<strong className="text-white-smoke">"BeatZa"</strong>,{" "}
            <strong className="text-white-smoke">"we"</strong>,{" "}
            <strong className="text-white-smoke">"our"</strong>, or{" "}
            <strong className="text-white-smoke">"us"</strong>) is committed to protecting
            your personal data and respecting your privacy.
          </p>

          <p className="mb-4">
            This Privacy Policy explains how we collect, use, share and otherwise
            process personal data about users of our Platform, as defined in our{" "}
            <Link>Terms of Use</Link>. It also explains your rights in relation to
            that data and how to contact us if you have questions or concerns.
          </p>

          <p className="mb-4">
            Please also review our <Link>Terms of Use</Link> and{" "}
            <Link>Cookies Policy</Link> for additional information about how we
            operate the Platform.
          </p>

          <Section id="data-collected" title="Data We Collect">
            <p className="mb-4">
              We collect data you provide directly to us, such as when you create
              an account, upload content, communicate with other users, or contact
              us for support. This includes your email address, username, profile
              information, and any content you submit to the Platform.
            </p>
            <p className="mb-6">
              We also collect data automatically when you use the Platform,
              including usage data, device information, IP addresses, and cookie
              data as described in our <Link>Cookies Policy</Link>.
            </p>
          </Section>

          <Section id="data-use" title="How We Use Your Data">
            <p className="mb-4">
              We use your data to provide, maintain and improve the Platform;
              to personalize your experience; to process transactions; to send
              you technical notices and support messages; and to respond to your
              comments and questions.
            </p>
            <p className="mb-6">
              We may also use your data to send promotional communications,
              subject to your preferences, and to show you targeted advertising
              on behalf of third parties, as described in our{" "}
              <Link>Cookies Policy</Link>.
            </p>
          </Section>

          <Section id="data-sharing" title="How We Share Your Data">
            <p className="mb-4">
              We do not sell your personal data to third parties. We may share
              your data with service providers who assist us in operating the
              Platform, subject to confidentiality obligations. We may also
              share data when required by law or to protect the rights and safety
              of BeatZa, our users, or the public.
            </p>
            <p className="mb-6">
              Any content you upload and make public on the Platform will be
              accessible to other users and, where you have enabled sharing, to
              users of Linked Services.
            </p>
          </Section>

          <Section id="your-rights" title="Your Rights">
            <p className="mb-4">
              Depending on your location, you may have the right to access,
              correct, delete, or restrict the processing of your personal data.
              You may also have the right to data portability and the right to
              object to certain processing activities.
            </p>
            <p className="mb-6">
              To exercise any of these rights, please contact us at{" "}
              <Link>privacy@beitza.com</Link>. We will respond to your request
              within the timeframe required by applicable law.
            </p>
          </Section>

          <Section id="data-retention" title="Data Retention">
            <p className="mb-6">
              We retain your personal data for as long as your account is active
              or as needed to provide you with the Platform. If you close your
              account, we will delete or anonymize your data unless we are
              required to retain it by law or for legitimate business purposes
              such as resolving disputes or enforcing our agreements.
            </p>
          </Section>

          <Section id="contact" title="Contact Us">
            <p className="mb-6">
              If you have any questions about this Privacy Policy or our data
              practices, please contact our Data Protection team at{" "}
              <Link>privacy@beitza.com</Link>, or write to us at BeatZa Global
              Limited & Co. KG, Cairo, Egypt.
            </p>
          </Section>

          <p className="text-[#888888] text-xs">Last Amended: March 9, 2026</p>
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="w-[27.75%]">
        <LegalSidebar />
      </div>
    </div>
  );
}