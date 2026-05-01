"use client";

import { useState, useMemo } from "react";
import { CheckCircle, AlertTriangle, Trash2 } from "lucide-react";
import { useAdminReports } from "@/hooks/admin-dash/useAdminReports";
import { useAdminReportActions } from "@/hooks/admin-dash/useAdminReportActions";
import { AdminReport, ReportStatus, ReportViolatorType } from "@/types/admin-dash/adminReports.types";

const LIMIT = 20;

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const styles: Record<ReportStatus, string> = {
    pending: "bg-brilliant-orange/20 text-brilliant-orange",
    done: "bg-green-500/20 text-green-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const TypeBadge = ({ type }: { type: ReportViolatorType }) => {
  const styles: Record<ReportViolatorType, string> = {
    track: "bg-brilliant-orange/20 text-brilliant-orange",
    user: "bg-white/10 text-silver",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {type}
    </span>
  );
};

export default function ReportsManagement() {
  const [offset, setOffset] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ReportViolatorType>("all");

  const params = useMemo(
    () => ({
      offset,
      limit: LIMIT,
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(typeFilter !== "all" ? { type: typeFilter } : {}),
    }),
    [offset, statusFilter, typeFilter]
  );

  const { reports, total, loading, error } = useAdminReports(params);
  const { resolveReport, deleteAndResolve, loadingId } = useAdminReportActions();

  const totalPages = Math.ceil(total / LIMIT);

  const stats = useMemo(
    () => ({
      total,
      pending: reports.filter((r) => r.status === "pending").length,
      done: reports.filter((r) => r.status === "done").length,
    }),
    [reports, total]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white-smoke">Reports Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: stats.total },
          { label: "Pending", value: stats.pending, color: "text-brilliant-orange" },
          { label: "Done", value: stats.done, color: "text-green-400" },
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
          {(["all", "pending", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setOffset(1); }}
              className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                statusFilter === f ? "bg-brilliant-orange text-white" : "text-silver hover:text-white-smoke"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-off-black border border-white/10 rounded-lg p-1">
          <span className="px-2 py-1 text-xs text-silver self-center">Type:</span>
          {(["all", "track", "user"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setTypeFilter(f); setOffset(1); }}
              className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                typeFilter === f ? "bg-brilliant-orange text-white" : "text-silver hover:text-white-smoke"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-anger text-sm">{error}</p>}

      {/* Table */}
      <div className="bg-off-black rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-silver text-left">
              <th className="px-4 py-3 font-medium">Reporter</th>
              <th className="px-4 py-3 font-medium">Violator</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-silver text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-silver text-center py-10">
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((report: AdminReport) => (
                <tr
                  key={report.reportId}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-white-smoke font-medium">
                    {report.reporterDisplayName}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white-smoke font-medium">{report.violatorName}</p>
                    <p className="text-silver text-xs">{report.violatorId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={report.violatorType} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-silver">
                      <AlertTriangle size={13} className="text-anger shrink-0" />
                      {report.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-silver">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {report.status === "pending" && (
                        <>
                          <button
                            title="Mark as done"
                            disabled={loadingId === report.reportId}
                            onClick={() => resolveReport(report.reportId)}
                            className="p-1.5 rounded-lg text-silver hover:text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <CheckCircle size={15} />
                          </button>
                          {report.violatorName !== null && (
                            <button
                              title={`Delete ${report.violatorType} & resolve`}
                              disabled={loadingId === report.reportId}
                              onClick={() =>
                                deleteAndResolve(
                                  report.reportId,
                                  report.violatorId,
                                  report.violatorType
                                )
                              }
                              className="p-1.5 rounded-lg text-silver hover:text-anger hover:bg-anger/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-silver">
            Page {offset} of {totalPages} — {total} total reports
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((p) => Math.max(1, p - 1))}
              disabled={offset === 1}
              className="px-3 py-1.5 rounded-lg bg-off-black border border-white/10 text-silver hover:text-white-smoke disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset((p) => Math.min(totalPages, p + 1))}
              disabled={offset === totalPages}
              className="px-3 py-1.5 rounded-lg bg-off-black border border-white/10 text-silver hover:text-white-smoke disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}