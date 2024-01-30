/**
 * exam controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::exam.exam", ({}) => ({
  /// Get Exams
  async find(ctx) {
    try {
      const { grade, period, examDate, examTime } = ctx.request.query;
      const params: { [key: string]: any } = {};
      if (grade) params.grade = grade;
      if (period) params.period = period;
      if (examDate) params.examDate = examDate;
      if (examTime) params.examTime = examTime;
      const exams = await strapi.service("api::exam.exam").findExams(params);
      ctx.body = exams;
    } catch (error) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: error.message,
      };
    }
  },

  /// Fine One
  async findOne(ctx) {
    const { id } = ctx.params;
    try {
      const exam = await strapi.service("api::exam.exam").findExam(id);
      if (!exam) throw Error(`Exam not found!`);
      ctx.body = exam;
    } catch (error) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: error.message,
      };
    }
  },

  /// Create Exam
  async create(ctx) {
    const { examDate, period, examTime, academicYear, grade } =
      ctx.request.body;
    try {
      if (!examDate) {
        throw Error("Exam date is required!");
      }
      if (!examTime) {
        throw Error("Exam time is required!");
      }
      if (!academicYear) {
        throw Error("Academic Year is required!");
      }
      if (!grade) {
        throw Error("Grade is required!");
      }
      const existingExam = await strapi.query("api::exam.exam").findOne({
        where: {
          period,
          academicYear: { isActiveYear: true },
          grade,
        },
        populate: ["academicYear", "grade"],
      });
      if (existingExam) {
        throw new Error(
          `${period} is already exist in ${existingExam.grade.grade}!`
        );
      }
      const existingExamDate = await strapi.query("api::exam.exam").findOne({
        where: {
          academicYear: { isActiveYear: true },
          examDate: {
            $eq: examDate,
          },
          grade: {
            id: {
              $eq: grade,
            },
          },
        },
        populate: ["academicYear", "grade"],
      });
      if (existingExamDate) {
        throw new Error(
          `Exam Date (${examDate}) is already exist in ${existingExamDate.grade.grade}'s ${existingExamDate.period}!`
        );
      }
      ctx.body = await strapi
        .service("api::exam.exam")
        .createExam(ctx.request.body);
    } catch (error) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: error.message,
      };
    }
  },

  /// Create
  async update(ctx) {
    const { id } = ctx.params;
    const { examDate, period, examTime, academicYear, grade } =
      ctx.request.body;
    try {
      if (!examDate) {
        throw Error("Exam date is required!");
      }
      if (!examTime) {
        throw Error("Exam time is required!");
      }
      if (!academicYear) {
        throw Error("Academic Year is required!");
      }
      if (!grade) {
        throw Error("Grade is required!");
      }
      const existingExam = await strapi.query("api::exam.exam").findOne({
        where: {
          id: {
            $ne: id,
          },
          period,
          academicYear: { isActiveYear: true },
          grade,
        },
        populate: ["academicYear", "grade"],
      });
      if (existingExam) {
        throw new Error(
          `${period} is already exist in ${existingExam.grade.grade}!`
        );
      }
      const existingExamDate = await strapi.query("api::exam.exam").findOne({
        where: {
          id: {
            $ne: id,
          },
          academicYear: { isActiveYear: true },
          examDate: {
            $eq: examDate,
          },
          grade: {
            id: {
              $eq: grade,
            },
          },
        },
        populate: ["academicYear", "grade"],
      });
      if (existingExamDate) {
        throw new Error(
          `Exam Date (${examDate}) is already exist in ${existingExamDate.grade.grade}'s ${existingExamDate.period}!`
        );
      }

      ctx.body = await strapi
        .service("api::exam.exam")
        .updateExam(id, ctx.request.body);
    } catch (error) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: error.message,
      };
    }
  },

  /// Delete
  async delete(ctx) {
    const { id } = ctx.params;
    try {
      const exam = await strapi.db.query("api::exam.exam").findOne({
        where: { id },
      });
      if (!exam) {
        throw Error("Exam not found!");
      }
      ctx.body = await strapi
        .service("api::exam.exam")
        .deleteExam(ctx.request.body);
    } catch (error) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: error.message,
      };
    }
  },
}));
