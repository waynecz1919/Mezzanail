export const winnieBridgeSources = [
  "appointment-system",
  "member-center",
  "team-hub",
] as const;

export type WinnieBridgeSource = (typeof winnieBridgeSources)[number];

export const winnieBridgeStatuses = [
  "success",
  "no_data",
  "permission_denied",
  "upstream_unavailable",
  "stale_data",
  "configuration_missing",
] as const;

export type WinnieBridgeStatus = (typeof winnieBridgeStatuses)[number];

export type WinnieBridgeEnvelope<Source extends WinnieBridgeSource> = Readonly<{
  source: Source;
  fetchedAt: string;
  isStale: boolean;
}>;

export type WinnieBridgeSuccess<
  Data,
  Source extends WinnieBridgeSource,
> = WinnieBridgeEnvelope<Source> &
  Readonly<{
    status: "success";
    data: Data;
  }>;

export type WinnieBridgeNoData<Source extends WinnieBridgeSource> =
  WinnieBridgeEnvelope<Source> &
    Readonly<{
      status: "no_data";
      data: null;
    }>;

export type WinnieBridgeStaleData<
  Data,
  Source extends WinnieBridgeSource,
> = WinnieBridgeEnvelope<Source> &
  Readonly<{
    status: "stale_data";
    data: Data;
    message: "The available data may be out of date.";
  }>;

export type WinnieBridgeFailureStatus =
  | "permission_denied"
  | "upstream_unavailable"
  | "configuration_missing";

export type WinnieBridgeFailure<Source extends WinnieBridgeSource> =
  WinnieBridgeEnvelope<Source> &
    Readonly<{
      status: WinnieBridgeFailureStatus;
      data: null;
      message: string;
    }>;

export type WinnieBridgeResult<
  Data,
  Source extends WinnieBridgeSource = WinnieBridgeSource,
> =
  | WinnieBridgeSuccess<Data, Source>
  | WinnieBridgeNoData<Source>
  | WinnieBridgeStaleData<Data, Source>
  | WinnieBridgeFailure<Source>;
