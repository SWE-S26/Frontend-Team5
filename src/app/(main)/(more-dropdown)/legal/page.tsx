"use client";

import React from "react";
import LegalSidebar from "@/app/(main)/(more-dropdown)/shared/LegalSidebar";

export default function Legal() {
  const tocItems = [
    {
      id: "acceptance",
      label: "Acceptance of Terms of Use",
      desc: "By using the Platform you accept our Terms of Use and Community Guidelines and agree to abide by them.",
    },
    {
      id: "changes",
      label: "Changes to Terms of Use",
      desc: "This section explains that our Terms of Use may change from time to time.",
    },
    {
      id: "description",
      label: "Description of the Platform",
      desc: "This provides a general description of the Platform, its features and functionality.",
    },
    {
      id: "account",
      label: "Your BeatZa Account",
      desc: "This section explains your responsibilities should you choose to register for a BeatZa account.",
    },
    {
      id: "use",
      label: "Your Use of the Platform",
      desc: "This section sets out your right to use the Platform.",
    },
    {
      id: "content",
      label: "Your Content",
      desc: "This section deals with ownership of your Content.",
    },
    {
      id: "license",
      label: "Grant of License",
      desc: "This section explains how your Content will be used on BeatZa.",
    },
    {
      id: "warranties",
      label: "Representations and Warranties",
      desc: "This section includes important promises and guarantees.",
    },
    {
      id: "liability",
      label: "Liability for Content",
      desc: "BeatZa is a hosting service and users are liable for their content.",
    },
    {
      id: "reporting",
      label: "Reporting Infringements",
      desc: "Explains how to notify us of copyright infringement.",
    },
  ];

  const Link = ({ children }: { children: React.ReactNode }) => (
    <span className="cursor-pointer text-[#699FFF] hover:underline transition-colors">
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
      <h2 className="text-white text-xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans">
      <div className="max-w-7xl mx-auto px-8 py-3 flex gap-24">
        {/* MAIN CONTENT */}

        <main className="flex-1 max-w-3xl text-[14px] leading-relaxed text-white-smoke">
          <h1 className="text-3xl font-bold text-white mb-6">
            BeatZa Terms of Use
          </h1>

          <p className="mb-4">
            Welcome to BeatZa®, a service provided by BeatZa Global Limited &
            Co. KG, a company incorporated under the laws of Egypt and with its
            main place of business at Cairo, Egypt (<strong className="text-white">"BeatZa"</strong>, 
            <strong className="text-white">"we"</strong>, <strong className="text-white">"our"</strong>, or
            <strong className="text-white">"us"</strong>).
          </p>

          <p className="mb-4">
            These Terms of Use govern your use of beitza.com (together, the{" "}
            <strong className="text-white">"Website"</strong>), our mobile and
            desktop apps (our <strong className="text-white">"Apps"</strong>)
            and all related players, widgets, tools, features, applications,
            data, software, APIs (which are also subject to separate API Terms
            of Use) and other services provided by BeatZa (the{" "}
            <strong className="text-white">"Services"</strong>).
          </p>

          <p className="mb-4">
            These Terms of Use, together with our Community Guidelines,
            Moderation and Enforcement Policy and any other terms specifically
            referred to in any of those documents, all of which are incorporated
            by reference into these Terms of Use, constitute a legally binding
            contract (the <strong className="text-white">"Agreement"</strong>),
            between the user (<strong className="text-white">"you"</strong>,{" "}
            <strong className="text-white">"your"</strong>) and BeatZa in
            relation to your use of the Website, Apps and Services (together,
            the <strong className="text-white">"Platform"</strong>).
          </p>

          <p className="mb-4">
            Please also review our <Link>Privacy Policy</Link> and{" "}
            <Link>Cookies Policy</Link> for more information on how we collect
            and use data relating to the use and performance of the Platform, as
            well as our responsibilities and your rights in relation to any
            processing of your personal data. Notwithstanding anything to the
            contrary in this Agreement, our Privacy Policy and Cookies Policy
            are not contracts and do not form part of this Agreement.
          </p>

          <p className="mb-3">
            These Terms of Use consist of the following sections:
          </p>

          {/* TABLE OF CONTENTS */}

          <nav aria-label="Table of contents">
            <ul className="list-disc pl-6 mb-8 space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[#699FFF] hover:underline"
                  >
                    {item.label}
                  </a>{" "}
                  {item.desc}
                </li>
              ))}
            </ul>
          </nav>

          {/* SECTIONS */}

          <Section id="acceptance" title="Acceptance of Terms of Use">
            <p className="mb-6">
              Please read these Terms of Use, Privacy Policy, Cookies Policy and
              Community Guidelines very carefully. If you do not agree to any of
              the provisions set out in those documents, you should not use the
              Platform. By accessing or using the Platform, registering an
              account, or by viewing, accessing, streaming, uploading or
              downloading any information or content from or to the Platform,
              you represent and warrant that you have read and understood these
              Terms of Use and Community Guidelines, will abide by them, and
              that you are either 18 years of age or more, or the applicable age
              of majority in your jurisdiction.
            </p>
          </Section>

          <Section id="changes" title="Changes to Terms of Use">
            <p className="mb-4">
              We reserve the right to change, alter, replace, or otherwise
              modify these Terms of Use at any time, for example to address
              legal or regulatory changes or changes to features or
              functionality made available through the Platform, at our sole
              discretion. The date of last modification is stated at the end of
              these Terms of Use. It is your responsibility to check this page
              from time to time for updates.
            </p>
            <p className="mb-4">
              When we make any significant changes to these Terms of Use, we
              will provide you with prominent notice under the circumstances,
              including for example displaying a notice within the Platform
              and/or by sending you an email to the email address that you have
              provided us or a message to your BeatZa account, and the revised
              Terms of Use will become effective two (2) weeks after such
              notification.
            </p>
            <p className="mb-6">
              You will have no obligation to continue using the Platform
              following any such notification, but if you do not terminate your
              account as described in the Termination section below during such
              two (2) week period, your continued use of the Platform after the
              end of that two (2) week period will constitute your acceptance of
              the revised Terms of Use.
            </p>
          </Section>

          <Section id="description" title="Description of the Platform">
            <p className="mb-4">
              The Platform is a music service. Registered users of the Platform
              may submit, upload and post audio, text, photos, pictures,
              graphics, comments, and other content, data or information
              ("Content"), which will be stored by BeatZa at the direction of
              such registered users, and may be shared and distributed by such
              registered users, and other users of the Platform, using the tools
              and features provided as part of the Platform's functions and as
              made available on the Platform. The Platform also enables
              registered users to interact with one another in open (i.e.
              publicly accessible) as well as private conversations (i.e.
              one-to-one messages) ("Platform Communications") and to contribute
              to discussions, and enables any user of the Platform to view,
              listen to and share Content uploaded and made available by
              registered users.
            </p>
            <p className="mb-4">
              The Platform also includes social and interactive features that
              enable users to engage with and learn from the BeatZa community in
              order to build connections with other users and ensure you get the
              content that interests you most. For example, users who upload
              Content to BeatZa will gain access to our Fan Insights feature,
              which provides creators with insights into how the Content they
              upload fares among users, including which users are top listeners
              and downloaders of such Content.
            </p>
            <p className="mb-4">
              Some features of our Platform are only available to registered
              users who subscribe to a certain Service (see Subscriptions
              below). BeatZa however remains free for users that choose not to
              subscribe to such Services. In order to make the Platform
              available for free and provide you with personally relevant
              features, we serve tailored ads on the Platform on behalf of third
              party advertisers. More information on how we use data to show you
              personalized ads is described in our Privacy Policy.
            </p>
            <p className="mb-6">
              We may, from time to time, release new tools and resources on the
              Website, release new versions of our Apps, or introduce other
              services and/or features for the Platform. Any new services and
              features will be subject to these Terms of Use as well as any
              additional terms and conditions that we may release for those
              specific services or features.
            </p>
          </Section>

          <Section id="account" title="Your BeatZa Account">
            <p className="mb-4">
              You are not obliged to register to use the Platform. However,
              access to the Apps and certain Services is only available to
              registered users. In order for you to engage with other BeatZa
              fans and creators, we enable you to create and personalize a
              public profile on BeatZa. To enable you to do that, you must
              provide us with the information you want to display on such a
              profile.
            </p>
            <p className="mb-4">
              When you register to use the Platform, you will provide us with
              your email address, and will choose a username and password for
              your account. You must ensure that the email address that you
              provide is, and remains, valid. Your email address and any other
              information you chose to provide about yourself will be treated in
              accordance with our Privacy Policy.
            </p>
            <p className="mb-4">
              You are solely responsible for maintaining the confidentiality and
              security of your authentication credentials (e.g., your password),
              and you will remain responsible for all use of your authentication
              credentials, and all activity emanating from your account, whether
              or not such activity was authorized by you.
            </p>
            <p className="mb-4">
              If your authentication credentials are lost or stolen, or if you
              believe that your account has been accessed by unauthorized third
              parties, you are advised to notify BeatZa in writing, and should
              change your password at the earliest possible opportunity.
            </p>
            <p className="mb-6">
              We reserve the right to disallow, cancel, remove or reassign
              certain usernames and permalinks in appropriate circumstances, as
              determined by us in our sole discretion, and may, with or without
              prior notice, suspend or terminate your account if activities
              occur on that account which, in our sole discretion, would or
              might constitute a violation of these Terms of Use or our
              Community Guidelines, or an infringement or violation of the
              rights of any third party, or of any applicable laws or
              regulations.
            </p>
          </Section>

          <Section id="use" title="Your Use of the Platform">
            <p className="mb-4">
              Subject to your strict compliance with these Terms of Use and our
              Community Guidelines at any and all times during your use of the
              Platform, BeatZa grants you a limited, personal, non-exclusive,
              revocable, non-assignable and non-transferable right and license
              to use the Platform in order to view Content uploaded and posted
              to the Platform; to listen to audio Content streamed from the
              Platform or offline; and to share and interact with Content on the
              Platform.
            </p>
            <p className="mb-2">
              The above licenses are conditional upon your strict compliance
              with these Terms of Use and our Community Guidelines at any and
              all times during your use of the Platform, including, without
              limitation, the following:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                You must not copy, rip or capture, or attempt to copy, rip or
                capture, any Content from the Platform or any part of the
                Platform, other than by means of download or store for offline
                listening in circumstances where the relevant Uploader has
                elected to permit downloads or offline listening of the relevant
                item of Content.
              </li>
              <li>
                You must not adapt, copy, republish, make available or otherwise
                communicate to the public, display, perform, transfer, share,
                distribute or otherwise use or exploit any Content on or from
                the Platform, except as permitted under these Terms of Use and
                within the parameters set by the Uploader.
              </li>
              <li>
                You must not employ scraping or similar techniques to aggregate,
                repurpose, republish or otherwise make use of any Content.
              </li>
              <li>
                You must not employ any techniques or make use of any services,
                automated or otherwise, designed to misrepresent the popularity
                of your Content or the content of other users on the Platform,
                including without limitation by the use of bots, botnets,
                scripts, apps, plugins, or extensions.
              </li>
              <li>
                You must not use the Platform to upload, post, store, transmit,
                display or otherwise communicate hate speech, terrorist or
                extremist content, violence, abuse, self-harm or harassment,
                nudity or pornography, or child sexual abuse or grooming
                material.
              </li>
              <li>
                You must not deliberately impersonate any person or entity or
                otherwise misrepresent your affiliation with a person or entity,
                including using the output of generative artificial intelligence
                to impersonate voices or likenesses without authorization.
              </li>
              <li>
                You must not sell or transfer, or offer to sell or transfer, any
                BeatZa account to any third party without the prior written
                approval of BeatZa.
              </li>
              <li>
                You must not collect or attempt to collect personal data, or any
                other kind of information about other users, including without
                limitation, through spidering or any form of scraping.
              </li>
              <li>
                You must not violate, circumvent or attempt to violate or
                circumvent any data security measures employed by BeatZa or any
                Uploader, or attempt to interfere with the Website or the
                Services by any means including hacking, submitting a virus,
                overloading, mail-bombing or crashing.
              </li>
            </ul>
          </Section>

          <Section id="content" title="Your Content">
            <p className="mb-4">
              Any and all Content is uploaded, owned and controlled solely by
              you, and not by BeatZa. BeatZa does not claim any ownership rights
              in your Content, and your Content remains your sole
              responsibility.
            </p>
            <p className="mb-4">
              Without prejudice to the conditions set forth in Your Use of the
              Platform you must not upload, store, distribute, send, transmit,
              display, perform, make available, continue to make available or
              otherwise communicate to the public any Content to which you do
              not hold the necessary rights. In particular, any unauthorized use
              of copyright protected works within your Content may constitute an
              infringement of third party rights and is strictly prohibited. Any
              such infringements may result in termination of your access to the
              Platform as described in the Moderation and Enforcement Policy,
              and may also result in civil litigation or criminal prosecution by
              or on behalf of the relevant rightsholder.
            </p>
            <p className="mb-6">
              We may, from time to time, invite or provide you with means to
              provide feedback regarding the Platform, and in such
              circumstances, any feedback you provide will be deemed
              non-confidential and BeatZa shall have the right, but not the
              obligation, to use such feedback on an unrestricted basis.
            </p>
          </Section>

          <Section id="license" title="Grant of License">
            <p className="mb-4">
              By uploading or posting your Content to the Platform, you initiate
              an automated process to transcode any audio Content and direct
              BeatZa to store your Content on our servers, from where you may
              control and authorize the use, ways of reproduction, transmission,
              distribution, public display, public performance, making available
              (including whether users will be permitted to listen to your
              Content offline) and other communication to the public of your
              Content on the Platform and elsewhere using the Services.
            </p>
            <p className="mb-4">
              To the extent it is necessary in order for BeatZa to provide you
              with any of the aforementioned hosting services, to make Content
              available pursuant to Platform features and user-directed
              activities, to undertake any of the tasks set forth in these Terms
              of Use, including the distribution of advertising or other
              promotional material on our Platform and/or to enable your use of
              the Platform and its features, you hereby grant such licenses to
              BeatZa on a limited, worldwide, non-exclusive, royalty-free and
              fully paid basis.
            </p>
            <p className="mb-4">
              By uploading your Content to the Platform, you also grant a
              limited, worldwide, non-exclusive, royalty-free, fully paid up
              license to other users of the Platform, and to operators and users
              of any other websites, apps and/or platforms to which your Content
              has been shared or embedded using the Services ("Linked
              Services"), to copy, listen to offline, repost, transmit or
              otherwise distribute, publicly display, publicly perform, adapt,
              prepare derivative works of, compile, make available, communicate
              to the public and otherwise use your Content utilizing the
              features of the Platform from time to time and within the
              parameters set by you using the Services.
            </p>
            <p className="mb-4">
              We will not use your content to train generative AI models that
              aim to replicate or synthesize your voice, music, or likeness
              without your explicit consent, which must be affirmatively
              provided through an opt-in mechanism.
            </p>
            <p className="mb-6">
              The licenses granted in this section are granted separately with
              respect to each item of your Content that you upload to the
              Platform. Licenses with respect to audio Content, and any images
              or text within your account, will terminate automatically when you
              remove such Content from your account. Licenses with respect to
              comments or other contributions that you make on the Platform will
              be perpetual and irrevocable, and will continue notwithstanding
              any termination of your account.
            </p>
          </Section>

          <Section id="warranties" title="Representations and Warranties">
            <p className="mb-4">
              You hereby represent and warrant to BeatZa as follows:
            </p>
            <p className="mb-4">
              (i) your Content, and each and every part thereof, is an original
              work by you, or you have obtained all rights, licenses, consents
              and permissions necessary in order to use at any and all times
              during any applicable use, and (if and where relevant) to
              authorize BeatZa to use, your Content pursuant to these Terms of
              Use, including, without limitation, the right to upload,
              reproduce, store, transmit, distribute, share, publicly display,
              publicly perform, make available and otherwise communicate to the
              public your Content, on, through or via the Platform, any and all
              Services and any Linked Services.
            </p>
            <p className="mb-4">
              (ii) your Content and the availability thereof on the Platform
              does not and will not infringe or violate the rights of any third
              party, including, without limitation, any intellectual property
              rights, performers' rights, rights of privacy or publicity, or
              rights in confidential information.
            </p>
            <p className="mb-4">
              (iii) You have obtained any and all necessary consents,
              permissions and/or releases from any and all persons appearing in
              your Content in order to include their name, voice, performance or
              likeness in your Content and to publish the same on the Platform
              and via any Linked Services.
            </p>
            <p className="mb-4">
              (iv) your Content, including any comments that you may post on the
              Platform, will comply with all of the requirements set out in the
              section 'Your use of the Platform' above, and will not contain any
              content prohibited by these Terms of Use.
            </p>
            <p className="mb-6">
              (v) your Content does not and will not create any liability on the
              part of BeatZa, its subsidiaries, affiliates, successors, and
              assigns, and their respective employees, agents, directors,
              officers and/or shareholders. BeatZa reserves the right to remove
              your Content, suspend or terminate your access to the Platform
              and/or pursue all legal remedies if we believe that any of your
              Content breaches any of the foregoing representations or
              warranties, or otherwise infringes another person's rights or
              violates any law, rule or regulation.
            </p>
          </Section>

          <Section id="liability" title="Liability for Content">
            <p className="mb-4">
              BeatZa stores content and other information at the direction,
              request and with the authorization of its users as a passive
              conduit and/or host for the uploading, storage and distribution of
              such content. BeatZa does not have knowledge of, or control over,
              your Content. You are fully responsible for all of the Content
              that you upload, post or distribute to, on or through the
              Platform, and to the extent permissible by law, BeatZa excludes
              all liability with respect to all content (including your Content)
              and the activities of its users with respect thereto.
            </p>
            <p className="mb-4">
              BeatZa does not review the content uploaded by its users, and
              neither BeatZa nor its subsidiaries, affiliates, successors,
              assigns, employees, agents, directors, officers and shareholders
              assume any duty to monitor the Platform. Notwithstanding, BeatZa
              reserves the right to moderate content in accordance with our
              Moderation and Enforcement Policy.
            </p>
            <p className="mb-6">
              BeatZa and its subsidiaries, affiliates, successors, assigns,
              employees, agents, directors, officers and shareholders hereby
              exclude, to the fullest extent permitted by law, any and all
              liability which may arise from any content uploaded to the
              Platform by users, including, but not limited to, any claims for
              infringement of intellectual property rights, rights of privacy or
              publicity rights, any claims relating to publication of abusive,
              defamatory, pornographic, or obscene material, or any claims
              relating to the completeness, accuracy, currency or reliability of
              any information provided by users of the Platform. By using the
              Platform, you irrevocably waive the right to assert any claim with
              respect to any of the foregoing against BeatZa or any of its
              subsidiaries, affiliates, successors, assigns, employees, agents,
              directors, officers or shareholders.
            </p>
          </Section>

          <Section id="reporting" title="Reporting Infringements">
            <p className="mb-4">
              If you discover any content on the Platform that you believe
              infringes your copyright, please report this to us using any of
              the methods outlined below or on our{" "}
              <Link>Copyright Information pages</Link>.
            </p>
            <p className="mb-4">
              If you discover Content that otherwise violates these Terms of
              Use, our Community Guidelines or applicable law, please report
              this to us using any of the methods outlined in our{" "}
              <Link>Moderation and Enforcement Policies</Link>.
            </p>
            <p className="mb-4">
              If you identify any tracks on BeatZa that you believe infringe
              your copyright, please only report infringement of your own
              copyright, or the copyright of someone you are authorized to
              represent. Please do not report copyright infringement unless you
              have a genuine claim. If you make groundless or malicious reports
              of copyright infringement, you risk having your account suspended
              or terminated.
            </p>
            <p className="mb-4">
              You can report copyright infringement by writing to us at{" "}
              <Link>copyright@beitza.com</Link> making sure that you include the
              following information:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                a statement that you have identified tracks on BeatZa which
                infringe your copyright or the copyright of a third party on
                whose behalf you are entitled to act;
              </li>
              <li>
                a description of the copyright work(s) that you claim have been
                infringed;
              </li>
              <li>
                a description of the sound(s) that you claim are infringing and
                the BeatZa URL(s) where such tracks can be located;
              </li>
              <li>
                your full name, address and telephone number, a valid email
                address at which you can be contacted, and your BeatZa username
                if you have one;
              </li>
              <li>
                a statement by you that you have a good faith belief that the
                disputed use of the material is not authorized by the copyright
                owner, its agent, or the law;
              </li>
              <li>
                a statement by you that the information in your notice is
                accurate and that you are authorized to act on behalf of the
                owner of the exclusive right that is allegedly infringed.
              </li>
            </ul>
            <p className="mb-10">
              You can also report directly using the "Report" button found on
              each track page, located on the left side under the name of the
              user who uploaded it.
            </p>
          </Section>

          <p className="text-[#888888] text-xs">Last Amended: March 9, 2026</p>
        </main>

        {/* SIDEBAR */}
        <LegalSidebar />
      </div>
    </div>
  );
}