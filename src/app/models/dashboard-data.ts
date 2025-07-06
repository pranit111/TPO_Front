// dashboard-data.model.ts
export interface DashboardData {
    studentData: {
      total: number;
      placed: number;
      remaining: number;
      placementRate: number;
      averagePackage: number;
    };
    companiesData: {
      total: number;
      totalOpenings: number;
      remaining: number;
      companies: {
        name: string;
        openings: number;
      }[];
    };
    insightsData: {
      highestPackage: string;
      averagePackage: string;
      topHiringCompany: string;
      topDepartment: string;
    };
    departmentsData: {
      totalDepartments: number;
      eligibleStudents: number;
      remaining: number;
    };
    // Add the actual department stats array from backend
    departmentStats: {
      departmentName: string;
      totalStudents: number;
      placedStudents: number;
      unplacedStudents: number;
      averagePackage: number;
      placementPercentage: number;
      topCompany: string | null;
      highestPackage: number;
    }[];
    topStudents: {
      rank: number;
      name: string;
      department: string;
      packageAmount: string; // Changed from 'package' to 'packageAmount'
      company: string;
    }[];
    // Add other backend fields
    placementTrends: {
      dates: string[];
      placedCounts: number[];
      unplacedCounts: number[] | null;
      averagePackages: number[];
      trend: string;
    };
    monthlyPlacements: {
      month: string;
      totalPlaced: number;
      totalUnplaced: number;
      averagePackage: number;
      newCompanies: number;
      totalApplications: number;
    }[];
    processMetrics: {
      totalInterviews: number;
      totalOffers: number;
      totalAcceptances: number;
      pendingApplications: number;
      upcomingInterviews: number;
      documentsVerified: number;
      documentsPending: number;
      averageInterviewScore: number;
      offerAcceptanceRate: number;
      activeProcesses: number;
    };
    packageDistribution: {
      packageRange: string;
      studentCount: number;
      percentage: number;
    }[];
    recentActivities: {
      activities: {
        type: string;
        description: string;
        date: string;
        status: string;
        studentName: string;
        companyName: string;
      }[];
      totalCount: number;
    };
    companyAnalytics: {
      totalCompanies: number;
      activeCompanies: number;
      newCompaniesThisYear: number;
      topPerformingCompanies: any | null;
      companiesByCategory: any | null;
      averagePackageOffered: number;
    };
  }