import { Component } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { ErrorService } from '../error.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-stud-profile',
  standalone: false,
  templateUrl: './stud-profile.component.html',
  styleUrl: './stud-profile.component.css'
})
export class StudProfileComponent {
  profileData: any = null; // Store the API response here
  profileImageUrl: string = 'default_prof_img.png'; // Default image  // Resume analysis properties
  isAnalyzing: boolean = false;
  showAnalysisModal: boolean = false;
  analysisResult: string = '';
  parsedAnalysis: any = null; // Store parsed JSON analysis
  analysisError: string = '';

  // Interview Guide properties
  isGeneratingGuide: boolean = false;
  showInterviewGuideModal: boolean = false;
  interviewGuideResult: string = '';
  parsedInterviewGuide: any = null; // Store parsed JSON interview guide
  interviewGuideError: string = '';

  get progressStyle(): string {
    return `conic-gradient(#0D5C68 ${this.profileData.avgMarks}%, #A2191F 0%)`;
  }
  constructor(private service: StudentService, private error: ErrorService, private http: HttpClient) {}

 // In your component.ts file
ngOnInit() {
  this.service.getprofile().subscribe({
    next: (response: any) => {
      console.log("Full Response from API:", response);
      this.profileData = response;
      
      localStorage.setItem("username", response.firstName + " " + response.lastName);
      
      // Check if the image exists and is not null or empty
      if (response.profileImageBase64 && response.profileImageBase64.trim() !== '') {
        // Make sure the base64 string doesn't already include the data URI prefix
        if (response.profileImageBase64.startsWith('data:')) {
          this.profileImageUrl = response.profileImageBase64;
        } else {
          this.profileImageUrl = `data:image/png;base64,${response.profileImageBase64}`;
        }
        console.log("Image URL set to:", this.profileImageUrl.substring(0, 30) + "...");
      } else {
        // Make sure the default image path is correct relative to your application
        this.profileImageUrl = 'assets/images/default_prof_img.png';
        console.log("Using default image:", this.profileImageUrl);
      }
    },
    error: (err) => {
      console.error("Error fetching profile:", err);
      // Fallback to default image on error
      this.profileImageUrl = 'assets/images/default_prof_img.png';
    }
  });
}

// Resume analysis methods
analyzeResume() {
  this.isAnalyzing = true;
  this.showAnalysisModal = true;
  this.analysisError = '';
  this.parsedAnalysis = null;
  
  this.http.post('http://localhost:8080/api10/evaluate_resume', {}, { responseType: 'text' })
    .subscribe({
      next: (response: string) => {
        try {
          // Clean the response (remove triple quotes if present)
          let cleanedResponse = response;
          if (response.startsWith('```json') && response.endsWith('```')) {
            cleanedResponse = response.slice(7, -3);
          } else if (response.startsWith('```') && response.endsWith('```')) {
            cleanedResponse = response.slice(3, -3);
          }
          
          // Try to parse the response as JSON
          this.parsedAnalysis = JSON.parse(cleanedResponse.trim());
          this.analysisResult = response;
          console.log('Parsed Resume Analysis:', this.parsedAnalysis);
        } catch (e) {
          console.error('Failed to parse resume analysis JSON:', e);
          // If it's not JSON, treat it as plain text
          this.analysisResult = response;
          this.parsedAnalysis = null;
        }
        this.isAnalyzing = false;
      },
      error: (err) => {
        console.error('Error analyzing resume:', err);
        this.analysisError = 'Sorry, there was an error analyzing your resume. Please try again later.';
        this.isAnalyzing = false;
        this.error.setError('Failed to analyze resume. Please try again later.');
      }
    });
}

closeAnalysisModal() {
  this.showAnalysisModal = false;
  this.analysisResult = '';
  this.parsedAnalysis = null;
  this.analysisError = '';
  this.isAnalyzing = false;
}

// Helper methods for analysis visualization
getRatingColor(rating: number): string {
  if (rating >= 8) return '#10B981'; // Green
  if (rating >= 6) return '#F59E0B'; // Yellow
  return '#EF4444'; // Red
}

getRatingWidth(rating: number): string {
  return `${(rating / 10) * 100}%`;
}

getRatingText(rating: number): string {
  if (rating >= 8) return 'Excellent';
  if (rating >= 6) return 'Good';
  if (rating >= 4) return 'Average';
  return 'Needs Improvement';
}

// Helper methods for enhanced resume analysis
getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'high': return '#EF4444'; // Red
    case 'medium': return '#F59E0B'; // Yellow
    case 'low': return '#10B981'; // Green
    default: return '#6B7280'; // Gray
  }
}

getPriorityIcon(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
}

getSkillGapsByPriority(): any[] {
  if (!this.parsedAnalysis?.learning_recommendations?.skill_gaps) {
    return [];
  }
  
  return this.parsedAnalysis.learning_recommendations.skill_gaps.sort((a: any, b: any) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
           (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
  });
}

hasInterviewInsights(): boolean {
  return this.parsedAnalysis?.interview_insights && 
         (this.parsedAnalysis.interview_insights.skills_mismatch?.length > 0 ||
          this.parsedAnalysis.interview_insights.hidden_strengths?.length > 0 ||
          this.parsedAnalysis.interview_insights.consistency_issues?.length > 0);
}

hasLearningRecommendations(): boolean {
  return this.parsedAnalysis?.learning_recommendations &&
         (this.parsedAnalysis.learning_recommendations.skill_gaps?.length > 0 ||
          this.parsedAnalysis.learning_recommendations.general_improvements?.length > 0);
}

hasStudyPlan(): boolean {
  return this.parsedAnalysis?.study_plan && 
         (this.parsedAnalysis.study_plan.week_1_2?.length > 0 ||
          this.parsedAnalysis.study_plan.week_3_4?.length > 0 ||
          this.parsedAnalysis.study_plan.month_2?.length > 0);
}

// Interview Guide methods
openInterviewGuide() {
  this.isGeneratingGuide = true;
  this.showInterviewGuideModal = true;
  this.interviewGuideError = '';
  this.parsedInterviewGuide = null;
  
  this.http.post('http://localhost:8080/api10/interview_guide', {}, { responseType: 'text' })
    .subscribe({
      next: (response: string) => {
        try {
          // Clean the response (remove triple quotes if present)
          let cleanedResponse = response;
          if (response.startsWith('```json') && response.endsWith('```')) {
            cleanedResponse = response.slice(7, -3);
          } else if (response.startsWith('```') && response.endsWith('```')) {
            cleanedResponse = response.slice(3, -3);
          }
          
          // Try to parse the response as JSON
          this.parsedInterviewGuide = JSON.parse(cleanedResponse.trim());
          this.interviewGuideResult = response;
          console.log('Parsed Interview Guide:', this.parsedInterviewGuide);
        } catch (e) {
          console.error('Failed to parse interview guide JSON:', e);
          // If it's not JSON, treat it as plain text
          this.interviewGuideResult = response;
          this.parsedInterviewGuide = null;
        }
        this.isGeneratingGuide = false;
      },
      error: (err) => {
        console.error('Error generating interview guide:', err);
        this.interviewGuideError = 'Sorry, there was an error generating your interview guide. Please try again later.';
        this.isGeneratingGuide = false;
        this.error.setError('Failed to generate interview guide. Please try again later.');
      }
    });
}

closeInterviewGuideModal() {
  this.showInterviewGuideModal = false;
  this.interviewGuideResult = '';
  this.parsedInterviewGuide = null;
  this.interviewGuideError = '';
  this.isGeneratingGuide = false;
}

// Utility method for copying text to clipboard
copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    // You can add a toast notification here if you have one
    console.log('Text copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}
}
