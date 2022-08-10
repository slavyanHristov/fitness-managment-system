import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:5000/api/auth/login", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 1,
        username: "username1",
        userType: 1,
        remember: false,
        accessToken: "mocked_user_token",
      })
    );
  }),
  rest.get(
    "http://localhost:5000/api/admin/dashboard-data",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          count: 2,
          collection: [
            {
              id: 1,
              name: "Petar Kalinkov",
              position: "Fitness Instructor",
              gym: "Fit-M Varna",
              userId: 7,
              imageId: 1,
              image: {
                path: "resources/images/default-profile-pic.png",
              },
            },
            {
              id: 2,
              name: "Nikolinka Dimitrova",
              position: "Technician",
              gym: "Fit-M Sofia",
              fitness_instructor: null,
            },
            {
              id: 1,
              name: "Stoika Petrova",
              position: "Technician",
              gym: "Fit-M Varna",
              fitness_instructor: null,
            },
          ],
        })
      );
    }
  ),

  //   rest.post(
  //     "http://localhost:5000/api/register/users/admin",
  //     (req, res, ctx) => {
  //       return res(
  //         ctx.status(201),
  //         ctx.json({
  //           succes: true,
  //           message: "Successfully registered an admin!",
  //           newAdmin: {
  //             id: 16,
  //             name: "Slavyan Hristov",
  //             username: "admin_14",
  //             password:
  //               "$2b$10$5cHTMO6IcTU3A8b6D9msmuebTZa0ItoCg6NxTYfAbzdrg1/7yc3zy",
  //             email: "admin14@example.com",
  //             imageId: 1,
  //             userTypeId: 1,
  //             isFinalized: true,
  //             updatedAt: "2022-08-08T15:19:20.263Z",
  //             createdAt: "2022-08-08T15:19:20.263Z",
  //           },
  //         })
  //       );
  //     }
  //   ),
];
