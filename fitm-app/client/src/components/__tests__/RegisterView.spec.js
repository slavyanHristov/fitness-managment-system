import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import RegisterView from "@/views/RegisterView.vue";
// import { useAuthStore } from "@/stores/authStore";
describe("RegisterView", () => {
  it("should register an admin", async () => {
    // arrange
    // const store = useAuthStore();
    render(RegisterView);
    userEvent.type(
      screen.getByRole(
        "textbox",
        {
          name: /full name/i,
        },
        "Ivan Petrov"
      )
    );
    userEvent.type(
      screen.getByRole("textbox", {
        name: /username/i,
      }),
      "asdsa_15"
    );

    // userEvent.click(
    //   screen.getByRole("button", {
    //     name: /sign up/i,
    //   })
    // );
    const view = await screen.findByText(
      "Successfully registered an admin!",
      {},
      { timeout: 3000 }
    );

    expect(view.innerHTML).toContain("Successfully registered an admin!");
    screen.debug();

    // assertion
    // expect(window.localStorage.getItem("user")).toBeDefined();
  });
});
