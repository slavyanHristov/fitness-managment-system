import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import { rest } from "msw";

import userEvent from "@testing-library/user-event";
import SignInView from "@/views/SignInView.vue";
// import { useAuthStore } from "@/stores/authStore";
describe("SignInView", () => {
  it("should register an admin", async () => {
    // arrange
    // const store = useAuthStore();
    render(SignInView);
    userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "admin_12"
    );

    userEvent.type(screen.getByLabelText(/password/i), "myPass_123");
    userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    screen.debug();

    // assertion
    expect(window.localStorage.getItem("lqlq")).toBeDefined();
  });
});
