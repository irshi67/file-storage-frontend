import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileService } from './file.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'filetransfer';
  filenames: string[] = [];


  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.getFiles();
  }


  onUploadFiles(files: File[]): void {
    const formData = new FormData();
    for (const file of files) { formData.append('file', file); }
    this.fileService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
    },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }


  onDownloadFile(filename: string): void {
    this.fileService.download(filename).subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  getFiles(): void {
    this.fileService.get().subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  deleteFiles(filename: string): void {
    this.fileService.delete(filename).subscribe();
    this.filenames.splice(this.filenames.indexOf(filename));
  }


  private resportProgress(event: HttpEvent<string[] | Blob>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(event.loaded, event.total, 'Uploading');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(event.loaded, event.total, 'Downloading');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', event);
        break;
      case HttpEventType.Response:
        if (event.body instanceof Array) {
          for (const filename of event.body) {
            this.filenames.push(filename);
          }
        } else {
          saveAs(new File([event.body], event.headers.get('File-Name'),
            { type: `${event.headers.get('Content-Type')};charset=utf-8` }));
        }
        break;
      default:
        console.log(event);
    }
  }
  updateStatus(loaded: number, total: number | undefined, arg2: string) {
    
  }



}
