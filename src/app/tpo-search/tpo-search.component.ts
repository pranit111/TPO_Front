import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { ApplicationserviceService } from '../applicationservice.service';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { Placements } from '../job-post';
import { PlacementServiceService } from '../placement-service.service';

interface PaginatedResponse<T> {
  content: T[];
  pageable?: any;
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

interface Post {
  id: number;
  company: {
    id: number;
    name: string;
    industryType: string;
    email: string;
    contactNumber: string;
    location: string | null;
    website: string | null;
    associatedSince: string | null;
    tpoCoordinator: string | null;
    active: boolean | null;
  };
  jobDesignation: string;
  location: string;
  jobType: string;
  description: string;
  packageAmount: number;
  minPercentage: number;
  backlogAllowance: number;
  preferredCourse: string;
  studentYear?: string;
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
  applicationStatus: string | null;
}

// Using the Application interface from the service
type Application = {
  id: number;
  applicationDate: string;
  designation: string;
  feedback: string | null;
  interviewDate: string | null;
  interviewTime: string | null;
  interviewLocation: string | null;
  jobPost: {
    id: number;
    company: {
      id: number;
      name: string;
      industry: string;
    };
  };
  status: string;
  student: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
    academicYear: string;
    address: string;
    avgMarks: number;
    dateOfBirth: string;
    department: string;
    diplomaMarks: number;
    firstName: string;
    gender: string;
    gr_No: string | null;
    hscMarks: number;
    lastName: string;
    middleName: string;
    noOfBacklogs: number;
    phoneNumber: string;
    profileImageBase64: string | null;
    sem1Marks: number;
    sem2Marks: number;
    sem3Marks: number;
    sem4Marks: number;
  };
};

// Interface for Placement DTO based on the controller
interface PlacementDTO {
  id: number;
  placementDate: string;
  offerLetterUrl: string;
  placedPackage: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  application: {
    id: number;
    applicationDate: string;
    status: string;
    designation: string;
    interviewDate: string;
    feedback: string;
    student: {
      id: number;
      firstName: string;
      middleName: string;
      lastName: string;
      department: string;
      user: {
        email: string;
      };
    };
    jobPost: {
      id: number;
      jobDesignation: string;
      packageAmount: number;
      company: {
        id: number;
        name: string;
      };
    };
  };
}

@Component({
  selector: 'app-tpo-search',
  standalone: false,
  templateUrl: './tpo-search.component.html',
  styleUrl: './tpo-search.component.css'
})
export class TpoSearchComponent implements OnInit {
onResume(arg0: number) {

window.open(`/download/cv/${arg0}/ignore`, '_blank');
}
onResult(type: string, arg0: number) {  
  window.open(`/download/result/${arg0}/${type}`, '_blank');
}
onOfferLetter(arg0: number) {
  window.open(`/download/offerletter/${arg0}/download`, '_blank');
}
selectedstudent: Student = new Student(); 
showStudentActionModal = false;
showVerificationModal = false;
verificationForm = {
  studentId: 0,
  verified: false,
  remarks: ''
};
notification = {
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
};

OnStudentAction(id:number){
  this.showStudentActionModal = true;
  this.selectedstudent = this.students.find((student) => student.id === id) || new Student();
  
  // Fetch the latest verification status
  this.studentService.getStudentVerificationStatus(id).subscribe({
    next: (verificationData) => {
      if (this.selectedstudent) {
        this.selectedstudent.resultVerified = verificationData.verified;
        this.selectedstudent.verificationRemarks = verificationData.remarks;
        this.selectedstudent.verifiedBy = verificationData.verifiedBy;
        this.selectedstudent.verificationDate = verificationData.verificationDate;
      }
    },
    error: (error) => {
      console.error('Error fetching verification status:', error);
      // Handle error silently or show notification
    }
  });
}

// Verification methods
onVerifyResults(studentId: number) {
  this.verificationForm.studentId = studentId;
  this.verificationForm.verified = true;
  this.verificationForm.remarks = '';
  this.showVerificationModal = true;
  this.showStudentActionModal = false;
}

onUnverifyResults(studentId: number) {
  this.verificationForm.studentId = studentId;
  this.verificationForm.verified = false;
  this.verificationForm.remarks = '';
  this.showVerificationModal = true;
  this.showStudentActionModal = false;
}

submitVerification() {
  this.studentService.verifyStudentResults(
    this.verificationForm.studentId,
    this.verificationForm.verified,
    this.verificationForm.remarks
  ).subscribe({
    next: (response) => {
      console.log('Verification updated successfully', response);
      this.showVerificationModal = false;
      this.showNotification(
        `Student results ${this.verificationForm.verified ? 'verified' : 'unverified'} successfully!`,
        'success'
      );
      this.loadStudents(); // Refresh the student list
    },
    error: (error) => {
      console.error('Error updating verification:', error);
      this.showNotification(
        `Error ${this.verificationForm.verified ? 'verifying' : 'unverifying'} student results. Please try again.`,
        'error'
      );
    }
  });
}

showNotification(message: string, type: 'success' | 'error') {
  this.notification = { show: true, message, type };
  // Auto-hide notification after 5 seconds
  setTimeout(() => {
    this.notification.show = false;
  }, 5000);
}

closeVerificationModal() {
  this.showVerificationModal = false;
  this.verificationForm = {
    studentId: 0,
    verified: false,
    remarks: ''
  };
}

// Active tab tracking
  activeTab: 'students' | 'posts' | 'applications'| 'placements' = 'students';

  // Student section properties
  students: Student[] = [];
  departments = ['CSE', 'DS', 'AIML', 'CIVIL', 'ECE'];
  academicYears = ['FE', 'SE', 'TE', 'BE'];
  passingYears = ['2024', '2025', '2026', '2027'];
  avgMarks = [60, 65, 70, 75, 80, 85, 90, 95, 100];
  filters = {
    firstName: '',
    department: '',
    academicYear: '',
    minAvgMarks: undefined as number | undefined,
    maxAvgMarks: undefined as number | undefined,
    yearOfPassing: undefined as number | undefined,
    page: 0,
    size: 10
  };

  // Student pagination properties
  studentPagination = {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
    first: true,
    last: true
  };

  // Post section properties
  posts: Post[] = [];
  companies: { id: number; name: string }[] = [];
  postFilters = {
    status: '',
    company: '',
    position: '',
    jobType: '',
    minSalary: undefined as number | undefined,
    maxSalary: undefined as number | undefined,
    studentYear: '', // Add student year filter
    page: 0,
    size: 10
  };
  
  // Student year options
  studentYearOptions = [
    { value: 'FE', label: 'FE (First Year)' },
    { value: 'SE', label: 'SE (Second Year)' },
    { value: 'TE', label: 'TE (Third Year)' },
    { value: 'BE', label: 'BE (Final Year)' }
  ];
  
searchText = '';

  // Application section properties
  applications: Application[] = [];
  applicationFilters = {
    studentName: '',         // Search by student name
    status: '',             // Filter by application status
    company: '',            // Filter by company name
    department: '',         // Filter by department
    designation: '',           // Filter by job position
    jobtype: '',           // Filter by job type
    minSalary: undefined as number | undefined,  // Filter by minimum salary
    maxSalary: undefined as number | undefined,  // Filter by maximum salary
    fromDate: '',          // Filter by application date range
    toDate: '',              // Filter by application date range
    page: 0,
    size: 10
  };

  // Application pagination properties
  applicationPagination = {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
    first: true,
    last: true
  };

  // Post pagination properties
  postPagination = {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
    first: true,
    last: true
  };

  // Placement section properties
  placements: PlacementDTO[] = [];
  placementFilters = {
    keyword: '',              // Search by keyword (student name, company name, position)
    companyName: '',          // Filter by company name
    department: '',           // Filter by department
    studentYear: '',          // Filter by student year
    minPackage: undefined as number | undefined,    // Filter by minimum package
    maxPackage: undefined as number | undefined,    // Filter by maximum package
    fromDate: '',             // Filter by joining date range
    toDate: '',               // Filter by joining date range
    page: 0,
    size: 10
  };

  // Placement pagination properties
  placementPagination = {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
    first: true,
    last: true
  };

  constructor(
    private studentService: StudentService,
    private applicationservice: ApplicationserviceService,
    private postService: PostService,
    private router: Router,
    private placementsService: PlacementServiceService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadCompanies();
    this.setActiveTab('students');
  }

  setActiveTab(tab: 'students' | 'posts' | 'applications' | 'placements'): void {
    this.activeTab = tab;
    switch(tab) {
      case 'students':
        this.loadStudents();
        break;
      case 'posts':
        this.loadPosts();
        break;
      case 'applications':
        this.loadApplications();
        break;
      case 'placements':
        this.loadPlacements();
        break;
    }
  }

  loadStudents(): void {
    console.log('Loading students with filters:', this.filters);
    this.studentService.getStudents(this.filters).subscribe({
      next: (response: PaginatedResponse<Student>) => {
        this.students = response.content || [];
        this.studentPagination = {
          totalPages: response.totalPages || 0,
          totalElements: response.totalElements || 0,
          currentPage: response.number || 0,
          pageSize: response.size || 10,
          first: response.first || true,
          last: response.last || true
        };
      },
      error: (error: Error) => {
        console.error('Error fetching students:', error);
        this.students = [];
      }
    });
  }

  loadPosts(): void {
    console.log('Loading posts with filters:', this.postFilters);
    this.postService.searchPosts(this.postFilters).subscribe({
      next: (response: PaginatedResponse<Post>) => {
        this.posts = response.content || [];
        this.postPagination = {
          totalPages: response.totalPages || 0,
          totalElements: response.totalElements || 0,
          currentPage: response.number || 0,
          pageSize: response.size || 10,
          first: response.first || true,
          last: response.last || true
        };
      },
      error: (error: Error) => {
        console.error('Error fetching posts:', error);
        this.posts = [];
      }
    });
  }

  loadApplications(): void {
    console.log('Loading applications with filters:', this.applicationFilters);
    this.applicationservice.getapplicationssearch(this.applicationFilters).subscribe({
      next: (response: PaginatedResponse<Application>) => {
        this.applications = response.content || [];
        this.applicationPagination = {
          totalPages: response.totalPages || 0,
          totalElements: response.totalElements || 0,
          currentPage: response.number || 0,
          pageSize: response.size || 10,
          first: response.first || true,
          last: response.last || true
        };
      },
      error: (error: Error) => {
        console.error('Error fetching applications:', error);
        this.applications = [];
      }
    });
  }

  loadPlacements(): void {
    console.log('Loading placements with filters:', this.placementFilters);
    
    // Choose the most specific filter method if only one filter is applied
    const filters = this.placementFilters;
    let serviceCall;
    
    // Check if only keyword is used (general search)
    if (filters.keyword && !filters.companyName && !filters.department && !filters.studentYear && 
        !filters.minPackage && !filters.maxPackage && !filters.fromDate && !filters.toDate) {
      serviceCall = this.placementsService.searchPlacements(this.placementFilters);
    }
    // Check for single specific filter usage
    else if (filters.companyName && !filters.department && !filters.studentYear && 
             !filters.minPackage && !filters.maxPackage && !filters.fromDate && !filters.toDate && !filters.keyword) {
      // Use company-specific filter
      serviceCall = this.placementsService.filterByCompany(filters.companyName, filters.page, filters.size);
    } 
    else if (filters.department && !filters.companyName && !filters.studentYear && 
             !filters.minPackage && !filters.maxPackage && !filters.fromDate && !filters.toDate && !filters.keyword) {
      // Use department-specific filter
      serviceCall = this.placementsService.filterByDepartment(filters.department, filters.page, filters.size);
    } 
    else if (filters.studentYear && !filters.companyName && !filters.department && 
             !filters.minPackage && !filters.maxPackage && !filters.fromDate && !filters.toDate && !filters.keyword) {
      // Use student year-specific filter
      serviceCall = this.placementsService.filterByStudentYear(filters.studentYear, filters.page, filters.size);
    } 
    else if (filters.minPackage !== undefined && filters.maxPackage !== undefined && 
             !filters.companyName && !filters.department && !filters.studentYear && 
             !filters.fromDate && !filters.toDate && !filters.keyword) {
      // Use package range-specific filter
      serviceCall = this.placementsService.filterByPackageRange(filters.minPackage, filters.maxPackage, filters.page, filters.size);
    } 
    else if (filters.fromDate && filters.toDate && !filters.companyName && !filters.department && 
             !filters.studentYear && !filters.minPackage && !filters.maxPackage && !filters.keyword) {
      // Use date range-specific filter
      serviceCall = this.placementsService.filterByDateRange(filters.fromDate, filters.toDate, filters.page, filters.size);
    } 
    else {
      // Use general search with all filters for complex combinations
      serviceCall = this.placementsService.searchPlacements(this.placementFilters);
    }
    
    serviceCall.subscribe({
      next: (response: PaginatedResponse<PlacementDTO>) => {
        this.placements = response.content || [];
        this.placementPagination = {
          totalPages: response.totalPages || 0,
          totalElements: response.totalElements || 0,
          currentPage: response.number || 0,
          pageSize: response.size || 10,
          first: response.first || true,
          last: response.last || true
        };
      },
      error: (error: Error) => {
        console.error('Error fetching placements:', error);
        this.placements = [];
      }
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.slice(0, 5).split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  formatCurrency(amount: number): string {
    if (!amount) return '₹0';
    
    // Format as Indian currency (lakhs)
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} LPA`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  }

  loadCompanies(): void {
    this.postService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies.map(company => ({
          id: company.id,
          name: company.name
        }));
      },
      error: (error) => {
        console.error('Error fetching companies:', error);
        this.companies = [];
      }
    });
  }

  downloadExcel(): void {
    if (this.activeTab === 'students') {
      this.studentService.downloadExcel(this.filters).subscribe({
        next: (response: Blob) => {
          this.handleExcelDownload(response, 'students.xlsx');
        },
        error: (error: Error) => {
          console.error('Error downloading Excel:', error);
        }
      });
    } else if (this.activeTab === 'applications') {
      this.applicationservice.downloadExcel(this.applicationFilters).subscribe({
        next: (response: Blob) => {
          this.handleExcelDownload(response, 'applications.xlsx');
        },
        error: (error: Error) => {
          console.error('Error downloading Excel:', error);
        }
      });
    } else if (this.activeTab === 'posts') {
      this.postService.downloadExcel(this.postFilters).subscribe({
        next: (response: Blob) => {
          this.handleExcelDownload(response, 'job_posts.xlsx');
        },
        error: (error: Error) => {
          console.error('Error downloading Excel:', error);
        }
      });
    } else if (this.activeTab === 'placements') {
      // Determine which download method to use based on applied filters
      const filters = this.placementFilters;
      
      // Check if no filters are applied - download all placements
      if (!filters.keyword && !filters.companyName && !filters.department && !filters.studentYear && 
          !filters.minPackage && !filters.maxPackage && !filters.fromDate && !filters.toDate) {
        // Use the new download all placements endpoint
        this.placementsService.downloadAllPlacementsExcel().subscribe({
          next: (response: Blob) => {
            this.handleExcelDownload(response, 'all_placements.xlsx');
          },
          error: (error: Error) => {
            console.error('Error downloading all placements Excel:', error);
          }
        });
      }
      // Check for single company filter - use filtered download endpoint
      else if (filters.companyName && !filters.department && !filters.studentYear && 
               !filters.keyword && !filters.minPackage && !filters.maxPackage && 
               !filters.fromDate && !filters.toDate) {
        this.placementsService.downloadFilteredPlacementsExcel('company', filters.companyName).subscribe({
          next: (response: Blob) => {
            this.handleExcelDownload(response, `${filters.companyName}_placements.xlsx`);
          },
          error: (error: Error) => {
            console.error('Error downloading company-filtered placements Excel:', error);
          }
        });
      }
      // Check for single department filter - use filtered download endpoint
      else if (filters.department && !filters.companyName && !filters.studentYear && 
               !filters.keyword && !filters.minPackage && !filters.maxPackage && 
               !filters.fromDate && !filters.toDate) {
        this.placementsService.downloadFilteredPlacementsExcel('department', filters.department).subscribe({
          next: (response: Blob) => {
            this.handleExcelDownload(response, `${filters.department}_placements.xlsx`);
          },
          error: (error: Error) => {
            console.error('Error downloading department-filtered placements Excel:', error);
          }
        });
      }
      // Check for single student year filter - use filtered download endpoint
      else if (filters.studentYear && !filters.companyName && !filters.department && 
               !filters.keyword && !filters.minPackage && !filters.maxPackage && 
               !filters.fromDate && !filters.toDate) {
        this.placementsService.downloadFilteredPlacementsExcel('studentYear', filters.studentYear).subscribe({
          next: (response: Blob) => {
            this.handleExcelDownload(response, `${filters.studentYear}_placements.xlsx`);
          },
          error: (error: Error) => {
            console.error('Error downloading student year-filtered placements Excel:', error);
          }
        });
      }
      // For complex filters or multiple filters, use the legacy method
      else {
        this.placementsService.downloadExcel(this.placementFilters).subscribe({
          next: (response: Blob) => {
            this.handleExcelDownload(response, 'filtered_placements.xlsx');
          },
          error: (error: Error) => {
            console.error('Error downloading filtered placements Excel:', error);
          }
        });
      }
    }
  }

  private handleExcelDownload(response: Blob, filename: string): void {
    const blob = new Blob([response], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }

  onFilterChange(): void {
    if (this.activeTab === 'students') {
      this.filters.page = 0; // Reset to first page
      this.loadStudents();
    } else if (this.activeTab === 'posts') {
      this.postFilters.page = 0; // Reset to first page
      this.loadPosts();
    } else if (this.activeTab === 'applications') {
      this.applicationFilters.page = 0; // Reset to first page
      this.loadApplications();
    } else if (this.activeTab === 'placements') {
      this.placementFilters.page = 0; // Reset to first page
      this.loadPlacements();
    }
  }

  selectedApplication= {
    id:0,
    status:"",
    feedback:"",
    interviewDate:"",
    interviewTime:"",
    interviewLocation:"",

  };
  showEditApplicationModal=false;
  onApplicationedit(id: number) {
    this.selectedApplication.id = id;
    this.showEditApplicationModal
    // You need to fetch the application details here
    this.applicationservice.getApplicationById(id).subscribe({
      next: (application) => {
        this.selectedApplication = {
          id: application.id,
          status: application.status || "",
          feedback: application.feedback || "",
          interviewDate: application.interviewDate || "",
          interviewTime: application.interviewTime || "",
          interviewLocation: application.interviewLocation || "",
        };
        this.showEditApplicationModal = true;
      },
      error: (error) => {
        console.error('Error fetching application:', error);
      }
    });
  }
    onUpdateApplication() {
    this.applicationservice.updateApplication({
      ...this.selectedApplication,
      interviewDate: this.selectedApplication.interviewDate,
      interviewLocation: this.selectedApplication.interviewLocation,
      interviewTime: this.selectedApplication.interviewTime,
    }).subscribe({
      next: (response) => {
        console.log('Application updated successfully:', response);
        this.loadApplications();
        this.selectedApplication={
          id:0,
          status:"",
          feedback:"",
          interviewDate:"",
          interviewTime:"",
          interviewLocation:"",
        };
      },
      error: (error) => {
        console.error('Error updating application:', error);
      }
    });
    this.showEditApplicationModal=false;
    }
  onApplicationEditCancel() {
    this.showEditApplicationModal=false;
    }
 
    // Variables
    selectedPost = {
      id: 0,
      title: '',                   // Job Designation
      description: '',
      location: '',
      jobType: 'FULL_TIME',        // Default to FULL_TIME
      status: 'OPEN',
    
      packageAmount: null,         // Package Amount
      minimumSsc: null,            // Minimum SSC %
      minimumHsc: null,            // Minimum HSC %
      minPercentage: null,         // Minimum Average %
    
      backlogAllowance: null,      // Backlog Allowed
      preferredCourse: '',         // Preferred Course
      studentYear: '',             // Student Year
      skillRequirements: '',       // Skills Required
      selectionRounds: '',         // Rounds of Selection
      modeOfRecruitment: '',       // Recruitment Mode
      testPlatform: '',            // Test Platform
    
      applicationStartDate: '',    // Dates as string (or convert to Date if needed)
      applicationEndDate: '',
      selectionStartDate: '',
      selectionEndDate: '',
      aptitudeDate: '',
    
      aptitude: false,             // Aptitude Test Yes/No
      portalLink: ''
    };
    
  showEditPostModal = false;

  // Open edit modal and load selected post
  onPostEdit(id: number) {
    this.postService.getPostById(id).subscribe({
      next: (data) => {
        // Map API response to selectedPost object with correct property names
        this.selectedPost = {
          id: data.id,
          title: data.jobDesignation,           // Map jobDesignation to title
          description: data.description,
          location: data.location,
          jobType: data.jobType,
          status: data.status,
          packageAmount: data.packageAmount,
          minimumSsc: data.minSsc,              // Map minSsc to minimumSsc
          minimumHsc: data.minHsc,              // Map minHsc to minimumHsc
          minPercentage: data.minPercentage,
          backlogAllowance: data.backlogAllowance,
          preferredCourse: data.preferredCourse,
          studentYear: data.studentYear || '',  // Add studentYear field
          skillRequirements: data.skillsRequirements || data.skillRequirements,
          selectionRounds: data.selectionRounds,
          modeOfRecruitment: data.modeOfRecruitment,
          testPlatform: data.testPlatform,
          applicationStartDate: data.applicationStartDate,
          applicationEndDate: data.applicationEndDate,
          selectionStartDate: data.selectionStartDate,
          selectionEndDate: data.selectionEndDate,
          aptitudeDate: data.aptitudeDate,
          aptitude: data.aptitude,
          portalLink: data.portalLink || ''
        };
        this.showEditPostModal = true;
        console.log('Selected post:', this.selectedPost);
      },
      error: (error) => {
        console.error('Error fetching post data:', error);
      }
    });
  }

  // Update the post
  onUpdatePost() {
    // Map selectedPost back to API format
    const updateData = {
      id: this.selectedPost.id,
      jobDesignation: this.selectedPost.title,           // Map title back to jobDesignation
      description: this.selectedPost.description,
      location: this.selectedPost.location,
      jobType: this.selectedPost.jobType,
      status: this.selectedPost.status,
      packageAmount: this.selectedPost.packageAmount,
      minSsc: this.selectedPost.minimumSsc,              // Map minimumSsc back to minSsc
      minHsc: this.selectedPost.minimumHsc,              // Map minimumHsc back to minHsc
      minPercentage: this.selectedPost.minPercentage,
      backlogAllowance: this.selectedPost.backlogAllowance,
      preferredCourse: this.selectedPost.preferredCourse,
      studentYear: this.selectedPost.studentYear,        // Include studentYear
      skillsRequirements: this.selectedPost.skillRequirements,
      selectionRounds: this.selectedPost.selectionRounds,
      modeOfRecruitment: this.selectedPost.modeOfRecruitment,
      testPlatform: this.selectedPost.testPlatform,
      applicationStartDate: this.selectedPost.applicationStartDate,
      applicationEndDate: this.selectedPost.applicationEndDate,
      selectionStartDate: this.selectedPost.selectionStartDate,
      selectionEndDate: this.selectedPost.selectionEndDate,
      aptitudeDate: this.selectedPost.aptitudeDate,
      aptitude: this.selectedPost.aptitude,
      portalLink: this.selectedPost.portalLink
    };

    this.postService.updatePost(updateData).subscribe({
      next: (response) => {
        console.log('Post updated successfully:', response);
        this.loadPosts(); // Refresh the post list
        this.resetSelectedPost();
      },
      error: (error) => {
        console.error('Error updating post:', error);
      }
    });
    this.showEditPostModal = false;
  }

  // Cancel post editing
  onPostEditCancel() {
    this.showEditPostModal = false;
    this.resetSelectedPost();
  }

  // Reset post data
  resetSelectedPost() {
   this.selectedPost = {
    id: 0,
    title: '',                   // Job Designation
    description: '',
    location: '',
    jobType: 'FULL_TIME',        // Default to FULL_TIME
    status: 'OPEN',

    packageAmount: null,         // Package Amount
    minimumSsc: null,            // Minimum SSC %
    minimumHsc: null,            // Minimum HSC %
    minPercentage: null,         // Minimum Average %

    backlogAllowance: null,      // Backlog Allowed
    preferredCourse: '',         // Preferred Course
    studentYear: '',             // Student Year
    skillRequirements: '',       // Skills Required
    selectionRounds: '',         // Rounds of Selection
    modeOfRecruitment: '',       // Recruitment Mode
    testPlatform: '',            // Test Platform

    applicationStartDate: '',    // Dates as string (or convert to Date if needed)
    applicationEndDate: '',
    selectionStartDate: '',
    selectionEndDate: '',
    aptitudeDate: '',

    aptitude: false,             // Aptitude Test Yes/No
    portalLink: ''
  };
  }

  // Placement variables & methods
  selectedPlacement :  PlacementDTO | null = null;
  showPlacementDetailsModal = false;

  onViewPlacementDetails(id: number) {
    this.placementsService.getPlacementById(id).subscribe({
      next: (response) => {
        this.selectedPlacement = response;
        this.showPlacementDetailsModal = true;
      },
      error: (error) => {
        console.error('Error fetching placement details:', error);
      }
    });
  }

  onPlacementDetailsClose() {
    this.showPlacementDetailsModal = false;
  }

  // Pagination methods for Students
  onStudentPageChange(page: number): void {
    this.filters.page = page;
    this.loadStudents();
  }

  onStudentPageSizeChange(size: number): void {
    this.filters.size = size;
    this.filters.page = 0;
    this.studentPagination.pageSize = size;
    this.loadStudents();
  }

  getStudentPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(0, this.studentPagination.currentPage - 2);
    const end = Math.min(this.studentPagination.totalPages - 1, this.studentPagination.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Pagination methods for Posts
  onPostPageChange(page: number): void {
    this.postFilters.page = page;
    this.loadPosts();
  }

  onPostPageSizeChange(size: number): void {
    this.postFilters.size = size;
    this.postFilters.page = 0;
    this.postPagination.pageSize = size;
    this.loadPosts();
  }

  getPostPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(0, this.postPagination.currentPage - 2);
    const end = Math.min(this.postPagination.totalPages - 1, this.postPagination.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Pagination methods for Applications
  onApplicationPageChange(page: number): void {
    this.applicationFilters.page = page;
    this.loadApplications();
  }

  onApplicationPageSizeChange(size: number): void {
    this.applicationFilters.size = size;
    this.applicationFilters.page = 0;
    this.applicationPagination.pageSize = size;
    this.loadApplications();
  }

  getApplicationPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(0, this.applicationPagination.currentPage - 2);
    const end = Math.min(this.applicationPagination.totalPages - 1, this.applicationPagination.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Pagination methods for Placements
  onPlacementPageChange(page: number): void {
    this.placementFilters.page = page;
    this.loadPlacements();
  }

  onPlacementPageSizeChange(size: number): void {
    this.placementFilters.size = size;
    this.placementFilters.page = 0;
    this.placementPagination.pageSize = size;
    this.loadPlacements();
  }

  getPlacementPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(0, this.placementPagination.currentPage - 2);
    const end = Math.min(this.placementPagination.totalPages - 1, this.placementPagination.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Helper methods for pagination display
  getStudentEndIndex(): number {
    return Math.min((this.studentPagination.currentPage + 1) * this.studentPagination.pageSize, this.studentPagination.totalElements);
  }

  getPostEndIndex(): number {
    return Math.min((this.postPagination.currentPage + 1) * this.postPagination.pageSize, this.postPagination.totalElements);
  }

  getApplicationEndIndex(): number {
    return Math.min((this.applicationPagination.currentPage + 1) * this.applicationPagination.pageSize, this.applicationPagination.totalElements);
  }

  getPlacementEndIndex(): number {
    return Math.min((this.placementPagination.currentPage + 1) * this.placementPagination.pageSize, this.placementPagination.totalElements);
  }

  // Reset post filters
  resetPostFilters(): void {
    this.postFilters = {
      status: '',
      company: '',
      position: '',
      jobType: '',
      minSalary: undefined,
      maxSalary: undefined,
      studentYear: '',
      page: 0,
      size: 10
    };
    this.loadPosts();
  }

  // Reset student filters
  resetStudentFilters(): void {
    this.filters = {
      firstName: '',
      department: '',
      academicYear: '',
      minAvgMarks: undefined,
      maxAvgMarks: undefined,
      yearOfPassing: undefined,
      page: 0,
      size: 10
    };
    this.loadStudents();
  }

  // Reset application filters
  resetApplicationFilters(): void {
    this.applicationFilters = {
      studentName: '',
      status: '',
      company: '',
      department: '',
      designation: '',
      jobtype: '',
      minSalary: undefined,
      maxSalary: undefined,
      fromDate: '',
      toDate: '',
      page: 0,
      size: 10
    };
    this.loadApplications();
  }

  // Reset placement filters
  resetPlacementFilters(): void {
    this.placementFilters = {
      keyword: '',
      companyName: '',
      department: '',
      studentYear: '',
      minPackage: undefined,
      maxPackage: undefined,
      fromDate: '',
      toDate: '',
      page: 0,
      size: 10
    };
    this.loadPlacements();
  }

  onPlacementFilterChange(): void {
    this.placementFilters.page = 0; // Reset to first page
    this.loadPlacements();
  }

}