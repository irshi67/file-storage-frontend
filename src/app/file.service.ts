import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiUrl}/file/upload`, formData,{
      reportProgress: true,
      observe: 'events'
    });
  }

  download(filename: string): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiUrl}/file/download/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }

  get(): Observable<HttpEvent<string[]>> {
    return this.http.get<string[]>(`${this.apiUrl}/file/get`,{
      reportProgress: true,
      observe: 'events'
    });
  }

  delete(filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/file/delete/${filename}`);
  }
}
