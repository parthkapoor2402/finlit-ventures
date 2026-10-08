import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextField } from "@/components/ui/TextField";

describe("TextField", () => {
  it("connects the label and the error to the input", () => {
    render(<TextField label="Title" error="Add a title." name="title" />);
    const input = screen.getByLabelText("Title");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Add a title.");
  });
});
