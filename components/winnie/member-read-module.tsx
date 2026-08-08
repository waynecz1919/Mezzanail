"use client";

import { Search, UserRound } from "lucide-react";
import { useState } from "react";

import type { WinnieUser } from "@/lib/auth/session";
import type { WinnieBridgeResult } from "@/lib/winnie/bridges/contracts";
import type { WinnieMember, WinnieMemberStatus } from "@/lib/winnie/bridges/members/contracts";

type SearchResult = WinnieBridgeResult<readonly WinnieMember[], "member-center">;
type ProfileResult = WinnieBridgeResult<WinnieMember, "member-center">;

function statusLabel(status: WinnieMemberStatus) {
  return status.replaceAll("_", " ");
}

function resultMessage(result: SearchResult | ProfileResult) {
  if (result.status === "configuration_missing") return "Member data is not connected in this environment.";
  if (result.status === "permission_denied") return "You do not have permission to view member profiles.";
  if (result.status === "upstream_unavailable") return "Member data is temporarily unavailable.";
  if (result.status === "no_data") return "No matching member was found.";
  return null;
}

async function readBridgeJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    credentials: "same-origin",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload) throw new Error("Member data is temporarily unavailable.");
  return payload as T;
}

function canSearch(value: string) {
  const query = value.trim();
  if (/^\d+$/.test(query)) return Number(query) > 0;
  return query.length >= 2;
}

function SearchResultCard({ member, onOpen }: { member: WinnieMember; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="winnie-member-result w-full text-left"
    >
      <span className="winnie-member-result-icon"><UserRound aria-hidden="true" className="h-5 w-5" /></span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-[#182235]">{member.name || "Member name unavailable"}</span>
        <span className="mt-1 block text-sm text-[#69748b]">
          {member.memberNo || "Member No unavailable"} · {statusLabel(member.status)}
        </span>
        {member.phone && <span className="mt-1 block text-xs text-[#8a94a8]">{member.phone}</span>}
      </span>
      <span className="text-xs font-semibold text-[#6558a6]">View</span>
    </button>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="winnie-member-profile-field">
      <p className="winnie-meta-card-label">{label}</p>
      <p className="winnie-member-profile-value">{value}</p>
    </div>
  );
}

export function MemberReadModule({ user }: { user: WinnieUser }) {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [profileResult, setProfileResult] = useState<ProfileResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function searchMembers() {
    const value = query.trim();
    if (!canSearch(value)) {
      setMessage("Enter at least two characters, or a numeric customer ID.");
      setSearchResult(null);
      return;
    }
    setBusy(true);
    setMessage(null);
    setProfileResult(null);
    try {
      const result = await readBridgeJson<SearchResult>(
        `/api/manager/members/search?q=${encodeURIComponent(value)}&limit=20`,
      );
      setSearchResult(result);
      setMessage(resultMessage(result));
    } catch (error) {
      setSearchResult(null);
      setMessage(error instanceof Error ? error.message : "Member data is temporarily unavailable.");
    } finally {
      setBusy(false);
    }
  }

  async function openMember(member: WinnieMember) {
    setBusy(true);
    setMessage(null);
    try {
      const result = await readBridgeJson<ProfileResult>(
        `/api/manager/members/${encodeURIComponent(String(member.customerId))}`,
      );
      setProfileResult(result);
      setMessage(resultMessage(result));
    } catch (error) {
      setProfileResult(null);
      setMessage(error instanceof Error ? error.message : "Member data is temporarily unavailable.");
    } finally {
      setBusy(false);
    }
  }

  const members = searchResult?.status === "success" || searchResult?.status === "stale_data"
    ? searchResult.data
    : [];
  const profile = profileResult?.status === "success" || profileResult?.status === "stale_data"
    ? profileResult.data
    : null;

  return (
    <section className="winnie-page-card">
      <p className="winnie-page-eyebrow"><UserRound aria-hidden="true" className="mr-2 inline h-4 w-4" />Read-only connection</p>
      <h1>Customer Profiles</h1>
      <p>Search authoritative Member Center profile data. Member records remain read-only in Winnie.</p>

      <form
        className="mt-7 flex flex-col gap-3 sm:flex-row"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          void searchMembers();
        }}
      >
        <label className="sr-only" htmlFor="member-search">Search by name, Member No, phone or customer ID</label>
        <input
          id="member-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, Member No, phone or customer ID"
          className="winnie-member-search-input min-h-12 flex-1 rounded-xl border border-[#e5e8f1] bg-white px-4 text-sm text-[#182235] outline-none transition focus:border-[#9b8ff0] focus:ring-4 focus:ring-[#eeeaff]"
          autoComplete="off"
        />
        <button type="submit" className="winnie-button-primary min-h-12 justify-center" disabled={busy}>
          <Search aria-hidden="true" className="h-4 w-4" />
          {busy ? "Searching..." : "Search"}
        </button>
      </form>

      {message && (
        <div className="mt-5 rounded-2xl border border-[#e8e5f1] bg-[#faf9fc] p-4 text-sm text-[#69748b]" role="status">
          {message}
        </div>
      )}

      {searchResult?.status === "stale_data" && (
        <p className="mt-5 rounded-xl border border-[#f0dcb8] bg-[#fffaf0] px-4 py-3 text-sm text-[#7f6535]">Some source records may be out of date.</p>
      )}

      {members.length > 0 && (
        <div className="mt-6 space-y-3" aria-label="Member search results">
          {members.map((member) => (
            <SearchResultCard key={member.customerId} member={member} onOpen={() => void openMember(member)} />
          ))}
        </div>
      )}

      {profile && (
        <section className="mt-8 border-t border-[#ebe8f4] pt-7" aria-labelledby="member-profile-heading">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="winnie-page-eyebrow">Customer Profile</p>
              <h2 id="member-profile-heading" className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#182235]">{profile.name || "Member profile"}</h2>
            </div>
            {profileResult?.status === "stale_data" && <span className="rounded-full bg-[#fff4d9] px-3 py-1.5 text-xs font-semibold text-[#7f6535]">Source may be stale</span>}
          </div>

          <div className="winnie-member-profile-grid mt-6">
            <div className="winnie-member-profile-group">
              <p className="winnie-member-profile-group-label">Identity</p>
              <ProfileField label="Member No" value={profile.memberNo || "Not available"} />
              {user.role === "ADMIN" && <ProfileField label="Customer ID" value={String(profile.customerId)} />}
            </div>
            <div className="winnie-member-profile-group">
              <p className="winnie-member-profile-group-label">Membership</p>
              <ProfileField label="Status" value={statusLabel(profile.status)} />
            </div>
            <div className="winnie-member-profile-group">
              <p className="winnie-member-profile-group-label">Contact</p>
              <ProfileField label="Phone" value={profile.phone || "Not available"} />
            </div>
            <div className="winnie-member-profile-group">
              <p className="winnie-member-profile-group-label">Profile</p>
              <ProfileField label="Birth month" value={profile.birthMonth ? `Month ${profile.birthMonth}` : "Not available"} />
            </div>
            <div className="winnie-member-profile-group sm:col-span-2">
              <p className="winnie-member-profile-group-label">System</p>
              <ProfileField label="Source system" value={profile.sourceSystem || "Member Center"} />
              <ProfileField label="Source sync" value={profile.syncedAt || "Not provided"} />
              {user.role === "ADMIN" && profile.sourceTier && <ProfileField label="Source tier (reference only)" value={profile.sourceTier} />}
            </div>
          </div>
          <p className="mt-5 text-xs text-[#8a94a8]">Fetched at {profileResult?.fetchedAt}. Credit, Family Sharing and discount assignment are not part of this read-only view.</p>
        </section>
      )}
    </section>
  );
}
