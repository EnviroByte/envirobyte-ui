import React from "react";
import { Building2, Check } from "lucide-react";

export interface SelectableCompany {
  id: string;
  name: string;
  role?: string;
}

export interface SelectCompanyPageProps {
  /** List of companies the user can choose from */
  companies: SelectableCompany[];
  /** ID of the currently selected company */
  selectedCompanyId?: string;
  /** Called when a company is clicked */
  onSelect: (company: SelectableCompany) => void;
  /** Called when Cancel is clicked — omit to hide the cancel button */
  onCancel?: () => void;
  /** Page heading (default: "Select Company") */
  title?: string;
  /** Sub-heading below the title */
  description?: string;
}

export function SelectCompanyPage({
  companies,
  selectedCompanyId,
  onSelect,
  onCancel,
  title = "Select Company",
  description = "Choose the company you want to work with.",
}: SelectCompanyPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 mb-4">
            <Building2 className="h-6 w-6 text-cyan-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        {/* Company list */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          {companies.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-400">
              No companies are assigned to your account.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {companies.map((company) => {
                const isActive = selectedCompanyId === company.id;
                return (
                  <li key={company.id}>
                    <button
                      onClick={() => onSelect(company)}
                      className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50 ${
                        isActive ? "bg-cyan-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex items-center justify-center h-9 w-9 rounded-lg shrink-0 ${
                            isActive
                              ? "bg-cyan-100 text-cyan-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isActive ? "text-cyan-700" : "text-slate-800"
                            }`}
                          >
                            {company.name}
                          </p>
                          {company.role && (
                            <p className="text-xs text-slate-400 capitalize mt-0.5">
                              {company.role}
                            </p>
                          )}
                        </div>
                      </div>
                      {isActive && (
                        <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 w-full text-sm text-slate-500 hover:text-slate-700 text-center py-2 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
