/**
 * grade service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::grade.grade",
  ({ strapi }) => ({
    async findGrades(params) {
      if (Object.keys(params).length !== 0) {
      } else {
        return await strapi.db.query("api::grade.grade").findMany({
          populate: [""],
          orderBy: { id: "asc" },
        });
      }
    },
  })
);
