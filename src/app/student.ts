export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other'
  }
  
  export class JobApplication {
    id!: number;
    jobTitle!: string;
    companyName!: string;
    applicationDate!: Date;
    status!: string;
  }
  
  export class Student {
    id!: number;
    userId!: number;
    firstName!: string;
    middleName?: string;
    lastName!: string;
    email!:string;
    academicyear!:string;
    dateOfBirth!: Date;
    gender!: Gender;
    phoneNumber!: string;
    address!: string;
    department!: string;
    sscMarks!: number;
    hscMarks!: number;
    diplomaMarks!: number;
    sem1Marks!: number;
    sem2Marks!: number;
    sem3Marks!: number;
    sem4Marks!: number;
    sem5Marks!: number;
    sem6Marks!: number;
    noOfBacklogs!: number;
    gr_No!:String;
    avgMarks!:number;
    jobApplications!: JobApplication[];
  
    constructor(data?: Partial<Student>) {
      Object.assign(this, data);
    }
  }
  