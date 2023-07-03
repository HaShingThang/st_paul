import bcrypt from "bcrypt";

export default (plugin: any) => {
  /// Login
  plugin.controllers.auth.callback = async (ctx) => {
    const { email, password, role } = ctx.request.body;
    try {
      let user;
      if (role == "Admin") {
        user = await strapi.query("plugin::users-permissions.user").findOne({
          where: {
            email,
            role: {
              name: {
                $ne: "Teacher",
              },
            },
            deletedAt: null,
          },
          populate: ["role"],
        });
      } else if (role == "Teacher") {
        user = await strapi.query("plugin::users-permissions.user").findOne({
          where: {
            email,
            role: {
              name: {
                $eq: "Teacher",
              },
            },
            deletedAt: null,
          },
          populate: ["role"],
        });
      }
      if (!user) throw Error("Invalid email or password!");
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw Error("Invalid email or password!");
      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
        username: user.username,
        email: user.email,
        phNo: user.phNo,
        role: user.role,
      });
      return {
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  /// Get
  plugin.controllers.user.findOne = async (ctx) => {
    const { id } = ctx.params;
    try {
      if (isNaN(id)) {
        throw Error("No result found!");
      }
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: +id,
            role: {
              name: {
                $ne: "Teacher",
              },
            },
            deletedAt: null,
          },
          populate: ["role"],
        });
      if (!user) {
        throw Error("No result found!");
      }
      return user;
    } catch (error) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  /// Get All
  plugin.controllers.user.find = async (ctx) => {
    try {
      const { username } = ctx.request.query;
      let users = await strapi
        .query("plugin::users-permissions.user")
        .findMany({
          orderBy: { id: "asc" },
          where: {
            role: {
              name: {
                $ne: "Teacher",
              },
            },
            deletedAt: null,
          },
          populate: ["role"],
        });
      if (username) {
        const searchUsername = username.replace(/\s+/g, "").toLowerCase();
        users = users.filter((user) =>
          user.username
            .replace(/\s+/g, "")
            .toLowerCase()
            .includes(searchUsername)
        );
      }
      return users;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  /// Delete
  plugin.controllers.user.destroy = async (ctx) => {
    const { id } = ctx.params;
    const { role } = ctx.request.query;
    try {
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id },
        });
      if (!user) {
        if (role == "Admin") {
          throw Error("Admin not found!");
        } else {
          throw Error("Already deleted!");
        }
      }
      if (role == "SuperAdmin") {
        throw Error("This is super admin account, you can't delete.");
      }
      const deletedUser = await strapi
        .query("plugin::users-permissions.user")
        .delete({
          where: { id },
        });
      return {
        message: `${deletedUser.username} has been successfully deleted.`,
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  /// Create
  plugin.controllers.user.create = async (ctx) => {
    const { username, email, password, phNo, role } = ctx.request.body;
    console.log(ctx.request.body);
    try {
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });
      if (user) throw Error("This email is already exist.");
      if (!username) throw Error("Required username.");
      if (!email) throw Error("Required email.");
      if (!password || password.length < 5)
        throw Error("Password must be grather than 6.");
      if (phNo) {
        if (phNo.length < 8 || phNo.length > 11) {
          throw Error("Phone number must be between 8 and 11 digits");
        }
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      if (!role) throw Error("Required role.");
      if (role === 1) {
        return await strapi.query("plugin::users-permissions.user").create({
          data: {
            username,
            email,
            password: hashedPassword,
            phNo,
            role: +role,
            grades: {
              connect: [1],
            },
            confirmed: true,
          },
          populate: ["role", "grades"],
        });
      } else if (role === 2) {
        return await strapi.query("plugin::users-permissions.user").create({
          data: {
            username,
            email,
            password: hashedPassword,
            phNo,
            role: +role,
            grades: {
              connect: [1],
            },
            confirmed: true,
          },
          populate: ["role", "grades"],
        });
      }
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  /// Update
  plugin.controllers.user.update = async (ctx) => {
    const { username, email, phNo, role, newPassword, currentPassword } =
      ctx.request.body;
    const { id } = ctx.params;
    try {
      let updatedUser;
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: +id },
          populate: ["role"],
        });
      if (!user) throw Error("No result found!.");
      if (!username) throw Error("Required username.");
      if (!email) throw Error("Required email.");
      if (!role) throw Error("Required role.");
      if (phNo) {
        if (phNo.length < 8 || phNo.length > 11) {
          throw Error("Phone number must be between 8 and 11 digits");
        }
      }
      const emailExist = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: {
              $ne: +id,
            },
            email,
          },
        });
      if (emailExist) throw Error("This email is already exist.");
      if (newPassword && currentPassword) {
        const isPasswordValid = await strapi.plugins[
          "users-permissions"
        ].services.user.validatePassword(currentPassword, user.password);

        if (!isPasswordValid) throw Error("Current password is incorrect.");

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        let updateData = {
          username,
          email,
          password: hashedPassword,
          role: +role,
        };

        updatedUser = await strapi
          .query("plugin::users-permissions.user")
          .update({
            where: { id: +id },
            data: {
              ...updateData,
            },
            populate: ["role"],
          });
      } else {
        updatedUser = await strapi
          .query("plugin::users-permissions.user")
          .update({
            where: { id: +id },
            data: {
              ...ctx.request.body,
            },
            populate: ["role"],
          });
      }

      return updatedUser;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  //============= Teacher CRUD =========================

  /// Get Teachers
  plugin.controllers.user.getTeachers = async (ctx) => {
    try {
      const { username } = ctx.request.query;
      let users = await strapi
        .query("plugin::users-permissions.user")
        .findMany({
          orderBy: { id: "asc" },
          where: {
            role: {
              name: {
                $eq: "Teacher",
              },
            },
            deletedAt: null,
          },
          populate: ["role", "grades"],
        });
      if (username) {
        const searchUsername = username.replace(/\s+/g, "").toLowerCase();
        users = users.filter((user) =>
          user.username
            .replace(/\s+/g, "")
            .toLowerCase()
            .includes(searchUsername)
        );
      }
      return users;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  /// Get Teacher
  plugin.controllers.user.getTeacher = async (ctx) => {
    const { id } = ctx.params;
    try {
      if (isNaN(id)) {
        throw Error("No result found!");
      }
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: +id,
            role: {
              name: {
                $eq: "Teacher",
              },
            },
            deletedAt: null,
          },
          populate: ["role", "grades"],
        });
      if (!user) {
        throw Error("No result found!");
      }
      return user;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  /// Create Teacher
  plugin.controllers.user.createTeacher = async (ctx) => {
    const { username, email, password, grades, address, phNo, role } =
      ctx.request.body;
    try {
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });
      if (user) throw Error("This email already exists.");
      if (!username) throw Error("Username is required.");
      if (!email) throw Error("Email is required.");
      if (!password || password.length < 6)
        throw Error("Password must be at least 6 characters long.");
      if (phNo && (phNo.length < 8 || phNo.length > 11)) {
        throw Error("Phone number must be between 8 and 11 digits.");
      }
      if (!role || role !== 3) throw Error("Role is required.");

      const hashedPassword = bcrypt.hashSync(password, 10);

      return await strapi.query("plugin::users-permissions.user").create({
        data: {
          username,
          email,
          password: hashedPassword,
          grades: {
            connect: grades,
          },
          address,
          phNo,
          role: +role,
          confirmed: true,
        },
        populate: ["role", "grades"],
      });
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  //Update Teacher
  plugin.controllers.user.updateTeacher = async (ctx) => {
    const {
      username,
      email,
      grades,
      address,
      phNo,
      role,
      newPassword,
      currentPassword,
    } = ctx.request.body;
    const { id } = ctx.params;
    try {
      let updatedTeacher;
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: +id,
            role: {
              name: {
                $eq: "Teacher",
              },
            },
          },
          populate: ["role"],
        });
      if (!user) throw Error("No result found!.");
      if (!username) throw Error("Required username.");
      if (!email) throw Error("Required email.");
      if (!role) throw Error("Required role.");
      if (phNo) {
        if (phNo.length < 8 || phNo.length > 11) {
          throw Error("Phone number must be between 8 and 11 digits");
        }
      }
      const emailExist = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: {
              $ne: +id,
            },
            email,
          },
        });
      if (emailExist) throw Error("This email is already exist.");
      if (newPassword && currentPassword) {
        const isPasswordValid = await strapi.plugins[
          "users-permissions"
        ].services.user.validatePassword(currentPassword, user.password);

        if (!isPasswordValid) throw Error("Current password is incorrect.");

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        let updateData = {
          username,
          email,
          grades: {
            set: grades,
          },
          address,
          password: hashedPassword,
          phNo,
          role: +role,
        };

        updatedTeacher = await strapi
          .query("plugin::users-permissions.user")
          .update({
            where: { id: +id },
            data: {
              ...updateData,
            },
            populate: ["role", "grades"],
          });
      } else {
        let updateData = {
          username,
          email,
          grades: {
            set: grades,
          },
          address,
          phNo,
          role: +role,
        };
        updatedTeacher = await strapi
          .query("plugin::users-permissions.user")
          .update({
            where: { id: +id },
            data: {
              ...updateData,
            },
            populate: ["role", "grades"],
          });
      }
      return updatedTeacher;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  //Delete Teacher
  plugin.controllers.user.deleteTeacher = async (ctx) => {
    const { id } = ctx.params;
    try {
      const teacher = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            role: {
              name: {
                $eq: "Teacher",
              },
            },
            id,
          },
        });
      if (!teacher) throw Error("Teacher not found!");
      const deletedTeacher = await strapi
        .query("plugin::users-permissions.user")
        .delete({
          where: { id },
        });
      return {
        message: `${deletedTeacher.username} has been successfully deleted.`,
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: error.message,
      };
    }
  };

  plugin.routes["content-api"].routes.push(
    {
      method: "POST",
      path: "/auth/local",
      handler: "auth.callback",
    },
    {
      method: "GET",
      path: "/users",
      handler: "user.find",
      config: {
        policies: ["global::is-admin"],
      },
    },
    {
      method: "DELETE",
      path: "/users",
      handler: "user.destroy",
      config: {
        policies: ["global::is-super-admin"],
      },
    },
    {
      method: "POST",
      path: "/users",
      handler: "user.create",
      config: {
        policies: ["global::is-super-admin"],
      },
    },
    {
      method: "GET",
      path: "/users/:id",
      handler: "user.findOne",
      config: {
        policies: ["global::is-admin"],
      },
    },
    {
      method: "PUT",
      path: "/users/:id",
      handler: "user.update",
      config: {
        policies: ["global::is-super-admin"],
      },
    },
    /// ============== Teacher ==================
    {
      method: "GET",
      path: "/teachers",
      handler: "user.getTeachers",
      config: {
        policies: ["global::is-auth"],
      },
    },
    {
      method: "GET",
      path: "/teachers/:id",
      handler: "user.getTeacher",
      config: {
        policies: ["global::is-auth"],
      },
    },
    {
      method: "POST",
      path: "/teachers",
      handler: "user.createTeacher",
      config: {
        policies: ["global::is-admin"],
      },
    },
    {
      method: "PUT",
      path: "/teachers/:id",
      handler: "user.updateTeacher",
      config: {
        policies: ["global::is-admin"],
      },
    },
    {
      method: "DELETE",
      path: "/teachers/:id",
      handler: "user.deleteTeacher",
      config: {
        policies: ["global::is-admin"],
      },
    }
  );

  return plugin;
};
