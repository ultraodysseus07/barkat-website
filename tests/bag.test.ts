import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeBag, addItems } from "../lib/bag.ts";
test("untrusted storage rejects malformed entries and unknown products", () => {
  assert.deepEqual(
    sanitizeBag(
      [["wax", 2], ["unknown", 9], ["vessel", -1], null, ["wax", 100]],
      ["wax", "vessel"],
    ),
    { wax: 2 },
  );
  assert.deepEqual(sanitizeBag(null, ["wax"]), {});
  assert.deepEqual(sanitizeBag({ wax: "2" }, ["wax"]), {});
});
test("bundle adds both IDs atomically and quantities cap at 99", () => {
  assert.deepEqual(
    addItems(
      { wax: 98 },
      [
        { id: "wax", quantity: 3 },
        { id: "vessel", quantity: 1 },
      ],
      ["wax", "vessel"],
    ),
    { wax: 99, vessel: 1 },
  );
});
