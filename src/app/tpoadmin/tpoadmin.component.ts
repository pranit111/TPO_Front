import { Component } from '@angular/core';
import { TpoAdminService } from '../tpo-admin.service';
import { DashboardData } from '../models/dashboard-data';
import { Router, RouterLink } from '@angular/router';
interface Log {
  id: number;
  action: string;
  performedBy: string;
  timestamp: string;
  entityName: string;
  entityId: string;
  details: string;
}

@Component({
  selector: 'app-tpoadmin',
  standalone: false,
  templateUrl: './tpoadmin.component.html',
  styleUrl: './tpoadmin.component.css'
})
export class TpoadminComponent {
onSubmitEditTpoUser() {
throw new Error('Method not implemented.');
}
  constructor(private tposervice: TpoAdminService,private router:Router) { }
  dashboardData: DashboardData | null = null;
  isLoading = true;
  error: string | null = null;
  logs: Log[] = [];
  filteredLogs: Log[] = [];
  searchQuery: string = '';
  fetchLogs(): void {
    this.tposervice.getLogs().subscribe((data) => {
      this.logs = data;
      this.filteredLogs = data;
    });
  }

  filterLogs(): void {
    this.filteredLogs = this.logs.filter(log =>
      log.action.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      log.entityName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      log.entityId.toString().includes(this.searchQuery)
    );
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.tposervice.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
        console.error('Error loading dashboard data:', err);
      }
    });
  }

  selectedTab :any= 'Dashboard';
  
  setSelectedTab(title: string): void {
    console.log('Selected tab:', title);
    
    // Special handling for logout
    if (title === 'Logout') {
      this.logout();
      return;
    }
    
    this.selectedTab = title;
    this.navItems.forEach(item => {
      item.active = item.title === title;
    });
    
    if (!this.fetchedTabs.has(title)) {
      this.loadTabData(title);
    }
  }
  
 
  
  navItems = [
    { title: 'Dashboard', icon: 'dashboard.png', active: true },
 
    { title: 'Companies', icon: 'company.png', active: false },
  
    { title: 'Logs', icon: 'logs.png', active: false },
    { title: 'Search', icon: 'search_white.png', active: false },
    { title: 'TPO', icon: 'tpo.png', active: false },
    { title: 'Logout', icon: 'logout.png', active: false }
  ];
  
  showAddCompanyModal = false;
  companies: any[] = [];
  newCompany = {
 
    name: '',
    industryType: '',
    email: '',
    contactNumber: '',
    location: '',
    website: '',
    hr_Name: '',
    mnc: false,
    associatedSince: null,
    active: true
  };

  onSubmitCompany() {
    // Add your API call here to save the company
    console.log('Company data:', this.newCompany);
    this.showAddCompanyModal = false;
    this.tposervice.addCompany(this.newCompany).subscribe({
      next: (response) => {
        console.log('Company added successfully:', response);
        // Refresh the company list or perform any other necessary actions
      },
      error: (error) => {
        console.error('Error adding company:', error);
      }
    });
    this.fetchCompaniesData();
    // Reset form
    this.newCompany = {
  
      name: '',
      mnc: false,
      industryType: '',
      email: '',
      contactNumber: '',
      hr_Name: '',
      location: '',
      website: '',
      associatedSince: null,
      active: true
    };
   
  }


// Add these properties
loading = false;
fetchedTabs = new Set<string>(['Dashboard']);

// ngOnInit() {
//   this.fetchDashboardData();
// }


loadTabData(tab: string): void {
  this.loading = true;
  
  switch(tab) {
    // case 'Dashboard':
    //   this.fetchDashboardData();
    //   break;
    // case 'Students':
    //   this.fetchStudentsData();
    //   break;
    case 'Companies':
      this.fetchCompaniesData();
      break;
    case 'TPO':
       this.fetchTpoUsersData();
       break;
    case 'Search':
     
      break;
    case 'Logs':
      this.fetchLogs();
      break;
    
    // case 'Placements':
    //   this.fetchPlacementsData();
    //   break;
    // case 'Reports':
    //   this.fetchReportsData();
    //   break;
    default:
      this.loading = false;
  }
}

logout() {
this.router.navigate(['/logout']);
}

fetchCompaniesData(): void {
  this.tposervice.getAllCompanies().subscribe({
    next: (data: any) => { 
      console.log(data)// Ensure correct type
      // Avoid undefined issues
      this.companies = data || [];
      this.loading = false;
      this.fetchedTabs.add('Companies');
    },
    error: (error) => {
      console.error('Error fetching companies data:', error);
      this.loading = false;
    }
  });


}
showEditCompanyModal = false;
editingCompany: any = null;

// Add these methods
onEditCompany(id: number) {
  this.editingCompany = { id };
  this.showEditCompanyModal = true;
}

onDeleteCompany(id: number) {
  if (confirm('Are you sure you want to delete this company?')) {
    this.tposervice.deleteCompany(id).subscribe({
      next: () => {
        this.companies = this.companies.filter(company => company.id !== id);
        console.log('Company deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting company:', error);
      }
    });
  }
}

onUpdateCompany() {
  if (this.editingCompany) {
    this.tposervice.updateCompany(this.editingCompany.id, this.editingCompany).subscribe({
      next: (updatedCompany) => {
        const index = this.companies.findIndex(c => c.id === this.editingCompany.id);
        if (index !== -1) {
          this.companies[index] = updatedCompany;
        }
        this.showEditCompanyModal = false;
        this.editingCompany = null;
      },
      error: (error) => {
        console.error('Error updating company:', error);
      }
    });
  }
}


selectedTpoUser: any = {

  email: null,
  password: null,
  role: 'TPO_USER',
  status: true
};;
showAddTpoUserModal = false;
tpoUsers: any[] = [];
newTpoUser = {
  username: '',
  email: '',
  password: '',
  role: '',

  active: true
};
showEditTpoUserModal = false;
editingTpoUser: any = null;

// Add these methods
fetchTpoUsersData(): void {
  this.tposervice.getAllTpoUsers().subscribe({
    next: (data: any) => {
      console.log(data);
      this.tpoUsers = data || [];
      this.loading = false;
      this.fetchedTabs.add('Tpo Users');
    },
    error: (error) => {
      console.error('Error fetching TPO users data:', error);
      this.loading = false;
    }
  });
}

onSubmitTpoUser():void {
 

      this.tposervice.addTpoUser(this.newTpoUser,this.newTpoUser.role).subscribe({
        next: (response) => {
          console.log('TPO User added successfully:', response);
          this.showAddTpoUserModal = false;
          this.fetchTpoUsersData();
        },
        error: (error) => {
          console.error('Error adding TPO user:', error);
        }
      });
      this.showAddTpoUserModal = false;
      this.fetchTpoUsersData();
}


onEditTpoUser(user: any,id:number) {
  this.selectedTpoUser.id=id;
  this.editingTpoUser = { ...user };
  this.showEditTpoUserModal = true;
}

onUpdateTpoUser() {
  if (this.selectedTpoUser) {
    this.tposervice.updateTpoUser(this.selectedTpoUser.id, this.selectedTpoUser,this.selectedTpoUser.status).subscribe({
      next: (updatedUser) => {
        const index = this.tpoUsers.findIndex(u => u.id === this.editingTpoUser.id);
        if (index !== -1) {
          this.tpoUsers[index] = updatedUser;
        }
        this.showEditTpoUserModal = false;
        this.selectedTpoUser = null;
        this.fetchTpoUsersData();
      },
      error: (error) => {
        console.error('Error updating TPO user:', error);
      }
    });
  }
}

onDeleteTpoUser(id: number) {
  if (confirm('Are you sure you want to delete this TPO user?')) {
    this.tposervice.deleteTpoUser(id).subscribe({
      next: () => {
        this.tpoUsers = this.tpoUsers.filter(user => user.id !== id);
        console.log('TPO User deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting TPO user:', error);
      }
    });
  }
}

// Update loadTabData method to include TPO Users


}
