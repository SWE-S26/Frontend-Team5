"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CancelSubscriptionModal from "@/components/payment/CancelSubscriptionModal";
import ChangeSubscriptionModal from "@/components/payment/ChangeSubscriptionModal";
import Link from "next/link";

import { useAppSelector } from "@/store/hooks";
import { useSubscription, useTransactions, useManageSubscription } from "@/hooks/usePayment";
import { useRefreshToken } from "@/hooks/useAuth";
import { Transaction } from "@/types/payment.types";

// ── Card Components ──────────────────────────────────────────────

function BasicPlanCard() {
  return (
    <div className="bg-off-black w-full rounded-sm p-4 text-white-smoke mb-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Basic</h1>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <p className="text-sm">
          Artist Pro plans include unlimited upload space and advanced features.
        </p>
        <Link href="/artist" className="shrink-0">
          <Button className="px-3 py-1.5 text-sm cursor-pointer bg-white-smoke text-chinese-black w-full sm:w-auto">
            Try Artist Pro
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface ArtistProCardProps {
  currentPeriodEnd: string;
  plan: string;
  onOpenCancelModal: () => void;
  onOpenChangeModal: () => void;
  cancelError: string | null;
}

function ArtistProCard({
  currentPeriodEnd,
  plan,
  onOpenCancelModal,
  onOpenChangeModal,
  cancelError,
}: ArtistProCardProps) {
  const renewDate = new Date(currentPeriodEnd).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const planLabel = plan === "pro_yearly" ? "Yearly Plan" : "Monthly Plan";

  return (
    <div className="bg-off-black w-full rounded-sm p-4 text-white-smoke mb-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Artist Pro</h1>
        <img src="/payment/pro-badge.svg" alt="Pro badge" className="w-5 h-5" />
      </div>
      <p className="text-sm mb-3">
        Artist Pro plans include unlimited upload space and advanced features.
      </p>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-silver">
          <p className="text-sm">Renews automatically on {renewDate}</p>
          <p className="text-sm">{planLabel}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            onClick={onOpenChangeModal}
            className="px-3 py-1.5 text-sm cursor-pointer bg-white-smoke text-chinese-black w-full sm:w-auto"
          >
            Change Subscription
          </Button>
          <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
            <Button
              onClick={onOpenCancelModal}
              className="px-3 py-1.5 text-sm cursor-pointer bg-red-500 text-white w-full sm:w-auto"
            >
              Cancel Subscription
            </Button>
            {cancelError && <p className="text-red-400 text-xs">{cancelError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TransactionCardProps {
  transaction: Transaction;
  index: number;
}

function TransactionCard({ transaction, index }: TransactionCardProps) {
  const date = new Date(transaction.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const amount =
    transaction.amount > 0
      ? `${(transaction.amount / 100).toFixed(2)} ${transaction.currency.toUpperCase()}`
      : "Free";

  const typeLabel =
    transaction.type === "payment_succeeded"
      ? "Payment"
      : transaction.type === "subscription_cancelled"
        ? "Cancellation"
        : transaction.type;

  return (
    <div className="bg-off-black w-full rounded-sm p-4 text-white-smoke">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-base sm:text-lg font-bold">Transaction #{index}</h1>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded shrink-0 ml-2 ${
            transaction.type === "payment_succeeded"
              ? "bg-green-900 text-green-400"
              : "bg-red-900 text-red-400"
          }`}
        >
          {typeLabel}
        </span>
      </div>
      <div className="space-y-1 text-xs sm:text-sm text-silver">
        <p>{transaction.description}</p>
        <p>Amount: {amount}</p>
        {transaction.discountPercent != null && (
          <p className="text-green-400">Discount: {transaction.discountPercent}% off</p>
        )}
        <p>Date: {date}</p>
        <p>Plan: {transaction.subscriptionType === "pro_monthly" ? "Monthly" : "Yearly"}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const role = useAppSelector((state) => state.auth.role);
  const isArtistPro = role === "Pro";

  const { subscription, loading: subscriptionLoading } = useSubscription();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    fetchTransactions,
  } = useTransactions();
  const {
    cancelSubscription,
    loading: cancelLoading,
    error: cancelError,
  } = useManageSubscription();
  const { refreshToken } = useRefreshToken();
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const handleCancel = async (cancelAtPeriodEnd: boolean) => {
    const success = await cancelSubscription(cancelAtPeriodEnd);
    if (success) {
      setCancelModalOpen(false);
      await refreshToken();
      await fetchTransactions();
    }
  };

  return (
    <div className="flex flex-col justify-between bg-chinese-black text-white-smoke font-sans px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-white-smoke mb-6">Subscriptions</h1>

      <div className="flex flex-col justify-between">
        {/* CURRENT PLANS */}
        <div className="w-full mb-8 sm:mb-10">
          <h1 className="text-xl sm:text-2xl font-bold text-white-smoke mb-4 sm:mb-6">
            Current Plans
          </h1>

          {subscriptionLoading ? (
            <div className="bg-off-black w-full rounded-sm p-4 text-silver text-sm mb-6">
              Loading subscription...
            </div>
          ) : isArtistPro && subscription ? (
            <ArtistProCard
              currentPeriodEnd={subscription.currentPeriodEnd}
              plan={subscription.plan}
              onOpenCancelModal={() => setCancelModalOpen(true)}
              onOpenChangeModal={() => setChangeModalOpen(true)}
              cancelError={cancelError}
            />
          ) : (
            <BasicPlanCard />
          )}

          <div className="flex flex-col sm:flex-row justify-center items-center bg-off-black w-full rounded-sm p-4 text-white-smoke text-sm gap-2 sm:gap-0">
            <p className="sm:mr-4">Are you a student?</p>
            <Link className="text-[#689ee3] font-bold" href="/goplus">
              Get BeatZa Go+ for 50% off
            </Link>
          </div>
        </div>

        {/* PURCHASE HISTORY */}
        <div className="w-full mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-white-smoke mb-4 sm:mb-6">
            Purchase History
          </h1>

          {transactionsLoading && (
            <div className="bg-off-black w-full rounded-sm p-4 text-silver text-sm mb-6">
              Loading transactions...
            </div>
          )}

          {transactionsError && <p className="text-red-400 text-sm mb-4">{transactionsError}</p>}

          {!transactionsLoading && !transactionsError && transactions.length === 0 && (
            <div className="bg-off-black w-full rounded-sm p-4 text-silver text-sm mb-6">
              No transactions found.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions.map((transaction, idx) => (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
                index={transactions.length - idx}
              />
            ))}
          </div>
        </div>
      </div>

      <CancelSubscriptionModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancel}
        isLoading={cancelLoading}
        error={cancelError}
      />
      <ChangeSubscriptionModal
        isOpen={changeModalOpen}
        onClose={() => setChangeModalOpen(false)}
        currentPlan={subscription?.plan ?? "pro_monthly"}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
