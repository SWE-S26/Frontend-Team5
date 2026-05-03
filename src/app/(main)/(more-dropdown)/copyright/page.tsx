"use client";

import React from "react";
import LegalSidebar from "@/app/(main)/(more-dropdown)/legal/LegalSidebar";
import { useRouter } from "next/navigation";

export default function Copyright() {
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
    <section id={id} className="scroll-mt-24 mb-8">
      <h2 className="text-white-smoke text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );

  const router = useRouter();

  return (
    <div className="flex justify-between mx-auto bg-chinese-black text-white-smoke px-4 sm:px-0">
      {/* MAIN CONTENT */}
      <div className="w-full md:w-[68%]">
        <main className="flex-1 max-w-3xl text-sm leading-relaxed text-white-smoke">
          <h1 className="text-3xl font-bold text-white-smoke mb-4">Learn about Copyright</h1>

          <p className="mb-4">
            BeatZa is a platform for creators and we expect all BeatZa users to respect other
            people's copyright.
          </p>

          {/* TOC */}
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>
              <a href="#what-is-copyright" className="text-[#044DD2] hover:underline">
                What is copyright?
              </a>
            </li>
            <li>
              <a href="#infringement" className="text-[#044DD2] hover:underline">
                What is copyright infringement and how can I avoid it?
              </a>
            </li>
            <li>
              <a href="#checklist" className="text-[#044DD2] hover:underline">
                Copyright Checklist
              </a>
            </li>
            <li>
              <a href="#resources" className="text-[#044DD2] hover:underline">
                Further resources
              </a>
            </li>
          </ul>

          <p className="mb-10">
            <strong className="text-white-smoke">Please note:</strong> This page provides some basic
            information about copyright. However, nothing on this page constitutes legal advice –
            please do not treat it as legal advice or as a substitute for legal advice. Please
            consult a suitably qualified lawyer on any matters related to copyright.
          </p>

          <Section id="what-is-copyright" title="What is copyright?">
            <p className="mb-4">
              "Copyright" is the term used to describe a number of legal rights that exist in
              original literary, musical, dramatic or artistic works, and in sound recordings,
              films, broadcasts and other creative works. Under copyright laws, these rights are
              exclusive to the copyright owner, and enable the copyright owner to control how their
              work is used and to prevent unauthorised use.
            </p>
            <p className="mb-4">
              Originally, copyright laws allowed the creator of a work to prevent that work from
              being copied, but copyright laws have gradually been extended over time, and now allow
              copyright owners to prevent and control things like adaptation or public performance
              of the copyright work, inclusion of the work in a broadcast, or distribution of the
              work both physically and on the Internet. Because these rights are exclusive to the
              copyright owner, anyone wanting to do any of these things needs the permission of the
              copyright owner.
            </p>
            <p className="mb-4">
              Copyright can exist in all sorts of things - for example, music, lyrics, photographs,
              artwork, books, speeches, TV programmes and movies. Also, what might appear to be a
              single work can include several different copyrights owned by various different
              people. For example, a music track by a signed artist will often include separate
              copyrights in the composition, the lyrics, and the sound recording. Copyright in the
              music and lyrics will usually be owned by the artist or music publishing company, and
              copyright in the sound recording will usually be owned by the artist's record label.
              Use of that track, including any adaptation of the track or any uploading or sharing
              over the Internet, will require the permission of all of these copyright owners,
              either directly or through their representatives (for example, through a collecting
              society or performing rights organisation).
            </p>
          </Section>

          <Section
            id="infringement"
            title="What is copyright infringement, and how can I avoid it?"
          >
            <p className="mb-4">
              Because the rights afforded by copyright law are exclusive to the copyright owner(s),
              you will infringe copyright if you do any of those things without the permission of
              the copyright owner(s) - for example, if you copy or adapt a copyright work, or make
              it available on the Internet.
            </p>
            <p className="mb-4">
              The best way to avoid copyright infringement is to ensure that you don't use anything
              created by anyone else. Simple as that.
            </p>
            <p className="mb-4">
              If you do use someone else's work, make sure you have the necessary permissions – this
              will usually take the form of a licence from the copyright owner(s), which you may
              have to pay for. There are certain instances where you may be able to use excerpts of
              copyrighted material without a licence – for example, if you use a small part of
              someone else's work for the purposes of criticism or review, or if your use
              constitutes "fair use" under applicable law (particularly U.S. law) – however,
              discussion of these exceptions is beyond the scope of this guidance. If you intend to
              use any part of a copyright work in reliance on any of the statutory exceptions, you
              should seek legal advice first.
            </p>
          </Section>

          <Section id="checklist" title="Copyright checklist">
            <p className="mb-4">
              Copyright is complicated. If you have any doubt regarding the extent of your rights in
              any sounds, you should consult with a suitably qualified lawyer before uploading
              anything to BeatZa or making any claims or counter-claims regarding your rights.
              However, as a general guide, here are some of the issues you might want to consider
              before uploading anything to BeatZa:
            </p>

            <p className="text-white-smoke font-semibold mb-2">For music uploads:</p>
            <p className="mb-2">
              Can you answer <strong className="text-white-smoke">"yes"</strong> to all of the
              following questions?
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Did you compose the music yourself?</li>
              <li>Did you write the lyrics yourself?</li>
              <li>
                Did you record and produce the track yourself or do you have permission from the
                producer or record label that made the recording?
              </li>
              <li>
                Do you have written permission from all copyright owners to use any samples
                contained in the track?
              </li>
            </ul>

            <p className="mb-2">
              Can you answer <strong className="text-white-smoke">"no"</strong> to all of the
              following questions?
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-1">
              <li>Were you signed to a record label when you recorded the track?</li>
              <li>Do you have a publishing deal?</li>
              <li>Are you a member of a performing rights organization or collecting society?</li>
              <li>Have you licensed your track to anyone else?</li>
              <li>
                Does the track contain the entirety or any part of someone else's song(s)? Is it
                based on someone else's song(s)?
              </li>
            </ul>

            <p className="text-white-smoke font-semibold mb-2">
              For other sounds, including field recordings, podcasts, audiobooks or voice messages:
            </p>
            <p className="mb-2">
              Can you answer <strong className="text-white-smoke">"yes"</strong> to all of the
              following questions?
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                Is the recording spontaneous, as opposed to being recited from a script, play or
                book (other than one written by you)?
              </li>
              <li>Is it a recording of your performance?</li>
              <li>Did you make the recording yourself?</li>
              <li>
                Do you have the permission of anyone else appearing in the recording to upload and
                share the recording on BeatZa?
              </li>
            </ul>

            <p className="mb-2">
              Can you answer <strong className="text-white-smoke">"no"</strong> to all of the
              following questions?
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                Is the recording rehearsed or recited from a script, play or book (other than one
                written by you)?
              </li>
              <li>
                Does the recording contain any music or excerpts from other copyright works (e.g.
                movie dialogue)?
              </li>
            </ul>
          </Section>

          <Section id="resources" title="Further resources">
            <p className="mb-2">
              For information about copyright in your country, try your local copyright office:{" "}
              <Link>http://www.wipo.int/directory/en/urls.jsp</Link>
            </p>
            <p>
              For information on copyright laws around the world, try the World Intellectual
              Property Office database: <Link>http://www.wipo.int/wipolex/en/</Link>
            </p>
          </Section>
        </main>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden md:block md:w-[27.75%] shrink-0">
        {/* Report Card */}
        <div className="bg-off-black w-full p-5 mb-8">
          <h3 className="text-white-smoke font-bold text-base mb-3">
            Report Copyright Infringement
          </h3>
          <p className="text-silver text-[13px] mb-4">
            If you identify content on BeatZa that you believe infringes your copyright, you can let
            us know using any of the methods explained on these pages.
          </p>
          <button
            onClick={() => router.push("/copyright/report")}
            className="w-56 bg-chinese-black text-white-smoke cursor-pointer text-[14px] font-semibold py-2 px-2 rounded hover:opacity-90 transition-colors"
          >
            Report Copyright Infringement
          </button>
        </div>

        {/* Legal Sidebar */}
        <LegalSidebar />
      </div>
    </div>
  );
}
