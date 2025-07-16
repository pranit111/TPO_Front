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
    academicYear!:string;
    dateOfBirth!: Date;
    gender!: Gender;
    phoneNumber!: string;
    address!: string;
    department!: string;
    sscMarks: number| null = null;
    hscMarks: number| null = null;
    diplomaMarks: number| null = null;;
    sem1Marks: number | null = null;
    sem2Marks: number | null = null;
    sem3Marks: number | null = null;
    sem4Marks: number | null = null;
    sem5Marks: number | null = null;
    sem6Marks: number | null = null;
    noOfBacklogs!: number;
    grNo!:String;
    avgMarks!:number;
    sem1KT: boolean = false;
    sem2KT: boolean = false;
    sem3KT: boolean = false;
    sem4KT: boolean = false;
    sem5KT: boolean = false;
    sem6KT: boolean = false;
    jobApplications!: JobApplication[];
    
    // Result verification fields
    resultVerified?: boolean;
    verificationRemarks?: string;
    verifiedBy?: string;
    verificationDate?: Date;
  
    constructor(data?: Partial<Student>) {
      Object.assign(this, data);
    }
  }
  