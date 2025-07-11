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
OnStudentAction(id:number){
  this.showStudentActionModal = true;
  this.selectedstudent = this.students.find((student) => student.id === id) || new Student();
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
    page: 0,
    size: 10
  };
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
    department: '',           // Filter by department
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
    this.placementsService.searchPlacements(this.placementFilters).subscribe({
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
      this.placementsService.downloadExcel(this.placementFilters).subscribe({
        next: (response: Blob) => {
          this.handleExcelDownload(response, 'placements.xlsx');
        },
        error: (error: Error) => {
          console.error('Error downloading Excel:', error);
        }
      });
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
     
        this.selectedPost = { ...data };
        this.showEditPostModal = true;
        console.log(this.showEditPostModal);
      },
      error: (error) => {
        console.error('Error fetching post data:', error);
      }
    });
  }

  // Update the post
  onUpdatePost() {
    this.postService.updatePost(this.selectedPost).subscribe({
      next: (response) => {
        console.log('Post updated successfully:', response);
        this.loadPosts(); // Refresh the post list
        this.resetSelectedPost();
        this.loadPosts();
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
}