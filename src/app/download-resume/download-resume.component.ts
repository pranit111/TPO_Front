import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DownloadResumeService } from '../download-resume.service';

@Component({
  selector: 'app-download-resume',
  standalone: false,
  templateUrl: './download-resume.component.html',
  styleUrl: './download-resume.component.css'
})
export class DownloadResumeComponent {
  pdfUrl: any;
  id: number = 0;
  type: string = '';
  course: string = '';
  constructor(    private downloadResumeService: DownloadResumeService,
    private sanitizer: DomSanitizer
  ,private route: ActivatedRoute) { }


  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id')) ?? 0;
    this.type = this.route.snapshot.paramMap.get('type') ?? '';
    this.course = this.route.snapshot.paramMap.get('course') ?? '';
  
    if (this.type === 'cv') {
      this.downloadResumeService.getResumePdf(this.id).subscribe(pdfBlob => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      });
    } else if (
      this.type === 'result' &&
      ['ssc', 'hsc', 'diploma'].includes(this.course.toLowerCase())
    ) {
      this.downloadResumeService.getResultPdf(this.id, this.course).subscribe(pdfBlob => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      });
    } else {
      // Optionally handle invalid type or course
      console.warn('Invalid download type or course');
    }
  }
  
}
