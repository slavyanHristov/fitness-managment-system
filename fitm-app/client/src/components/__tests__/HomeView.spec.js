import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
// import testing-library
import HomeView from "@/views/HomeView.vue";

describe("HomeView", () => {
  it("renders properly", async () => {
    // arrange
    const viewText = "Reasons to join us";
    render(HomeView);
    const view = await screen.findByText(viewText);
    // assertion
    expect(view.innerHTML).toContain(viewText);
  });
});
