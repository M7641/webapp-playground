import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import ClientSideComponent from "../../src/components/ClientSide.tsx";
import React from "react";

describe("ClientSideComponent", () => {
  test("renders ClientSideComponent", () => {
    render(<ClientSideComponent />);
    expect(screen.getByText("Client Side Rendering")).toBeTruthy();
  });
});
