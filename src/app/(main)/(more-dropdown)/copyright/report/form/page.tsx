"use client";

import React, { useState } from "react";
import LegalSidebar from "@/app/(main)/(more-dropdown)/legal/LegalSidebar";
import { useRouter } from "next/navigation";

interface FormData {
  urls: string;
  involvement: string;
  rightsNature: string;
  infringementDetails: string;
  firstName: string;
  lastName: string;
  companyName: string;
  rightsholder: string;
  streetAddress: string;
  aptSuite: string;
  city: string;
  zipCode: string;
  country: string;
  displayName: string;
  email: string;
  telephone: string;
  confirmGoodFaith: boolean;
  confirmAccurate: boolean;
  confirmLiability: boolean;
  confirmOwner: boolean;
  signature: string;
}

function CompletedStep({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p className="text-silver text-[13px]">{question}</p>
        <p className="text-silver text-[13px]">{answer}</p>
      </div>
    </div>
  );
}

function RadioOption({
  value,
  selected,
  label,
  description,
  onChange,
}: {
  value: string;
  selected: string;
  label: string;
  description?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-start gap-3 mb-5 cursor-pointer group" onClick={() => onChange(value)}>
      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${selected === value ? "border-white" : "border-[#555] group-hover:border-[#888]"}`}>
        {selected === value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
      </div>
      <div>
        <p className="text-white-smoke font-bold text-[14px]">{label}</p>
        {description && <p className="text-silver text-[13px]">{description}</p>}
      </div>
    </label>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] text-white-smoke">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="bg-[#2a2a2a] border border-[#3a3a3a] text-white-smoke text-[13px] px-3 py-2 rounded focus:outline-none focus:border-[#555] placeholder-[#555]"
      />
    </div>
  );
}

export default function ReportCopyrightForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    urls: "",
    involvement: "",
    rightsNature: "",
    infringementDetails: "",
    firstName: "",
    lastName: "",
    companyName: "",
    rightsholder: "",
    streetAddress: "",
    aptSuite: "",
    city: "",
    zipCode: "",
    country: "",
    displayName: "",
    email: "",
    telephone: "",
    confirmGoodFaith: false,
    confirmAccurate: false,
    confirmLiability: false,
    confirmOwner: false,
    signature: "",
  });

  const setField = (key: keyof FormData) => (val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 1) return form.urls.trim() !== "";
    if (step === 2) return form.involvement !== "";
    if (step === 3) return form.rightsNature !== "";
    if (step === 4) return form.infringementDetails.trim() !== "";
    if (step === 5)
      return !!(form.firstName && form.lastName && form.rightsholder &&
        form.streetAddress && form.city && form.zipCode &&
        form.country && form.telephone);
    if (step === 6)
      return !!(form.confirmGoodFaith && form.confirmAccurate &&
        form.confirmLiability && form.confirmOwner && form.signature.trim());
    return true;
  };

  const involvementLabel: Record<string, string> = {
    owner: "I am the copyright owner",
    agent: "I am an authorized agent",
    notInvolved: "I am not directly involved",
  };

  const rightsLabel: Record<string, string> = {
    literary: "A literary, dramatic or musical work",
    sound: "A sound recording",
    other: "Other copyright or related rights",
  };

  return (
    <div className="min-h-screen bg-chinese-black text-white-smoke font-sans">
      <div className="max-w-7xl mx-auto pr-8 py-2 flex gap-28 px-4 sm:px-0">

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full max-w-3xl text-[14px] leading-relaxed text-white-smoke">
          <h1 className="text-2xl font-bold text-white-smoke mb-2">
            Report copyright infringement
          </h1>
          <p className="mb-6 text-[14px]">
            If you identify content on BeatZa that you believe{" "}
            <strong className="text-white-smoke">infringes your copyright</strong>
            , you can let us know here.
          </p>

          {/* Completed steps summary */}
          {step >= 2 && (
            <CompletedStep
              question="Which track(s) do you wish to report?"
              answer={form.urls}
            />
          )}
          {step >= 3 && (
            <CompletedStep
              question="How are you involved?"
              answer={involvementLabel[form.involvement] || form.involvement}
            />
          )}
          {step >= 4 && (
            <CompletedStep
              question="What is the nature of the rights at issue?"
              answer={rightsLabel[form.rightsNature] || form.rightsNature}
            />
          )}
          {step >= 5 && (
            <CompletedStep
              question="Identify, in as much detail as possible, the copyright work(s) that you believe are being infringed."
              answer={form.infringementDetails}
            />
          )}
          {step >= 6 && (
            <CompletedStep
              question="Please provide your contact details"
              answer={`${form.firstName} ${form.lastName}`}
            />
          )}

          {/* Step 1: URLs */}
          {step === 1 && (
            <div>
              <h2 className="text-base font-bold text-white-smoke mb-3">
                Which track(s) do you wish to report?
              </h2>
              <label className="block text-[13px] text-silver mb-1">
                BeatZa URL(s) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.urls}
                onChange={(e) => setField("urls")(e.target.value)}
                placeholder={`https://beatza.com/user/track1\nhttps://beatza.com/user/track2`}
                className="w-full h-28 bg-[#2a2a2a] text-silver text-[13px] placeholder-[#555] border border-[#3a3a3a] rounded p-3 resize-y focus:outline-none focus:border-[#555]"
              />
            </div>
          )}

          {/* Step 2: Involvement */}
          {step === 2 && (
            <div>
              <h2 className="text-base font-bold text-white-smoke mb-5">
                How are you involved?
              </h2>
              <RadioOption
                value="owner"
                selected={form.involvement}
                label="I am the copyright owner"
                description="I own or exclusively control rights that are being infringed"
                onChange={setField("involvement") as (v: string) => void}
              />
              <RadioOption
                value="agent"
                selected={form.involvement}
                label="I am an authorized agent"
                description="I am authorized to act on behalf of the person or company that owns or exclusively controls the rights that are being infringed"
                onChange={setField("involvement") as (v: string) => void}
              />
              <RadioOption
                value="notInvolved"
                selected={form.involvement}
                label="I am not directly involved"
                description="I wish to report infringement of someone else's copyright"
                onChange={setField("involvement") as (v: string) => void}
              />
            </div>
          )}

          {/* Step 3: Rights nature */}
          {step === 3 && (
            <div>
              <h2 className="text-base font-bold text-white-smoke mb-5">
                What is the nature of the rights at issue?
              </h2>
              <RadioOption
                value="literary"
                selected={form.rightsNature}
                label="A literary, dramatic or musical work"
                onChange={setField("rightsNature") as (v: string) => void}
              />
              <RadioOption
                value="sound"
                selected={form.rightsNature}
                label="A sound recording"
                onChange={setField("rightsNature") as (v: string) => void}
              />
              <RadioOption
                value="other"
                selected={form.rightsNature}
                label="Other copyright or related rights"
                onChange={setField("rightsNature") as (v: string) => void}
              />
            </div>
          )}

          {/* Step 4: Infringement details */}
          {step === 4 && (
            <div>
              <h2 className="text-base font-bold text-white-smoke mb-3">
                Identify, in as much detail as possible, the copyright work(s) that you believe are being infringed.
              </h2>
              <label className="block text-[13px] text-silver mb-1">
                Details of infringement <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.infringementDetails}
                onChange={(e) => setField("infringementDetails")(e.target.value)}
                className="w-full h-28 bg-[#2a2a2a] text-silver text-[13px] placeholder-[#555] border border-[#3a3a3a] rounded p-3 resize-y focus:outline-none focus:border-[#555]"
              />
            </div>
          )}

          {/* Step 5: Contact details */}
          {step === 5 && (
            <div>
              <h2 className="text-base font-bold text-white-smoke mb-5">
                Please provide your contact details
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field label="First name" required value={form.firstName} onChange={setField("firstName") as (v: string) => void} />
                <Field label="Last name" required value={form.lastName} onChange={setField("lastName") as (v: string) => void} />
              </div>
              <div className="flex flex-col gap-4 mb-4">
                <Field label="Company name (optional)" value={form.companyName} onChange={setField("companyName") as (v: string) => void} />
                <Field label="Rightsholder that you represent" required value={form.rightsholder} onChange={setField("rightsholder") as (v: string) => void} />
                <Field label="Street address" required value={form.streetAddress} onChange={setField("streetAddress") as (v: string) => void} />
                <Field label="Apt, Suite, etc. (optional)" value={form.aptSuite} onChange={setField("aptSuite") as (v: string) => void} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field label="City" required value={form.city} onChange={setField("city") as (v: string) => void} />
                <Field label="ZIP / Postal code" required value={form.zipCode} onChange={setField("zipCode") as (v: string) => void} />
              </div>
              <div className="mb-4">
                <Field label="Country" required value={form.country} onChange={setField("country") as (v: string) => void} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field label="Your display name" value={form.displayName} readOnly />
                <Field label="Email address" value={form.email} readOnly />
              </div>
              <div className="w-1/2">
                <Field label="Telephone number" required value={form.telephone} onChange={setField("telephone") as (v: string) => void} />
              </div>
            </div>
          )}

          {/* Step 6: Review & Confirm */}
          {step === 6 && (
            <div>
              {/* Contact summary table */}
              <div className="mb-6 text-[13px] text-silver grid grid-cols-2 gap-x-8 gap-y-1.5">
                <span>Name</span><span>{form.firstName} {form.lastName}</span>
                <span>Display name</span><span>{form.displayName}</span>
                <span>Company name</span><span>{form.companyName || "—"}</span>
                <span>Email</span><span>{form.email}</span>
                <span>Rightsholder</span><span>{form.rightsholder || "none"}</span>
                <span>Telephone</span><span>{form.telephone}</span>
                <span>Address</span>
                <span>
                  {form.aptSuite && <>{form.aptSuite}<br /></>}
                  {form.streetAddress}<br />
                  {form.city}, {form.zipCode}<br />
                  {form.country}
                </span>
              </div>

              <h2 className="text-base font-bold text-white-smoke mb-2">Confirm report</h2>
              <p className="text-[13px] text-silver mb-4">
                Please read the following statements and check the boxes to confirm your agreement.
              </p>

              {([
                {
                  key: "confirmGoodFaith" as keyof FormData,
                  text: "I have a good faith belief that use of the copyrighted work described above is not authorized by the copyright owner, its agent or the law.",
                },
                {
                  key: "confirmAccurate" as keyof FormData,
                  text: "I confirm that the information in this notification is accurate.",
                },
                {
                  key: "confirmLiability" as keyof FormData,
                  text: "I acknowledge that BeatZa may suspend or disable my account if I make false, malicious or bad faith allegations of copyright infringement, and that I may also be liable for damages (including costs and attorney's fees) incurred by BeatZa, the alleged infringer, or the copyright owner or its authorized licensee as the result of any such allegations.",
                },
                {
                  key: "confirmOwner" as keyof FormData,
                  text: "I confirm that I am the copyright owner or am authorised to act on behalf of the owner of an exclusive right that is allegedly infringed. Where I am making notice pursuant to the United States Digital Millennium Copyright Act U.S.C.17§512(c), I make this statement under penalty of perjury.",
                },
              ] as { key: keyof FormData; text: string }[]).map(({ key, text }) => (
                <label key={key as string} className="flex items-start gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[key] as boolean}
                    onChange={(e) => setField(key)(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-white cursor-pointer"
                  />
                  <span className="text-[13px] text-silver">
                    {text} <span className="text-red-500">*</span>
                  </span>
                </label>
              ))}

              <p className="text-[13px] text-silver mb-4">
                By submitting this takedown form, I agree to having my information in respect to my rights ownership and email address shared with the uploader in case of dispute. In no instance, will my postal address or telephone number be shared.
              </p>

              <p className="text-[13px] text-white-smoke font-semibold mb-1">
                Please sign with your full name. This box will act as your digital signature{" "}
                <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={form.signature}
                onChange={(e) => setField("signature")(e.target.value)}
                placeholder="Full name"
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white-smoke text-[13px] px-3 py-2 rounded focus:outline-none focus:border-[#555] placeholder-[#555]"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-end gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="bg-[#2a2a2a] text-white-smoke font-semibold text-[14px] px-5 py-2 rounded hover:bg-[#3a3a3a] transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < 6) 
                  setStep((s) => s + 1);
              }}
              disabled={!canNext()}
              className="bg-white text-black font-semibold text-[14px] px-6 py-2 rounded hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 6 ? "Report track" : "Next"}
            </button>
          </div>
        </main>

        {/* RIGHT COLUMN */}
        <div className="hidden md:block w-64 shrink-0">
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
          <LegalSidebar />
        </div>
      </div>
    </div>
  );
}
