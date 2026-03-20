"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react";

type ReportStatus = "pending" | "reviewed" | "dismissed";
type ReportType = "track" | "playlist" | "user";
type ReportReason = "inappropriate content" | "harassment" | "spam" | "copyright" | "hate speech";

interface Report {
  id: number;
  reporter: string;
  reportedItem: string;
  itemType: ReportType;
  reason: ReportReason;
  date: string;
  status: ReportStatus;
}

const mockReports: Report[] = [
  { id: 1, reporter: "music_lover", reportedItem: "Explicit Content", itemType: "track", reason: "inappropriate content", date: "2024-06-01", status: "pending" },
  { id: 2, reporter: "dj_vibes", reportedItem: "bad_actor", itemType: "user", reason: "harassment", date: "2024-06-02", status: "reviewed" },
  { id: 3, reporter: "john_doe", reportedItem: "Stolen Track", itemType: "track", reason: "copyright", date: "2024-06-03", status: "pending" },
  { id: 4, reporter: "jane_smith", reportedItem: "spam_user", itemType: "user", reason: "spam", date: "2024-06-04", status: "dismissed" },
  { id: 5, reporter: "music_lover", reportedItem: "Best of 2024", itemType: "playlist", reason: "hate speech", date: "2024-06-05", status: "pending" },
  { id: 6, reporter: "dj_vibes", reportedItem: "Stolen Track", itemType: "track", reason: "copyright", date: "2024-06-06", status: "reviewed" },
];

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const styles: Record<ReportStatus, string> = {
    pending: "bg-brilliant-orange/20 text-brilliant-orange",
    reviewed: "bg-green-500/20 text-green-400",
    dismissed: "bg-white/10 text-silver",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const TypeBadge = ({ type }: { type: ReportType }) => {
  const styles: Record<ReportType, string> = {
    track: "bg-brilliant-orange/20 text-brilliant-orange",
    playlist: "bg-crusta/20 text-crusta",
    user: "bg-white/10 text-silver",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {type}
    </span>
  );
};

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [filter, setFilter] = useState<"all" | ReportStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ReportType>("all");

  const filtered = reports.filter((r) => {
    const matchesStatus = filter === "all" || r.status === filter;
    const matchesType = typeFilter === "all" || r.itemType === typeFilter;
    return matchesStatus && matchesType;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    dismissed: reports.filter((r) => r.status === "dismissed").length,
  };

  const updateStatus = (id: number, status: ReportStatus) =>
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white-smoke">Reports Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: stats.total },
          { label: "Pending", value: stats.pending, color: "text-brilliant-orange" },
          { label: "Reviewed", value: stats.reviewed, color: "text-green-400" },
          { label: "Dismissed", value: stats.dismissed, color: "text-silver" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-off-black rounded-xl p-4 border border-white/5">
            <p className="text-silver text-sm">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color ?? "text-white-smoke"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-1 bg-off-black border border-white/10 rounded-lg p-1">
          <span className="px-2 py-1 text-xs text-silver self-center">Status:</span>
          {(["all", "pending", "reviewed", "dismissed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                filter === f ? "bg-brilliant-orange text-white" : "text-silver hover:text-white-smoke"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-off-black border border-white/10 rounded-lg p-1">
          <span className="px-2 py-1 text-xs text-silver self-center">Type:</span>
          {(["all", "track", "playlist", "user"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                typeFilter === f ? "bg-brilliant-orange text-white" : "text-silver hover:text-white-smoke"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-off-black rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-silver text-left">
              <th className="px-4 py-3 font-medium">Reporter</th>
              <th className="px-4 py-3 font-medium">Reported Item</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={report.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white-smoke font-medium">{report.reporter}</td>
                <td className="px-4 py-3 text-silver">{report.reportedItem}</td>
                <td className="px-4 py-3">
                  <TypeBadge type={report.itemType} />
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-silver capitalize">
                    {report.reason === "hate speech" || report.reason === "inappropriate content" ? (
                      <AlertTriangle size={13} className="text-anger" />
                    ) : null}
                    {report.reason}
                  </span>
                </td>
                <td className="px-4 py-3 text-silver">{report.date}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      title="View"
                      className="p-1.5 rounded-lg text-silver hover:text-white-smoke hover:bg-white/10 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                    {report.status !== "reviewed" && (
                      <button
                        title="Mark as reviewed"
                        onClick={() => updateStatus(report.id, "reviewed")}
                        className="p-1.5 rounded-lg text-silver hover:text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                        <CheckCircle size={15} />
                      </button>
                    )}
                    {report.status !== "dismissed" && (
                      <button
                        title="Dismiss"
                        onClick={() => updateStatus(report.id, "dismissed")}
                        className="p-1.5 rounded-lg text-silver hover:text-anger hover:bg-anger/10 transition-colors"
                      >
                        <XCircle size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-silver text-center py-10">No reports found.</p>
        )}
      </div>
    </div>
  );
}
