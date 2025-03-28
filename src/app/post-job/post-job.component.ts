import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Company {
  id: number;
  name: string;
}

interface JobData {
  company: Company;
  companyName: string;
  jobDesignation: string;
  location: string;
  jobType: string;
  description: string;
  packageAmount: string;
  status:string;
  minSsc:string;
  minHsc:string;
  minPercentage: number;
  backlogAllowance: number;
  preferredCourse: string;
  skillsRequirements: string;
  selectionRounds: string;
  modeOfRecruitment: string;
  testPlatform: string;
  recruitmentDetails: string;
  aptitude: boolean;
  
  applicationStartDate: Date;
  applicationEndDate: Date;
  selectionStartDate: Date;
  selectionEndDate: Date;
}

@Component({
  selector: 'app-post-job',
  standalone: false,
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.css'
})
export class PostJobComponent implements OnInit {
  jobForm: FormGroup;
  jobData: JobData = {
    company: { id: 0, name: '' },
    companyName: '',
    jobDesignation: '',
    location: '',
    jobType: '',
    description: '',
    packageAmount: '',
    status: 'Active',
    minSsc: '',
    minHsc: '',
    minPercentage: 0,
    aptitude: false,
    backlogAllowance: 0,
    preferredCourse: '',
    skillsRequirements: '',
    selectionRounds: '',
    modeOfRecruitment: '',
    testPlatform: '',
    recruitmentDetails: '',
    applicationStartDate: new Date(),
    applicationEndDate: new Date(),
    selectionStartDate: new Date(),
    selectionEndDate: new Date()
  };
  companies: { id: number; name: string }[] = [];
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private postService: PostService,
    private fb: FormBuilder
  ) {
    this.jobForm = this.fb.group({
      company: ['', Validators.required],
      jobDesignation: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      packageAmount: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      minPercentage: ['', [Validators.required, Validators.min(35), Validators.max(100)]],
      minSsc: ['', [Validators.required, Validators.min(35), Validators.max(100)]],
      minHsc: ['', [Validators.required, Validators.min(35), Validators.max(100)]],
      backlogAllowance: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      preferredCourse: ['', Validators.required],
      skillsRequirements: ['', Validators.required],
      selectionRounds: ['', Validators.required],
      modeOfRecruitment: ['', Validators.required],
      testPlatform: ['', Validators.required],
      recruitmentDetails: ['', Validators.required],
      aptitude: [false, Validators.required],
      applicationStartDate: ['', Validators.required],
      applicationEndDate: ['', Validators.required],
      selectionStartDate: ['', Validators.required],
      selectionEndDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.postService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        alert('Error loading companies. Please try again.');
      }
    });
  }

  onCompanySelect() {
    const selectedCompany = this.companies.find(c => c.id === this.jobData.company.id);
    if (selectedCompany) {
      this.jobData.company = selectedCompany;
      this.jobData.companyName = selectedCompany.name;
    }
  }

  onSubmit() {
    if (this.jobForm.valid) {
      // Validate dates
      const startDate = new Date(this.jobData.applicationStartDate);
      const endDate = new Date(this.jobData.applicationEndDate);
      const selectionStartDate = new Date(this.jobData.selectionStartDate);
      const selectionEndDate = new Date(this.jobData.selectionEndDate);

      if (startDate > endDate) {
        alert('Application end date must be after start date');
        return;
      }

      if (endDate > selectionStartDate) {
        alert('Selection start date must be after application end date');
        return;
      }

      if (selectionStartDate > selectionEndDate) {
        alert('Selection end date must be after selection start date');
        return;
      }

      this.postService.createPost(this.jobData).subscribe({
        next: (response) => {
          console.log('Job posted successfully:', response);
          alert('Job posted successfully!');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error posting job:', error);
          alert('Error posting job. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched(this.jobForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.jobData = {
      company: { id: 0, name: '' },
      companyName: '',
      jobDesignation: '',
      location: '',
      jobType: '',
      description: '',
      packageAmount: '',
      status: 'Active',
      minSsc: '',
      minHsc: '',
      minPercentage: 0,
      aptitude: false,
      backlogAllowance: 0,
      preferredCourse: '',
      skillsRequirements: '',
      selectionRounds: '',
      modeOfRecruitment: '',
      testPlatform: '',
      recruitmentDetails: '',
      applicationStartDate: new Date(),
      applicationEndDate: new Date(),
      selectionStartDate: new Date(),
      selectionEndDate: new Date()
    };
    this.jobForm.reset();
  }
}
