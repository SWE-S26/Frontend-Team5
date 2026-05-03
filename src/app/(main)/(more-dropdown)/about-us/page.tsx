"use client";

import React from "react";
import LegalSidebar from "@/app/(main)/(more-dropdown)/legal/LegalSidebar";
const tocItems = [
  {
    id: "who-we-are",
    label: "Who We Are",
    desc: "Learn about BeatZa and our mission.",
  },
  {
    id: "our-story",
    label: "Our Story",
    desc: "How BeatZa came to be and where we are headed.",
  },
  {
    id: "what-we-offer",
    label: "What We Offer",
    desc: "The tools and features we provide for artists and listeners.",
  },
  {
    id: "for-artists",
    label: "For Artists",
    desc: "How BeatZa empowers artists to share and grow.",
  },
  {
    id: "for-listeners",
    label: "For Listeners",
    desc: "How BeatZa connects listeners with music they love.",
  },
  {
    id: "community",
    label: "Our Community",
    desc: "The people that make BeatZa what it is.",
  },
  {
    id: "contact",
    label: "Contact Us",
    desc: "How to get in touch with the BeatZa team.",
  },
];

export default function AboutUs() {
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
    <div className="flex justify-between bg-chinese-black text-white-smoke font-sans px-4 sm:px-0">
      {/* MAIN CONTENT */}
      <div className="w-full md:w-[68%]">
        <main className="flex-1 max-w-3xl text-[14px] leading-relaxed text-white-smoke">
          <h1 className="text-3xl font-bold text-white-smoke mb-6">About BeatZa</h1>

          <p className="mb-4">
            BeatZa is a music streaming and sharing platform built for artists and listeners alike.
            Our mission is simple — to give every artist a place to be heard, and every listener a
            place to discover music that moves them.
          </p>

          <p className="mb-3">On this page you can learn more about:</p>

          {/* TABLE OF CONTENTS */}
          <nav aria-label="Table of contents">
            <ul className="list-disc pl-6 mb-8 space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-[#044DD2] hover:underline">
                    {item.label}
                  </a>{" "}
                  {item.desc}
                </li>
              ))}
            </ul>
          </nav>

          {/* SECTIONS */}

          <Section id="who-we-are" title="Who We Are">
            <p className="mb-6">
              BeatZa is a music platform built by creators, for creators. We are a team of music
              lovers, engineers, and dreamers based in Cairo, Egypt, driven by a belief that music
              is a universal language — and that everyone deserves a platform to share it. Whether
              you are an emerging bedroom producer or an established artist, BeatZa is your home.
            </p>
          </Section>

          <Section id="our-story" title="Our Story">
            <p className="mb-4">
              BeatZa started with a simple question: why is it so hard for independent artists in
              our region to get heard? The major platforms were built for the mainstream. We built
              BeatZa for everyone else.
            </p>
            <p className="mb-4">
              From a small team working out of Cairo, we set out to create a platform that would
              give independent artists the tools they need to upload, share, and grow — without
              giving up creative control or a cut of their earnings.
            </p>
            <p className="mb-6">
              Today, BeatZa is home to thousands of artists and listeners, and we are just getting
              started. Our roadmap is full of features designed to bring artists and fans closer
              together, and we build every one of them with our community in mind.
            </p>
          </Section>

          <Section id="what-we-offer" title="What We Offer">
            <p className="mb-4">
              BeatZa is more than just a place to upload music. It is a full platform for sharing,
              discovering, and monetizing music. Here is what you get:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong className="text-white-smoke">Upload and share</strong> — Upload your tracks
                and share them with the world instantly.
              </li>
              <li>
                <strong className="text-white-smoke">Stream and discover</strong> — Listen to music
                from artists around the world, curated just for you.
              </li>
              <li>
                <strong className="text-white-smoke">Audience insights</strong> — Know who is
                listening, where they are from, and what they love about your music.
              </li>
              <li>
                <strong className="text-white-smoke">Distribution</strong> — Get your music on
                Spotify, Apple Music, TikTok, and 60+ other platforms directly from BeatZa.
              </li>
              <li>
                <strong className="text-white-smoke">Monetization</strong> — Earn royalties from
                streams and keep 100% of your earnings.
              </li>
              <li>
                <strong className="text-white-smoke">Artist Pro</strong> — Unlock advanced tools
                including unlimited uploads, track promotion, fan playlisting, and more.
              </li>
            </ul>
          </Section>

          <Section id="for-artists" title="For Artists">
            <p className="mb-4">
              BeatZa is built with artists at the center. We give you the tools to upload your
              music, build your audience, and get paid — all in one place.
            </p>
            <p className="mb-4">
              With a free account you can upload tracks, build a public profile, and connect with
              listeners. With Artist Pro, you unlock the full power of the platform — including
              unlimited uploads, advanced stats, track promotion, distribution to 60+ platforms, and
              partner savings from leading music industry services.
            </p>
            <p className="mb-6">
              We believe artists should own their music and their earnings. That is why we never
              take a cut of your royalties. What you earn is yours.
            </p>
          </Section>

          <Section id="for-listeners" title="For Listeners">
            <p className="mb-4">
              BeatZa is where you discover music before it goes mainstream. Our platform is home to
              independent artists across every genre — from hip-hop and R&B to electronic, folk,
              jazz, and everything in between.
            </p>
            <p className="mb-4">
              Stream tracks directly from artists, follow your favorites, leave comments on the
              moments that hit hardest, and share the music you love with the people in your life.
            </p>
            <p className="mb-6">
              Every listen on BeatZa goes directly to supporting the artists who made the music.
              When you listen here, it counts.
            </p>
          </Section>

          <Section id="community" title="Our Community">
            <p className="mb-4">
              The BeatZa community is what makes this platform special. It is made up of artists who
              pour their hearts into their craft, and listeners who genuinely care about finding new
              music and supporting the people who make it.
            </p>
            <p className="mb-4">
              We take our community seriously. Our guidelines exist to keep BeatZa a safe, creative,
              and respectful space for everyone. We do not tolerate harassment, hate speech, or any
              form of abuse — and we empower our community to report content that violates those
              standards.
            </p>
            <p className="mb-6">
              If you ever have feedback, ideas, or just want to tell us what you love or what we
              could do better — we are always listening.
            </p>
          </Section>

          <Section id="contact" title="Contact Us">
            <p className="mb-4">
              Have a question, a partnership idea, or just want to say hello? We would love to hear
              from you.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong className="text-white-smoke">General inquiries:</strong>{" "}
                <span className="text-[#044DD2]">hello@beatza.me</span>
              </li>
              <li>
                <strong className="text-white-smoke">Artist support:</strong>{" "}
                <span className="text-[#044DD2]">artists@beatza.me</span>
              </li>
              <li>
                <strong className="text-white-smoke">Copyright and legal:</strong>{" "}
                <span className="text-[#044DD2]">copyright@beatza.me</span>
              </li>
              <li>
                <strong className="text-white-smoke">Press and partnerships:</strong>{" "}
                <span className="text-[#044DD2]">press@beatza.me</span>
              </li>
            </ul>
            <p className="mb-10">
              You can also reach us through the Help Centre, where our support team is available to
              assist you with any issues or questions you may have.
            </p>
          </Section>

          <p className="text-[#888888] text-xs">Last Updated: April 2026</p>
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="hidden md:block md:w-[27.75%]">
        <LegalSidebar />
      </div>
    </div>
  );
}
