import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from '../error.service';

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
  portalLink: string;
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
    status: 'OPEN',
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
    portalLink: '',
    applicationStartDate: new Date(),
    applicationEndDate: new Date(),
    selectionStartDate: new Date(),
    selectionEndDate: new Date()
  };
  companies: { id: number; name: string }[] = [];
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private postService: PostService,
    private fb: FormBuilder,
    private errorService: ErrorService
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
      portalLink: [''], // Add portalLink to form controls
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

  onCompanySelect(event: any) {
    const selectedCompany = this.jobForm.get('company')?.value;
    if (selectedCompany) {
      this.jobData.company = selectedCompany;
      this.jobData.companyName = selectedCompany.name;
      console.log('Selected company:', this.jobData.companyName);
    }
  }

  onSubmit() {
    if (this.jobForm.valid) {
      const formValues = this.jobForm.value;
      
      this.jobData = {
        ...this.jobData,
        ...formValues,
        company: formValues.company,
        companyName: formValues.company?.name || '',
        portalLink: formValues.portalLink || '', // Explicitly map portalLink
        applicationStartDate: new Date(formValues.applicationStartDate),
        applicationEndDate: new Date(formValues.applicationEndDate),
        selectionStartDate: new Date(formValues.selectionStartDate),
        selectionEndDate: new Date(formValues.selectionEndDate),
        // Ensure numeric fields are properly typed
        minPercentage: Number(formValues.minPercentage),
        backlogAllowance: Number(formValues.backlogAllowance),
        minSsc: formValues.minSsc,
        minHsc: formValues.minHsc,
        // Ensure boolean fields are properly typed
        aptitude: Boolean(formValues.aptitude),
        // Ensure status is set
        status: 'OPEN'
      };

      // Validate dates
      const startDate = this.jobData.applicationStartDate;
      const endDate = this.jobData.applicationEndDate;
      const selectionStartDate = this.jobData.selectionStartDate;
      const selectionEndDate = this.jobData.selectionEndDate;

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
         this.errorService.setError('Job posted successfully!', 'bg-green-600');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error posting job:', error);
          this.errorService.setError('Error posting job. Please try again.');
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
      portalLink: '',
      applicationStartDate: new Date(),
      applicationEndDate: new Date(),
      selectionStartDate: new Date(),
      selectionEndDate: new Date()
    };
    this.jobForm.reset();
  }
}
