import { Component } from '@angular/core';

@Component({
  selector: 'app-tpoadmin',
  standalone: false,
  templateUrl: './tpoadmin.component.html',
  styleUrl: './tpoadmin.component.css'
})
export class TpoadminComponent {
  studentData = {
    total: 790,
    placed: 400,
    remaining: 390,
    placementRate: 50.34
  };

  insightsData = {
    highestPackage: '17 LPA',
    averagePackage: '8 LPA',
    topHiringCompany: 'TCS',
    topDepartment: 'CSE-DS'
  };

  companiesData = {
    total: 17,
    totalOpenings: 429,
    remaining: 107,
    // Data for bar chart
    companies: [
      { name: 'Company A', openings: 60 },
      { name: 'Company B', openings: 90 },
      { name: 'Company C', openings: 75 },
      { name: 'Company D', openings: 120 },
      { name: 'Company E', openings: 84 }
    ]
  };

  departmentsData = {
    totalDepartments: 7,
    eligibleStudents: 1083,
    remaining: 107
  };

  previousYearData = {
    totalPlaced: 1790,
    highestPackage: '23 LPA',
    totalApplicants: 5900
  };

  navItems = [
    { title: 'Dashboard', icon: 'home', active: true },
    { title: 'Students', icon: 'users' },
    { title: 'Companies', icon: 'building' },
    { title: 'Placements', icon: 'briefcase' },
    { title: 'Reports', icon: 'chart-bar' },
    { title: 'Settings', icon: 'cog' }
  ];
}
