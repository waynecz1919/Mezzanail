import type {
  WinnieBridgeFailure,
  WinnieBridgeNoData,
  WinnieBridgeSource,
  WinnieBridgeStaleData,
  WinnieBridgeSuccess,
} from "./contracts";

function fetchedAt(value?: string) {
  return value ?? new Date().toISOString();
}

export function bridgeSuccess<Data, Source extends WinnieBridgeSource>(
  source: Source,
  data: Data,
  at?: string,
): WinnieBridgeSuccess<Data, Source> {
  return { status: "success", data, source, fetchedAt: fetchedAt(at), isStale: false };
}

export function bridgeNoData<Source extends WinnieBridgeSource>(
  source: Source,
  at?: string,
): WinnieBridgeNoData<Source> {
  return { status: "no_data", data: null, source, fetchedAt: fetchedAt(at), isStale: false };
}

export function bridgeStaleData<Data, Source extends WinnieBridgeSource>(
  source: Source,
  data: Data,
  at?: string,
): WinnieBridgeStaleData<Data, Source> {
  return {
    status: "stale_data",
    data,
    source,
    fetchedAt: fetchedAt(at),
    isStale: true,
    message: "The available data may be out of date.",
  };
}

function bridgeFailure<Source extends WinnieBridgeSource>(
  source: Source,
  status: WinnieBridgeFailure<Source>["status"],
  message: string,
  at?: string,
): WinnieBridgeFailure<Source> {
  return {
    status,
    data: null,
    source,
    fetchedAt: fetchedAt(at),
    isStale: false,
    message,
  };
}

export function bridgePermissionDenied<Source extends WinnieBridgeSource>(source: Source) {
  return bridgeFailure(source, "permission_denied", "You do not have permission to view this information.");
}

export function bridgeUpstreamUnavailable<Source extends WinnieBridgeSource>(source: Source, at?: string) {
  return bridgeFailure(source, "upstream_unavailable", "The source system is temporarily unavailable.", at);
}

export function bridgeConfigurationMissing<Source extends WinnieBridgeSource>(source: Source, at?: string) {
  return bridgeFailure(source, "configuration_missing", "This source is not connected yet.", at);
}
