export class Company {
    id: number=0;
    name: string='';
    industryType: string='';
    email: string='';
    contactNumber: string='';
    location?: string;
    website?: string;
    associatedSince?: string;
    tpoCoordinator?: string;
    active?: boolean;
  
    constructor(data: Partial<Company> = {}) {
      Object.assign(this, data);
    }
  }
  
  export class JobPost {
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
    aptitudeStartingDate:string;
    status: string='';
    aptitude:string=""
    portalLink?: string;
    constructor(data: Partial<JobPost> = {}) {
      this.id = data.id || 0;
      this.company = new Company(data.company || {}); // Ensures 'company' is always an object
      this.jobDesignation = data.jobDesignation || '';
      this.location = data.location || '';
      this.jobType = data.jobType || '';
      this.description = data.description || '';
      this.packageAmount = data.packageAmount || 0;
      this.minPercentage = data.minPercentage || 0;
      this.backlogAllowance = data.backlogAllowance || 0;
      this.preferredCourse = data.preferredCourse || '';
      this.skillRequirements = data.skillRequirements || '';
      this.selectionRounds = data.selectionRounds || '';
      this.modeOfRecruitment = data.modeOfRecruitment || '';
      this.testPlatform = data.testPlatform || '';
      this.applicationStartDate = data.applicationStartDate || '';
      this.applicationEndDate = data.applicationEndDate || '';
      this.selectionStartDate = data.selectionStartDate || '';
      this.selectionEndDate = data.selectionEndDate || '';
      this.status = data.status || '';
      this.aptitude = data.aptitude || '';
      this.aptitudeStartingDate=data.aptitudeStartingDate ||'';
      this.portalLink = data.portalLink || undefined; // Use undefined instead of null
    }
   
  }
  export class Placements {
   
  }