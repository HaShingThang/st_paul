export interface Login {
  email: String;
  password: String;
}

export interface AdminData {
  id?: string | number;
  username: string;
  email: string;
  phNo?: number | string;
  role?: any;
}

export interface TeacherData extends AdminData {
  id?: number;
  grades: string | any;
  address: string;
}

export interface Subject {
  id?: number;
  subjectName: string;
  mark: number;
  remark: 'A' | 'B' | 'C' | 'D';
  marks?: Mark[];
}

export interface Exam {
  id?: number;
  examDate: Date;
  period: string;
  examTime: Date;
  mark?: Mark;
}

export interface Mark {
  id?: number;
  student?: StudentData;
  exam?: Exam;
  subjects: Subject[];
}

export interface GuardianInfo {
  id?: number;
  guardianName?: string;
  phNo?: string;
  students?: StudentData[];
}
export interface GradeData {
  id?: number;
  grade?: string;
}
export interface StudentData {
  no?: number;
  id?: number;
  name: string;
  studentId: string;
  gender: string;
  grade: GradeData;
  mark?: Mark;
  address?: string;
  guardianName?: string;
  phNo?: string;
  guardianInfo?: GuardianInfo;
  attendance?: Attendance;
  academicYear: AcademicYear;
}

export interface Grade {
  id?: number;
  grade:
    | 'All'
    | 'KG'
    | 'Grade-1'
    | 'Grade-2'
    | 'Grade-3'
    | 'Grade-4'
    | 'Grade-5'
    | 'Grade-6'
    | 'Grade-7'
    | 'Grade-8'
    | 'Grade-9'
    | 'Grade-10'
    | 'Grade-11'
    | 'Grade-12';
}

export interface AcademicYear {
  id?: number;
  startYear?: Date;
  endYear?: Date;
  students?: StudentData[];
  isActiveYear: boolean;
}

export interface Attendance {
  id?: number;
  month: Date;
  attendance: number;
  academicYear?: AcademicYear;
  student?: StudentData;
}

export interface ExamData {
  no?: number;
  id?: number;
  period?: String;
  grade?: Grade;
  examDate?: Date;
  examTime?: Date | String | any;
  description?: String;
}
