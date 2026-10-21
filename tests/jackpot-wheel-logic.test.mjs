import assert from "node:assert/strict";
import test from "node:test";
import {
  buildWheelFaceGradient,
  buildWheelTicketSegments,
  calculateWheelStopAngle,
  chooseWinnerSegmentIndex,
} from "../components/jackpot/wheel-logic.mjs";

function participant(id, ticketCount = 1, eligible = true) {
  return { id, customer_name: `Preview Guest ${id}`, ticket_count: ticketCount, eligible };
}

function draw(id, prizeId, participantId, status = "confirmed") {
  return { id, prize_id: prizeId, participant_id: participantId, status };
}

test("24 eligible members with 29 tickets produce 29 interleaved wheel segments", () => {
  const participants = Array.from({ length: 24 }, (_, index) => participant(`p${index + 1}`, index < 5 ? 2 : 1));
  const segments = buildWheelTicketSegments(
    participants,
    [],
    { allow_multiple_wins: false },
    { id: "prize-current", allow_previous_winner: false },
  );

  assert.equal(participants.length, 24);
  assert.equal(participants.reduce((total, entry) => total + entry.ticket_count, 0), 29);
  assert.equal(segments.length, 29);

  for (const entry of participants.filter((candidate) => candidate.ticket_count === 2)) {
    const indexes = segments.flatMap((segment, index) => segment.participantId === entry.id ? [index] : []);
    assert.equal(indexes.length, 2, `${entry.id} must have two segments`);
    const circularDistance = Math.min(indexes[1] - indexes[0], segments.length - (indexes[1] - indexes[0]));
    assert.ok(circularDistance > 1, `${entry.id}'s tickets must not be adjacent`);
  }
});

test("displayed ticket eligibility matches same-prize and repeat-winner server exclusions", () => {
  const participants = [
    participant("same-prize", 2),
    participant("prior-confirmed"),
    participant("other-pending"),
    participant("other-unreachable"),
    participant("ineligible", 4, false),
    participant("zero-ticket", 0),
  ];
  const draws = [
    draw("voided-same-prize", "prize-current", "same-prize", "voided"),
    draw("confirmed-other-prize", "prize-old", "prior-confirmed", "confirmed"),
    draw("pending-other-prize", "prize-old", "other-pending", "pending"),
    draw("unreachable-other-prize", "prize-old", "other-unreachable", "unreachable"),
  ];
  const prize = { id: "prize-current", allow_previous_winner: false };
  const excludedPool = buildWheelTicketSegments(participants, draws, { allow_multiple_wins: false }, prize);

  assert.deepEqual([...new Set(excludedPool.map((segment) => segment.participantId))], [
    "other-pending",
    "other-unreachable",
  ]);

  const campaignRepeatPool = buildWheelTicketSegments(participants, draws, { allow_multiple_wins: true }, prize);
  assert.ok(campaignRepeatPool.some((segment) => segment.participantId === "prior-confirmed"));
  assert.ok(!campaignRepeatPool.some((segment) => segment.participantId === "same-prize"));

  const prizeRepeatPool = buildWheelTicketSegments(
    participants,
    draws,
    { allow_multiple_wins: false },
    { ...prize, allow_previous_winner: true },
  );
  assert.ok(prizeRepeatPool.some((segment) => segment.participantId === "prior-confirmed"));
});

test("reloaded pending draw reconstructs its pre-draw pool by ignoring only that open draw", () => {
  const participants = [participant("winner"), participant("another")];
  const pool = buildWheelTicketSegments(
    participants,
    [draw("open-draw", "prize-current", "winner", "pending")],
    { allow_multiple_wins: false },
    { id: "prize-current", allow_previous_winner: false },
    "open-draw",
  );

  assert.deepEqual(pool.map((segment) => segment.participantId), ["winner", "another"]);
});

test("winner segment selection stays within that participant's ticket positions", () => {
  const participants = [participant("two-tickets", 2), participant("one-ticket")];
  const segments = buildWheelTicketSegments(
    participants,
    [],
    { allow_multiple_wins: false },
    { id: "prize-current", allow_previous_winner: false },
  );

  assert.equal(chooseWinnerSegmentIndex(segments, "two-tickets", () => 0), 0);
  assert.equal(chooseWinnerSegmentIndex(segments, "two-tickets", () => 1), 2);
  assert.equal(chooseWinnerSegmentIndex(segments, "missing", () => 0.5), -1);
});

test("every wheel segment can stop under the top pointer, with jitter inside its own segment", () => {
  for (const segmentCount of [29, 28, 2, 1]) {
    const segmentAngle = 360 / segmentCount;
    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex += 1) {
      const centeredStop = calculateWheelStopAngle(segmentIndex, segmentCount, () => 0.5);
      const centerModulo = ((segmentIndex * segmentAngle + centeredStop) % 360 + 360) % 360;
      assert.ok(Math.min(centerModulo, 360 - centerModulo) < 1e-8, `segment ${segmentIndex}/${segmentCount}`);

      for (const randomValue of [0, 1]) {
        const jitteredStop = calculateWheelStopAngle(segmentIndex, segmentCount, () => randomValue);
        const offsetModulo = ((segmentIndex * segmentAngle + jitteredStop) % 360 + 360) % 360;
        const offset = Math.min(offsetModulo, 360 - offsetModulo);
        assert.ok(offset <= segmentAngle * 0.15 + 1e-8, `jitter escaped segment ${segmentIndex}/${segmentCount}`);
      }
    }
  }
});

test("odd wheel uses a third final color so the circular neighbors differ", () => {
  const gradient = buildWheelFaceGradient(5);
  assert.match(gradient, /#FFFFFF 0deg 72deg/);
  assert.match(gradient, /#F8E8EB 72deg 144deg/);
  assert.match(gradient, /#EBCFD5 288deg 360deg/);
});
