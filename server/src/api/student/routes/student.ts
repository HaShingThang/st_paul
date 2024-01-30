/**
 * student router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/students/:id",
      handler: "student.findOne",
      config: {
        policies: ["global::is-auth"],
        middlewares: ["global::is-auth"],
      },
    },
    {
      method: "GET",
      path: "/students",
      handler: "student.find",
      config: {
        policies: ["global::is-auth"],
        middlewares: ["global::is-auth"],
      },
    },
    {
      method: "POST",
      path: "/students",
      handler: "student.create",
      config: {
        policies: ["global::is-admin"],
        middlewares: ["global::is-admin"],
      },
    },
    {
      method: "PUT",
      path: "/students/:id",
      handler: "student.update",
      config: {
        policies: ["global::is-admin"],
        middlewares: ["global::is-admin"],
      },
    },
    {
      method: "DELETE",
      path: "/students/:id",
      handler: "student.delete",
      config: {
        policies: ["global::is-admin"],
        middlewares: ["global::is-admin"],
      },
    },
  ],
};
