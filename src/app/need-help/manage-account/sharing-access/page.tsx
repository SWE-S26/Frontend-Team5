import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SharingAccess() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/manage-account"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Manage My Account
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-4">Sharing Access to an Account</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          We understand that the BeatZa community is built on collaboration, and that you may want
          to share access and account responsibilities with band members, managers, or others who
          help you manage your sounds.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-amber-800 text-xs leading-relaxed">
            <span className="font-semibold">We do not advise sharing access to an account</span>,
            even with those you trust. By sharing access, you leave yourself at risk of changes
            being made or your account being deleted without your consent.
          </p>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Before making the decision to share an account, remember: we consider the owner of the
          email address used at sign-up to be the account owner. Therefore, if you do go ahead with
          creating a shared account, we would advise that you use an email address which all parties
          have access to, so that everyone can access the account.
        </p>
      </article>
    </div>
  );
}
