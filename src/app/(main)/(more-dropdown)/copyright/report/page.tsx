"use client";

import React from "react";
import LegalSidebar from "@/app/(main)/(more-dropdown)/shared/LegalSidebar";
import { useRouter } from "next/navigation";

export default function ReportCopyright() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-chinese-black text-white-smoke font-sans">
      <div className="max-w-7xl mx-auto pr-8 py-2 flex gap-28">

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-3xl text-[14px] leading-relaxed text-white-smoke">
          <h1 className="text-3xl font-bold text-white-smoke mb-4">
            Report Copyright Infringement
          </h1>

          <p className="mb-4">
            If you identify any tracks on BeatZa that you believe infringe your
            copyright, you can let us know using any of the methods explained on
            these pages. Before making a report concerning any possible copyright
            infringement, please consider the following:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-3">
            <li>
              <strong className="text-white-smoke">
                These pages relate to notices concerning copyright infringement only.
              </strong>{" "}
              If you wish to make a report concerning infringement of any other
              rights, please email us at{" "}
              <span className="text-[#044DD2] cursor-pointer hover:underline">
                legal@beatza.com
              </span>
            </li>
            <li>
              <strong className="text-white-smoke">
                Please only report infringement of your own copyright, or the
                copyright of someone you are authorized to represent.
              </strong>{" "}
              If you believe that someone else&apos;s copyright is being infringed,
              please tell them and direct them to this page.
            </li>
            <li>
              <strong className="text-white-smoke">
                Please do not report copyright infringement unless you have a
                genuine claim.
              </strong>{" "}
              If you make groundless or malicious reports of copyright
              infringement, you risk having your account suspended or terminated.
              You may also be liable for damages (including costs and legal fees)
              incurred by BeatZa, the person whose tracks you report and/or any
              copyright owner or authorized licensee, as the result of tracks
              being removed in reliance on your notice.
            </li>
            <li>
              <strong className="text-white-smoke">Please provide detail.</strong>{" "}
              The more information we have regarding your claim, the quicker we
              can process your notice.
            </li>
          </ul>

          <p className="mb-8">
            There are various ways in which you can report copyright infringement
            on BeatZa.
          </p>

          {/* Using our webform */}
          <section className="mb-8">
            <h2 className="text-white-smoke text-2xl font-bold mb-3">
              Using our webform
            </h2>
            <p className="mb-2">You can file a report using this webform.</p>
            <span onClick={() => router.push("/copyright/report/form")} className="text-[#044DD2] cursor-pointer hover:underline">
              Report Copyright Infringement
            </span>
          </section>

          {/* Using the report button */}
          <section className="mb-8">
            <h2 className="text-white-smoke text-2xl font-bold mb-3">
              Using the report button
            </h2>
            <p className="mb-4">
              Each track page has a button entitled &quot;Report&quot;, which you can use
              to report the tracks on that page. The button is located on the
              left side of the track page under the name of the user who
              uploaded it:
            </p>

            {/* Mock report dialog image placeholder */}
            <div className="bg-white rounded-md p-5 mb-4 text-black text-[13px] max-w-sm">
              <p className="font-semibold mb-2 text-gray-800">Report track for</p>
              <ul className="space-y-1">
                {[
                  "Copyright infringement",
                  "Privacy violation",
                  "Pornographic content",
                  "Abuse",
                  "Hate speech",
                  "Illegal content",
                  "Other",
                ].map((item) => (
                  <li key={item} className="text-[#044DD2] cursor-pointer hover:underline">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-semibold text-gray-800">Disclaimer:</p>
              <p className="text-gray-600 text-[12px]">
                Reported tracks are reviewed by a specialist team who take action
                if the content violates our Guidelines or Terms. Repeat violation
                or serious breaches can result in the permanent deletion of
                accounts.
              </p>
            </div>

            <p className="mb-4">
              However, if you would prefer to send your own notification, please
              do so in writing, making sure that you include the following
              information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                your full name, address and telephone number, a valid email
                address at which you can be contacted, and your BeatZa username
                if you have one;
              </li>
            </ul>
          </section>

          {/* By writing to us */}
          <section className="mb-8">
            <h2 className="text-white-smoke text-2xl font-bold mb-3">
              By writing to us
            </h2>
            <p className="mb-4">
              The report button and the webform are the most efficient means of
              reporting possible copyright infringement. However, if you would
              prefer to send your own notification, please do so in writing,
              making sure that you include the following information:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                a <strong className="text-white-smoke">statement</strong> that you
                have identified tracks on BeatZa which infringe your copyright or
                the copyright of a third party on whose behalf you are entitled
                to act;
              </li>
              <li>
                a{" "}
                <strong className="text-white-smoke">
                  description of the copyright
                </strong>{" "}
                work(s) that you claim have been infringed;
              </li>
              <li>
                a{" "}
                <strong className="text-white-smoke">
                  description of the sound(s)
                </strong>{" "}
                that you claim are infringing and the BeatZa URL(s) where such
                tracks can be located;
              </li>
              <li>
                your full name, address and telephone number, a valid email
                address at which you can be contacted, and your BeatZa username
                if you have one;
              </li>
              <li>
                a statement by you that you have a{" "}
                <strong className="text-white-smoke">good faith belief</strong>{" "}
                that the disputed use of the material is not authorized by the
                copyright owner, its agent, or the law;
              </li>
              <li>
                a statement by you that the{" "}
                <strong className="text-white-smoke">
                  information in your notice is accurate
                </strong>{" "}
                and that you are authorized to act on behalf of the owner of the
                exclusive right that is allegedly infringed;
              </li>
            </ul>

            <p className="mb-4">
              In addition, if you wish for your notice to be considered as a
              notice pursuant to the United States Digital Millennium Copyright
              Act 17 U.S.C. §512(c), please also include the following:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                with respect to your statement that you are authorized to act on
                behalf of the owner of the exclusive right that is allegedly
                infringed, confirmation that such statement is made under penalty
                of perjury; and
              </li>
              <li>
                your electronic or physical signature (which may be a scanned
                copy).
              </li>
            </ul>

            <p className="mb-2">
              Your notice should be sent to us by email to{" "}
              <span className="text-[#044DD2] cursor-pointer hover:underline">
                copyright@beatza.com
              </span>{" "}
              and/or by mail to the following address:
            </p>
            <p className="mb-6">
              BeatZa Global Limited &amp; Co. KG Karl-Marx-Strasse 101 12043 Berlin
              Germany Attn: Copyright Team
            </p>

            <p className="mb-2">
              If you wish for your notice to be considered as a notice pursuant
              to the United States Digital Millennium Copyright Act 17 U.S.C.
              §512(c), your notice should be sent to BeatZa&apos;s designated
              copyright agent by email to{" "}
              <span className="text-[#044DD2] cursor-pointer hover:underline">
                copyrightagent@beatza.com
              </span>{" "}
              and/or by mail to the following address:
            </p>
            <p className="mb-8">
              BeatZa Operations, Inc. 2 Gansevoort Street, 6th Floor New York,
              NY 10014 Attn: Copyright Agent
            </p>

            <p className="mb-4">
              <strong className="text-white-smoke">Last Amended:</strong> January
              19, 2026
            </p>

            <div>
              <h3 className="text-white-smoke font-bold mb-2">
                Link to prior versions
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                {["June 2021", "April 2021", "December 2020", "March 2019"].map(
                  (v) => (
                    <li key={v}>
                      <span className="text-[#044DD2] cursor-pointer hover:underline">
                        {v}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </section>
        </main>

        {/* RIGHT COLUMN */}
        <div className="w-64 shrink-0">
          {/* Learn More Card */}
          <div className="bg-off-black w-80 p-5 mb-8">
            <h3 className="text-white-smoke font-bold text-base mb-3">
              Learn About Copyright
            </h3>
            <p className="text-silver text-[13px] mb-4">
              BeatZa is a platform for creators and we expect all BeatZa users
              to respect other people&apos;s copyright.
            </p>
            <button
              onClick={() => router.push("/copyright")}
              className="w-30 bg-chinese-black text-white-smoke cursor-pointer text-[14px] font-semibold py-2 px-2 rounded hover:opacity-90 transition-colors"
            >
              Learn more...
            </button>
          </div>

          {/* Legal Sidebar */}
          <LegalSidebar />
        </div>
      </div>
    </div>
  );
}