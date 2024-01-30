/**
 * academic-year service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::academic-year.academic-year",
  ({ strapi }) => ({
    /// Get All
    async findAllAcademicYear(params) {
      if (Object.keys(params).length !== 0) {
      } else {
        return await strapi.db
          .query("api::academic-year.academic-year")
          .findMany({
            populate: ["students"],
            orderBy: [{ isActiveYear: "desc" }, { id: "desc" }],
          });
      }
    },

    /// Get
    async findAcademicYear(id) {
      return strapi.entityService.findOne(
        "api::academic-year.academic-year",
        id
      );
    },

    /// Create
    async createAcademicYear(academicYear) {
      return strapi.entityService.create("api::academic-year.academic-year", {
        data: {
          ...academicYear,
          publishedAt: new Date(),
        },
        populate: ["students"],
      });
    },

    /// Update
    async updateAcademicYear(id, isActiveYear) {
      return strapi.entityService.update(
        "api::academic-year.academic-year",
        id,
        {
          data: {
            isActiveYear,
            updatedAt: new Date(),
          },
          populate: ["students"],
        }
      );
    },
  })
);
