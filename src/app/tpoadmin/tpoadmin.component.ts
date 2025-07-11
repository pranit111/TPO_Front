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
  
  // Enhanced logs filtering properties
  logSearchQuery: string = '';
  logFilters = {
    action: '',
    entityName: '',
    performedBy: '',
    fromDate: '',
    toDate: ''
  };
  logSortBy: string = 'timestamp_desc';
  isLoadingLogs = false;
  
  // Add new properties for additional dashboard features
  realTimeStats: any = null;
  growthAnalytics: any = null;
  recentActivities: any = null;
  processMetrics: any = null;
  departmentAnalytics: any = null;
  companyAnalytics: any = null;
  placementTrends: any = null;
  performanceAnalytics: any = null;
  packageDistribution: any = null;
  hiringTrends: any = null;
  systemHealth: any = null;
  dataIntegrity: any = null;
  dashboardNotifications: any = null;
  customReports: any = null;
  
  // Export states
  isExporting = false;

  // Yearly Export and Analytics properties
  yearlyAnalytics: any = null;
  yearlyComparison: any = null;
  selectedYear: number = new Date().getFullYear();
  isExportingYearly = false;

  // Add pagination properties for logs
  currentLogPage = 0;
  logPageSize = 20;
  totalLogPages = 0;
  totalLogElements = 0;
  hasNextLogPage = false;
  hasPreviousLogPage = false;

  fetchLogs(page: number = 0): void {
    this.isLoadingLogs = true;
    this.tposervice.getLogs(page, this.logPageSize).subscribe({
      next: (response) => {
        // Handle the paginated response structure
        this.logs = response.logs || [];
        this.filteredLogs = [...this.logs];
        
        // Update pagination info
        this.currentLogPage = response.currentPage || 0;
        this.totalLogPages = response.totalPages || 0;
        this.totalLogElements = response.totalElements || 0;
        this.hasNextLogPage = response.hasNext || false;
        this.hasPreviousLogPage = response.hasPrevious || false;
        
        this.applyLogFilters();
        this.isLoadingLogs = false;
      },
      error: (error) => {
        console.error('Error fetching logs:', error);
        this.isLoadingLogs = false;
      }
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

  // Enhanced filtering methods
  onLogSearch(): void {
    this.applyLogFilters();
  }

  applyLogFilters(): void {
    let filtered = [...this.logs];

    // Apply text search
    if (this.logSearchQuery.trim()) {
      const searchTerm = this.logSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm) ||
        log.performedBy.toLowerCase().includes(searchTerm) ||
        log.entityName.toLowerCase().includes(searchTerm) ||
        log.entityId.toString().toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm)
      );
    }

    // Apply action filter
    if (this.logFilters.action) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(this.logFilters.action.toLowerCase())
      );
    }

    // Apply entity filter
    if (this.logFilters.entityName) {
      filtered = filtered.filter(log =>
        log.entityName.toLowerCase() === this.logFilters.entityName.toLowerCase()
      );
    }

    // Apply performed by filter
    if (this.logFilters.performedBy) {
      filtered = filtered.filter(log =>
        log.performedBy.toLowerCase().includes(this.logFilters.performedBy.toLowerCase())
      );
    }

    // Apply date range filters
    if (this.logFilters.fromDate) {
      const fromDate = new Date(this.logFilters.fromDate);
      filtered = filtered.filter(log => new Date(log.timestamp) >= fromDate);
    }

    if (this.logFilters.toDate) {
      const toDate = new Date(this.logFilters.toDate);
      filtered = filtered.filter(log => new Date(log.timestamp) <= toDate);
    }

    this.filteredLogs = filtered;
    this.sortLogs();
  }

  clearLogFilters(): void {
    this.logSearchQuery = '';
    this.logFilters = {
      action: '',
      entityName: '',
      performedBy: '',
      fromDate: '',
      toDate: ''
    };
    this.applyLogFilters();
  }

  setQuickFilter(period: string): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today':
        this.logFilters.fromDate = this.formatDateForInput(today);
        this.logFilters.toDate = this.formatDateForInput(now);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        this.logFilters.fromDate = this.formatDateForInput(yesterday);
        this.logFilters.toDate = this.formatDateForInput(today);
        break;
      case 'last7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        this.logFilters.fromDate = this.formatDateForInput(sevenDaysAgo);
        this.logFilters.toDate = this.formatDateForInput(now);
        break;
      case 'last30days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        this.logFilters.fromDate = this.formatDateForInput(thirtyDaysAgo);
        this.logFilters.toDate = this.formatDateForInput(now);
        break;
    }
    this.applyLogFilters();
  }

  sortLogs(): void {
    const sortField = this.logSortBy.split('_')[0];
    const sortDirection = this.logSortBy.split('_')[1];

    this.filteredLogs.sort((a: any, b: any) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Handle date sorting
      if (sortField === 'timestamp') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Handle string sorting
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  sortBy(field: string): void {
    const currentField = this.logSortBy.split('_')[0];
    const currentDirection = this.logSortBy.split('_')[1];
    
    if (currentField === field) {
      // Toggle direction
      this.logSortBy = `${field}_${currentDirection === 'asc' ? 'desc' : 'asc'}`;
    } else {
      // Default to desc for new field
      this.logSortBy = `${field}_desc`;
    }
    
    this.sortLogs();
  }

  // Pagination methods for logs
  nextLogPage(): void {
    if (this.hasNextLogPage) {
      this.fetchLogs(this.currentLogPage + 1);
    }
  }

  previousLogPage(): void {
    if (this.hasPreviousLogPage) {
      this.fetchLogs(this.currentLogPage - 1);
    }
  }

  goToLogPage(page: number): void {
    if (page >= 0 && page < this.totalLogPages) {
      this.fetchLogs(page);
    }
  }

  getDisplayPages(): number[] {
    const maxDisplayPages = 5;
    const pages: number[] = [];
    
    if (this.totalLogPages <= maxDisplayPages) {
      // Show all pages if total is small
      for (let i = 0; i < this.totalLogPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(0, this.currentLogPage - Math.floor(maxDisplayPages / 2));
      const end = Math.min(this.totalLogPages, start + maxDisplayPages);
      
      for (let i = start; i < end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  refreshLogs(): void {
    this.fetchLogs(this.currentLogPage);
  }

  exportLogs(): void {
    this.isExporting = true;
    
    // Prepare data for export
    const exportData = this.filteredLogs.map(log => ({
      'Timestamp': new Date(log.timestamp).toLocaleString(),
      'Action': log.action,
      'Performed By': log.performedBy,
      'Entity Type': log.entityName,
      'Entity ID': log.entityId,
      'Details': log.details
    }));

    // Convert to CSV format
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
      )
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    this.isExporting = false;
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadAllDashboardComponents();
    this.fetchLogs(); // Initialize logs data
    // Initialize yearly reports data
    this.selectedYear = new Date().getFullYear();
  }

  loadAllDashboardComponents(): void {
    // Load all dashboard components - temporarily commented out until service methods are ready
    // this.loadRealTimeStats();
    // this.loadGrowthAnalytics();
    // this.loadRecentActivities();
    // this.loadProcessMetrics();
    // this.loadDepartmentAnalytics();
    // this.loadCompanyAnalytics();
    // this.loadPlacementTrends();
    // this.loadPerformanceAnalytics();
    // this.loadPackageDistribution();
    // this.loadHiringTrends();
    // this.loadSystemHealth();
    // this.loadDataIntegrity();
    // this.loadDashboardNotifications();
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
      this.fetchedTabs.add(title);
    }
  }
  
 
  
  navItems = [
    { title: 'Dashboard', icon: 'dashboard.png', active: true },
    { title: 'Companies', icon: 'company.png', active: false },
    { title: 'Logs', icon: 'logs.png', active: false },
    { title: 'Search', icon: 'search_white.png', active: false },
    { title: 'Post', icon: 'post.png', active: false },
    { title: 'TPO', icon: 'tpo.png', active: false },
    { title: 'Reports', icon: 'Report.png', active: false },
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
    case 'Reports':
      this.loadYearlyAnalytics();
      this.loadYearlyComparison();
      break;
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
isadmin=false;
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
onProfileLog(id: number) {
  this.router.navigate(['/view-profile', id]);
  console.log('Navigating to profile with ID:', id);
  this.selectedTab = 'Profile';
  this.navItems.forEach(item => {
    item.active = item.title === 'Profile';
  });
  this.loadTabData('Profile');
}

// Helper methods for dashboard calculations
getProgressPercentage(current: number, total: number): number {
  if (!total) return 0;
  return Math.round((current / total) * 100);
}

// Add these helper methods to format package amounts
formatPackageAmount(packageAmount: number): string {
  if (packageAmount >= 10000000) {
    return (packageAmount / 10000000).toFixed(1) + ' Cr';
  } else if (packageAmount >= 100000) {
    return (packageAmount / 100000).toFixed(1) + ' LPA';
  } else if (packageAmount > 0) {
    return packageAmount.toString();
  }
  return '0';
}

formatPackageForDisplay(packageAmount: number): string {
  if (packageAmount >= 10000000) {
    return '₹' + (packageAmount / 10000000).toFixed(1) + ' Cr';
  } else if (packageAmount >= 100000) {
    return '₹' + (packageAmount / 100000).toFixed(1) + ' LPA';
  } else if (packageAmount > 0) {
    return '₹' + packageAmount.toString();
  }
  return 'Not Available';
}

// Update the existing methods to handle the new data structure
getDepartmentPercentage(departmentName: string): number {
  const dept = this.dashboardData?.departmentStats?.find(d => d.departmentName === departmentName);
  return dept ? dept.placementPercentage : 0;
}

getDepartmentStudentCount(departmentName: string): number {
  const dept = this.dashboardData?.departmentStats?.find(d => d.departmentName === departmentName);
  return dept ? dept.totalStudents : 0;
}

// Color helper methods for dynamic styling
  getCompanyBarColor(index: number): string {
    const colors = [
      'bg-gradient-to-t from-blue-300 to-blue-600',
      'bg-gradient-to-t from-green-300 to-green-600',
      'bg-gradient-to-t from-purple-300 to-purple-600',
      'bg-gradient-to-t from-teal-300 to-teal-600',
      'bg-gradient-to-t from-indigo-300 to-indigo-600',
      'bg-gradient-to-t from-amber-300 to-amber-600'
    ];
    return colors[index % colors.length];
  }

  getDepartmentColor(index: number): string {
    const colors = [
      'bg-blue-600',
      'bg-teal-500',
      'bg-amber-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
  }

  getDepartmentTextColor(index: number): string {
    const colors = [
      'text-blue-600',
      'text-teal-600',
      'text-amber-600',
      'text-purple-600',
      'text-green-600',
      'text-indigo-600'
    ];
    return colors[index % colors.length];
  }

  getDepartmentBarColor(index: number): string {
    const colors = [
      'bg-gradient-to-r from-blue-400 to-blue-600',
      'bg-gradient-to-r from-teal-400 to-teal-600',
      'bg-gradient-to-r from-amber-400 to-amber-600',
      'bg-gradient-to-r from-purple-400 to-purple-600',
      'bg-gradient-to-r from-green-400 to-green-600',
      'bg-gradient-to-r from-indigo-400 to-indigo-600'
    ];
    return colors[index % colors.length];
  }

  getStudentRankColor(index: number): string {
    const colors = [
      'bg-gradient-to-r from-yellow-400 to-yellow-600', // Gold for #1
      'bg-gradient-to-r from-gray-400 to-gray-600',     // Silver for #2
      'bg-gradient-to-r from-amber-600 to-amber-800',   // Bronze for #3
      'bg-gradient-to-r from-blue-400 to-blue-600',
      'bg-gradient-to-r from-green-400 to-green-600'
    ];
    return colors[index % colors.length];
  }

  // Add all the new methods for additional dashboard features
  loadRealTimeStats(): void {
    this.tposervice.getRealTimeStats().subscribe({
      next: (data) => {
        this.realTimeStats = data;
      },
      error: (error) => {
        console.error('Error loading real-time stats:', error);
      }
    });
  }

  loadGrowthAnalytics(): void {
    this.tposervice.getGrowthAnalytics(6).subscribe({
      next: (data) => {
        this.growthAnalytics = data;
      },
      error: (error) => {
        console.error('Error loading growth analytics:', error);
      }
    });
  }

  loadRecentActivities(): void {
    this.tposervice.getRecentActivities(10).subscribe({
      next: (data) => {
        this.recentActivities = data;
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
      }
    });
  }

  loadProcessMetrics(): void {
    this.tposervice.getProcessMetrics().subscribe({
      next: (data) => {
        this.processMetrics = data;
      },
      error: (error) => {
        console.error('Error loading process metrics:', error);
      }
    });
  }

  loadDepartmentAnalytics(): void {
    this.tposervice.getDepartmentAnalytics().subscribe({
      next: (data) => {
        this.departmentAnalytics = data;
      },
      error: (error) => {
        console.error('Error loading department analytics:', error);
      }
    });
  }

  loadCompanyAnalytics(): void {
    this.tposervice.getCompanyAnalytics().subscribe({
      next: (data) => {
        this.companyAnalytics = data;
      },
      error: (error) => {
        console.error('Error loading company analytics:', error);
      }
    });
  }

  loadPlacementTrends(): void {
    this.tposervice.getPlacementTrends(12).subscribe({
      next: (data) => {
        this.placementTrends = data;
      },
      error: (error) => {
        console.error('Error loading placement trends:', error);
      }
    });
  }

  loadPerformanceAnalytics(): void {
    this.tposervice.getPerformanceAnalytics(12).subscribe({
      next: (data) => {
        this.performanceAnalytics = data;
      },
      error: (error) => {
        console.error('Error loading performance analytics:', error);
      }
    });
  }

  loadPackageDistribution(): void {
    this.tposervice.getPackageDistribution().subscribe({
      next: (data) => {
        this.packageDistribution = data;
      },
      error: (error) => {
        console.error('Error loading package distribution:', error);
      }
    });
  }

  loadHiringTrends(): void {
    this.tposervice.getHiringTrends(12).subscribe({
      next: (data) => {
        this.hiringTrends = data;
      },
      error: (error) => {
        console.error('Error loading hiring trends:', error);
      }
    });
  }

  loadSystemHealth(): void {
    this.tposervice.getSystemHealth().subscribe({
      next: (data) => {
        this.systemHealth = data;
      },
      error: (error) => {
        console.error('Error loading system health:', error);
      }
    });
  }

  loadDataIntegrity(): void {
    this.tposervice.getDataIntegrity().subscribe({
      next: (data) => {
        this.dataIntegrity = data;
      },
      error: (error) => {
        console.error('Error loading data integrity:', error);
      }
    });
  }

  loadDashboardNotifications(): void {
    this.tposervice.getDashboardNotifications().subscribe({
      next: (data) => {
        this.dashboardNotifications = data;
      },
      error: (error) => {
        console.error('Error loading dashboard notifications:', error);
      }
    });
  }

  // Export functionality methods
  exportDashboardData(): void {
    this.isExporting = true;
    
    this.tposervice.exportDashboardData('excel').subscribe({
      next: (data) => {
        this.downloadFile(data, `dashboard_report.xlsx`);
        this.isExporting = false;
      },
      error: (error) => {
        console.error('Error exporting dashboard data:', error);
        this.isExporting = false;
      }
    });
  }

  exportStudentData(department: string = '', status: string = ''): void {
    this.isExporting = true;
    
    this.tposervice.exportStudentData('excel', department, status).subscribe({
      next: (data) => {
        this.downloadFile(data, `students_report.xlsx`);
        this.isExporting = false;
      },
      error: (error) => {
        console.error('Error exporting student data:', error);
        this.isExporting = false;
      }
    });
  }

  exportCompanyData(): void {
    this.isExporting = true;
    
    this.tposervice.exportCompanyData('excel').subscribe({
      next: (data) => {
        this.downloadFile(data, `companies_report.xlsx`);
        this.isExporting = false;
      },
      error: (error) => {
        console.error('Error exporting company data:', error);
        this.isExporting = false;
      }
    });
  }

  exportYearlyBackup(): void {
    this.isExportingYearly = true;
    
    this.tposervice.exportYearlyBackup(this.selectedYear, 'excel').subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `yearly_backup_${this.selectedYear}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isExportingYearly = false;
      },
      error: (error) => {
        console.error('Error exporting yearly backup:', error);
        this.isExportingYearly = false;
      }
    });
  }

  loadYearlyAnalytics(year?: number): void {
    const targetYear = year || this.selectedYear;
    
    this.tposervice.getYearlyAnalytics(targetYear).subscribe({
      next: (data) => {
        this.yearlyAnalytics = data;
      },
      error: (error) => {
        console.error('Error loading yearly analytics:', error);
      }
    });
  }

  loadYearlyComparison(): void {
    this.tposervice.getYearlyComparison(3).subscribe({
      next: (data) => {
        this.yearlyComparison = data;
      },
      error: (error) => {
        console.error('Error loading yearly comparison:', error);
      }
    });
  }

  refreshDashboardData(): void {
    this.tposervice.refreshDashboardData().subscribe({
      next: (response) => {
        console.log('Dashboard data refreshed:', response);
        this.loadDashboardData();
        this.loadAllDashboardComponents();
      },
      error: (error) => {
        console.error('Error refreshing dashboard data:', error);
      }
    });
  }

  generateCustomReport(reportParams: any): void {
    this.tposervice.generateCustomReport(reportParams).subscribe({
      next: (data) => {
        this.customReports = data;
      },
      error: (error) => {
        console.error('Error generating custom report:', error);
      }
    });
  }

  // Method to change selected year
  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadYearlyAnalytics(year);
  }

  // Get available years for dropdown
  getAvailableYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }

  private downloadFile(data: any, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}