"use client";

export function AnalyticsSettingsButton() {
  return (
    <button
      type="button"
      className="btn btn-dark"
      onClick={() => window.dispatchEvent(new Event("mezzanail:open-analytics-settings"))}
    >
      Manage analytics
    </button>
  );
}
