import { randomBytes, scryptSync } from "node:crypto";

const staffId = String(process.argv[2] || "staff").trim();
if (!/^[A-Za-z0-9._-]{2,40}$/.test(staffId)) {
  console.error("Staff ID must be 2-40 characters using letters, numbers, dot, underscore or dash.");
  process.exit(1);
}

const password = [
  "Mn",
  randomBytes(8).toString("base64url"),
  randomBytes(5).toString("hex"),
  "!",
].join("-");
const salt = randomBytes(16);
const credential = {
  id: staffId,
  salt: salt.toString("base64url"),
  hash: scryptSync(password, salt, 32).toString("base64url"),
};

console.log(`Temporary password for ${staffId}: ${password}`);
console.log("Set REDEEM_STAFF_USERS to:");
console.log(JSON.stringify([credential]));
console.log("Store the password securely. It cannot be recovered from the configured hash.");
