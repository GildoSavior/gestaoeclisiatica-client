import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { NewsService } from '../../../service/news/news.service';
import { NewsModel } from '../../../models/news.model';

@Component({
  standalone: true,
  selector: 'app-recent-news-widget',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule],
  template: `
    <div class="card !mb-8">
      <div class="font-semibold text-xl mb-4">Notícias Recentes</div>

      <p-table [value]="news" [paginator]="true" [rows]="5" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>Imagem</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Autor</th>
            <th>Data</th>
            <th>Ver</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-item>
          <tr>
            <td style="width: 15%; min-width: 5rem;">
              <ng-container *ngIf="item.imagesUrls?.length; else noImage">
                <img
                  [src]="item.imagesUrls[0]"
                  class="shadow-lg rounded"
                  alt="thumb"
                  width="50"
                  height="50"
                />
              </ng-container>
              <ng-template #noImage>—</ng-template>
            </td>

            <td style="width: 20%;">{{ item.title }}</td>
            <td style="width: 30%;">{{ item.content }}</td>
            <td style="width: 15%;">{{ item.author }}</td>
            <td style="width: 15%;">{{ item.publishDate | date: 'short' }}</td>
            <td style="width: 5%;">
              <button
                pButton
                pRipple
                type="button"
                icon="pi pi-eye"
                class="p-button p-button-text p-button-icon-only"
                (click)="openNews(item)"
              ></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  providers: [NewsService]
})
export class RecentNewsWidget {
  news: NewsModel[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe({
      next: (res) => {
        this.news = res.data ?? [];
      },
      error: (err) => {
        console.error('Erro ao buscar notícias:', err);
      }
    });
  }

  openNews(item: NewsModel): void {
    console.log('Visualizar notícia:', item);
    // Aqui você pode abrir um modal ou redirecionar para outra rota
  }
}
