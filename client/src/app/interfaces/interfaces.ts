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
  grades: string | any;
  address: string;
}

export interface Grade {
  id?: number;
  grade:
    'All'
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
    | 'Grade-11';
}
