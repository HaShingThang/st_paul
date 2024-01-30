/**
 * guardian-info service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::guardian-info.guardian-info",
  ({ strapi }) => ({
    /// Get Info
    async findGuardianInfos(params) {
      if (Object.keys(params).length !== 0) {
      } else {
        return await strapi.db
          .query("api::guardian-info.guardian-info")
          .findMany({
            populate: ["students"],
            orderBy: { id: "asc" },
          });
      }
    },

    /// Create Info
    async createGuardianInfo(info) {
      let guardianInfo;
      const where: any = {};
      if (info.phNo) {
        where.phNo = info.phNo;
      }
      where.guardianName = info.guardianName;
      const existingInfo = await strapi.db
        .query("api::guardian-info.guardian-info")
        .findOne({
          where,
        });

      if (existingInfo) {
        guardianInfo = existingInfo.id;
      } else {
        const createInfo = await strapi.entityService.create(
          "api::guardian-info.guardian-info",
          {
            data: {
              guardianName: info.guardianName,
              phNo: info.phNo,
              publishedAt: new Date(),
            },
          }
        );
        guardianInfo = createInfo.id;
      }

      return guardianInfo;
    },

    /// Delete
    async deleteGuardianInfo(id) {
      return await strapi.db
        .query("api::guardian-info.guardian-info")
        .delete({ where: { id } });
    },

    /// Update
    async updateGuardianInfo(id, info) {
      let guardianInfo;
      const where: any = {};
      if (info.phNo) {
        where.phNo = info.phNo;
      }
      where.guardianName = info.guardianName;
      const existingInfo = await strapi.db
        .query("api::guardian-info.guardian-info")
        .findOne({
          where: { ...where },
        });

      if (existingInfo) {
        guardianInfo = existingInfo.id;
      } else {
        const createInfo = await strapi.entityService.update(
          "api::guardian-info.guardian-info",
          id,
          {
            data: {
              ...info,
              updatedAt: new Date(),
            },
          }
        );
        guardianInfo = createInfo.id;
      }
      return guardianInfo;
    },
  })
);
