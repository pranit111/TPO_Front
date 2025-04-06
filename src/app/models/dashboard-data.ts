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
    topStudents: {
      rank: number;
      name: string;
      department: string;
      package: string;
      company: string;
    }[];
  }