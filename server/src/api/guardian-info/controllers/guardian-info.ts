/**
 * guardian-info controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::guardian-info.guardian-info",
  ({}) => ({
    /// Create
    async create(ctx) {
      const { guardianName } = ctx.request.body;
      try {
        if (!guardianName) {
          throw Error("Guardian's name is required!");
        }
        ctx.body = await strapi
          .service("api::guardian-info.guardian-info")
          .createGuardianInfo(ctx.request.body);
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },

    /// Update
    async update(ctx) {
      const { id } = ctx.params;
      try {
        const updateGuardian = await strapi
          .service("api::guardian-info.guardian-info")
          .updateGuardianInfo(id, ctx.request.body);
        if (!updateGuardian) throw Error(`GuardianInfo not found!`);
        ctx.body = updateGuardian;
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },

    /// Delete
    async delete(ctx) {
      try {
        const { id } = ctx.params;
        const guardian = await strapi.db
          .query("api::guardian-info.guardian-info")
          .findOne({
            where: { id },
            populate: ["students"],
          });
        if (guardian.students.length > 1) {
          return guardian;
        }
        ctx.body = await strapi
          .service("api::guardian-info.guardian-info")
          .deleteGuardianInfo(id);
      } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = {
          message: error.message,
        };
      }
    },
  })
);
