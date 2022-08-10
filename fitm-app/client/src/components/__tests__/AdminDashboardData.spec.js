import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
// import testing-library
import AdminDashboard from "@/views/admin/AdminDashboard.vue";

describe("AdminDashboard", () => {
  it("renders properly", async () => {
    // arrange

    render(AdminDashboard);
    const view = await screen.findByText("Petar Kalinkov");
    screen.debug();
    // assertion
    expect(view.innerHTML).toContain("Petar Kalinkov");
  });
});
