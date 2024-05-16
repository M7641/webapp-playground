import { BigSum } from "../src/utils";
import { expect, test } from "vitest";

test("BigSum", () => {
  expect(BigSum(1, 2)).toBe(3);
});
