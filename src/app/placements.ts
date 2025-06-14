interface Pagination {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: Sort;
  }
  
  interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  }
  
  interface User {
    id: number;
    username: string;
    email: string;
    role: string;
  }
  
  interface Student {
    id: number;
    user: User;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    address: string;
    department: string;
    sscMarks: number;
    hscMarks: number;
    diplomaMarks: number;
    sem1Marks: number;
    sem2Marks: number;
    sem3Marks: number;
    sem4Marks: number;
    sem5Marks: number;
    sem6Marks: number;
    noOfBacklogs: number;
    avgMarks: number;
    profileImageBase64: string | null;
    academicYear: string;
    sem1KT: boolean;
    sem2KT: boolean;
    sem3KT: boolean;
    sem4KT: boolean;
    sem5KT: boolean;
    sem6KT: boolean;
    yearOfPassing: number;
    result_verified: boolean;
    gr_No: string;
  }
  
  interface Company {
    id: number;
    name: string;
    hr_Name: string;
    industryType: string;
    email: string;
    contactNumber: string;
    location: string;
    website: string | null;
    associatedSince: string | null;
    tpoCoordinator: string | null;
    active: boolean;
    mnc: boolean;
  }
  
  interface JobPost {
    id: number;
    company: Company;
    jobDesignation: string;
    location: string;
    jobType: string;
    description: string;
    packageAmount: number;
    minPercentage: number;
    backlogAllowance: number;
    preferredCourse: string;
    skillRequirements: string;
    selectionRounds: string;
    modeOfRecruitment: string;
    testPlatform: string;
    applicationStartDate: string;
    applicationEndDate: string;
    selectionStartDate: string;
    selectionEndDate: string;
    aptitudeDate: string | null;
    status: string;
    aptitude: boolean;
    portalLink: string | null;
    applicationStatus: string | null;
  }
  
  interface Application {
    id: number;
    student: Student;
    jobPost: JobPost;
    applicationDate: string;
    status: string;
    designation: string;
    interviewTime: string | null;
    interviewLocation: string | null;
    interviewDate: string;
    feedback: string;
  }
  
  interface ContentItem {
    id: number;
    application: Application;
    placementDate: string;
    offerLetterUrl: string;
    placedPackage: number;
    remarks: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface PaginatedResponse {
    content: ContentItem[];
    pageable: Pagination;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    empty: boolean;
  }
  