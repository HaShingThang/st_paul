/**
 * exam service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::exam.exam", ({}) => ({
  /// Get Exams
  async findExams(params) {
    if (Object.keys(params).length !== 0) {
      const where: any = {};
      if (params.grade) {
        if (params.grade == "All") {
          where.academicYear = { isActiveYear: true };
        } else {
          where.academicYear = { isActiveYear: true };
          where.grade = { grade: params.grade };
        }
      }
      if (params.examDate) {
        where.academicYear = { isActiveYear: true };
        where.examDate = params.examDate;
      }
      if (params.examTime) {
        where.academicYear = { isActiveYear: true };
        where.examTime = params.examTime;
      }
      let exams = await strapi.db.query("api::exam.exam").findMany({
        where,
        orderBy: { period: "desc", grade: { id: "asc" } },
        populate: ["marks", "academicYear", "grade"],
      });
      if (params.period) {
        console.log(params.period);
        const period = params.period;
        const searchPeriod = period.replace(/\s+/g, "").toLowerCase();
        exams = exams.filter((exam) =>
          exam.period.replace(/\s+/g, "").toLowerCase().includes(searchPeriod)
        );
      }
      return exams;
    } else {
      const exams = await strapi.db.query("api::exam.exam").findMany({
        where: {
          academicYear: {
            isActiveYear: true,
          },
        },
        orderBy: { period: "desc", grade: { id: "asc" } },
        populate: ["marks", "academicYear", "grade"],
      });
      return exams;
    }
  },

  /// Get
  async findExam(id) {
    return await strapi.db.query("api::exam.exam").findOne({
      where: { id },
      populate: ["marks", "academicYear", "grade"],
    });
  },

  /// Create Exam
  async createExam(exam) {
    return strapi.entityService.create("api::exam.exam", {
      data: {
        ...exam,
        publishedAt: new Date(),
      },
      populate: ["grade", "academicYear"],
    });
  },

  /// Update
  async updateExam(id, exam) {
    return await strapi.entityService.update("api::exam.exam", id, {
      data: {
        ...exam,
        updatedAt: new Date(),
      },
      populate: ["grade", "academicYear"],
    });
  },

  /// Delete
  async deleteExam(id) {
    const deletedExam = await strapi.query("api::exam.exam").delete({
      where: { id },
      populate: ["mark"],
    });
    return {
      message: `${deletedExam.period} has been successfully deleted.`,
    };
  },
}));
