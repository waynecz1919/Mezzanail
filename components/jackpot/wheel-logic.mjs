const paper = "#FFFFFF";
const pink = "#F8E8EB";
const oddSegmentTone = "#EBCFD5";

function positiveTicketCount(value) {
  const ticketCount = Math.floor(Number(value));
  return Number.isFinite(ticketCount) && ticketCount > 0 ? ticketCount : 0;
}

/**
 * Builds one display segment for every ticket in the server-eligible pool.
 * Ticket ordinals are emitted in rounds so duplicate tickets are interleaved.
 */
export function buildWheelTicketSegments(participants, draws, campaign, prize, ignoredDrawId = null) {
  const drawHistory = draws.filter((draw) => draw.id !== ignoredDrawId);
  const candidates = participants
    .filter((participant) => participant.eligible && positiveTicketCount(participant.ticket_count) > 0)
    .filter((participant) => !drawHistory.some(
      (draw) => draw.prize_id === prize.id && draw.participant_id === participant.id,
    ))
    .filter((participant) => (
      campaign.allow_multiple_wins
      || prize.allow_previous_winner
      || !drawHistory.some(
        (draw) => draw.participant_id === participant.id && draw.status === "confirmed",
      )
    ))
    .map((participant) => ({ participant, ticketCount: positiveTicketCount(participant.ticket_count) }));

  const segments = [];
  const maxTickets = Math.max(0, ...candidates.map(({ ticketCount }) => ticketCount));
  for (let ticketNumber = 1; ticketNumber <= maxTickets; ticketNumber += 1) {
    for (const { participant, ticketCount } of candidates) {
      if (ticketCount < ticketNumber) continue;
      segments.push({
        id: `${participant.id}:ticket-${ticketNumber}`,
        participantId: participant.id,
        ticketNumber,
        participant,
      });
    }
  }

  return segments;
}

export function chooseWinnerSegmentIndex(segments, participantId, random = Math.random) {
  const matchingIndexes = [];
  segments.forEach((segment, index) => {
    if (segment.participantId === participantId) matchingIndexes.push(index);
  });
  if (!matchingIndexes.length) return -1;
  const randomValue = Math.max(0, Math.min(1 - Number.EPSILON, random()));
  return matchingIndexes[Math.floor(randomValue * matchingIndexes.length)];
}

export function calculateWheelStopAngle(segmentIndex, segmentCount, random = Math.random, turns = 20) {
  if (!Number.isInteger(segmentCount) || segmentCount < 1) {
    throw new RangeError("A wheel needs at least one segment.");
  }
  if (!Number.isInteger(segmentIndex) || segmentIndex < 0 || segmentIndex >= segmentCount) {
    throw new RangeError("The winning segment index is outside the wheel.");
  }

  const segmentAngle = 360 / segmentCount;
  const segmentCenterAngle = segmentIndex * segmentAngle;
  const jitterLimit = segmentAngle * 0.15; // 30% of half a segment.
  const randomValue = Math.max(0, Math.min(1, random()));
  const jitter = (randomValue * 2 - 1) * jitterLimit;
  return turns * 360 - segmentCenterAngle + jitter;
}

function segmentColor(index, count) {
  if (count === 1) return paper;
  if (count % 2 === 1 && index === count - 1) return oddSegmentTone;
  return index % 2 === 0 ? paper : pink;
}

export function buildWheelFaceGradient(segmentCount) {
  if (!Number.isInteger(segmentCount) || segmentCount < 1) return "radial-gradient(circle, #FFFFFF 35%, #F6EFE3 100%)";
  const segmentAngle = 360 / segmentCount;
  const stops = [];
  for (let index = 0; index < segmentCount; index += 1) {
    const start = index * segmentAngle;
    const end = (index + 1) * segmentAngle;
    const color = segmentColor(index, segmentCount);
    stops.push(`${color} ${start}deg ${end}deg`);
  }
  return `conic-gradient(from ${-segmentAngle / 2}deg, ${stops.join(", ")})`;
}

export function buildWheelSeparatorGradient(segmentCount) {
  if (!Number.isInteger(segmentCount) || segmentCount < 2) return "none";
  const segmentAngle = 360 / segmentCount;
  return `repeating-conic-gradient(from ${segmentAngle / 2}deg, #C9B183 0deg .3deg, transparent .3deg ${segmentAngle}deg)`;
}
