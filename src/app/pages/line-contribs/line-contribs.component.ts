import { Component, signal, ViewChild } from '@angular/core';
import { LineContrib } from '../../models/line-contrib.model';
import { LineService } from '../../service/contrib/line-contrib.service';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HttpResponse } from '../../dto/http-response.model';
import { Router } from '@angular/router';
import { LineContribuitionsDetailsComponent } from '../contribuitions/line-contribuitions-details/line-contribuitions-details.component';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-line-contribs',
    imports: [
      CommonModule,
      TableModule,
      FormsModule,
      ButtonModule,
      RippleModule,
      ToastModule,
      ToolbarModule,
      RatingModule,
      InputTextModule,
      TextareaModule,
      SelectModule,
      RadioButtonModule,
      InputNumberModule,
      DialogModule,
      TagModule,
      InputIconModule,
      IconFieldModule,
      ConfirmDialogModule,
      LineContribuitionsDetailsComponent
  ],
    templateUrl: './line-contribs.component.html',
    styleUrl: './line-contribs.component.scss'
})
export class LineContribsComponent {
    contribDialog: boolean = false;
    lines = signal<LineContrib[]>([]);

    showLineContribModal: boolean = false;

    selectedLine: LineContrib | null = null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private readonly lineService: LineService,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService,
        private router: Router
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.lineService.getLinesByAuthenticatedUser().subscribe(
            (response: HttpResponse<LineContrib[]>) => {
                this.lines.set(response.data);
            },

            (error) => {
                console.error('Erro ao buscar contribuições:', error);
            }
        );

        this.cols = [
            { field: 'code', header: 'Codigo' },
            { field: 'title', header: 'Titulo' },
            { field: 'type', header: 'Tipo' },
            { field: 'description', header: 'Descrição' },
            { field: 'createdAt', header: 'Data' },
            { field: 'status', header: 'Status' },
            { field: 'actions', header: 'Ações', customExportHeader: 'Ações' }
        ];
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    editLine(line: LineContrib) {
        this.selectedLine = { ...line };
        this.showLineContribModal = true;
    }

    deleteLine(line: LineContrib) {
        this.selectedLine = { ...line };
        this.showLineContribModal = true;
    }
}
