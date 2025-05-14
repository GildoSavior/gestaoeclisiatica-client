import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsModel } from '../../models/news.model';
import { HttpResponse } from '../../dto/http-response.model';
import { UserUtil } from '../user/userUtils';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly apiUrl = 'http://localhost:8080/api/news';

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = UserUtil.getUserData()?.jwtToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getAllNews(): Observable<HttpResponse<NewsModel[]>> {
    return this.http.get<HttpResponse<NewsModel[]>>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getNewsById(id: number): Observable<HttpResponse<NewsModel>> {
    return this.http.get<HttpResponse<NewsModel>>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createNews(news: NewsModel): Observable<HttpResponse<NewsModel>> {
    return this.http.post<HttpResponse<NewsModel>>(this.apiUrl, news, {
      headers: this.getHeaders()
    });
  }

  updateNews(id: number, news: NewsModel): Observable<HttpResponse<NewsModel>> {
    return this.http.put<HttpResponse<NewsModel>>(`${this.apiUrl}/${id}`, news, {
      headers: this.getHeaders()
    });
  }

  deleteNews(id: number | null): Observable<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  uploadImages(newsId: number, formData: FormData): Observable<any> {
    // Não adicionamos Content-Type manualmente; o Angular cuidará disso
    return this.http.post(`${this.apiUrl}/upload/${newsId}`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${UserUtil.getUserData()?.jwtToken}`
      })
    });
  }
}
