import { Component, signal, ViewChild } from '@angular/core';
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
import { CabecContrib } from '../../models/cabec-contrib.model';
import { CabecService } from '../../service/contrib/contrib.service';
import { HttpResponse } from '../../dto/http-response.model';
import { ContribuitionsDetailsComponent } from './contribuitions-details/contribuitions-details.component';
import { LineContribuitionsDetailsComponent } from './line-contribuitions-details/line-contribuitions-details.component';
import { Router } from '@angular/router';
import { ModeUtil } from '../../mode.utils';
import { LineContrib } from '../../models/line-contrib.model';

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
    selector: 'app-contribuitions',
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
        ContribuitionsDetailsComponent,
        LineContribuitionsDetailsComponent
    ],
    templateUrl: './contribuitions.component.html',
    styleUrl: './contribuitions.component.scss',
    providers: [MessageService, CabecService, ConfirmationService]
})
export class ContribuitionsComponent {
    mode: 'admin' | 'client' = 'client';

    contribDialog: boolean = false;

    contribuitions = signal<CabecContrib[]>([]);

    contrib!: CabecContrib;
    line!: LineContrib;

    showLineContribModal: boolean = false;

    selectedContrib: CabecContrib | null = null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private readonly cabecService: CabecService,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService,
        private router: Router
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.mode = ModeUtil.getCurrentMode(this.router.url);
        this.loadDemoData();
    }

    onContribClick(contrib: CabecContrib) {
        this.contrib = { ...contrib };
        this.showLineContribModal = true;
    }

    loadDemoData() {
        this.cabecService.getAll().subscribe(
            (response: HttpResponse<CabecContrib[]>) => {
                this.contribuitions.set(response.data);
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
            ...(this.mode === 'admin' ? [{ field: 'total', header: 'Total' }] : []),
            ...(this.mode === 'admin' ? [{ field: 'totalApproved', header: 'Total Aprovado' }] : []),
            { field: 'eventCode', header: 'Evento' },
            ...(this.mode === 'admin' ? [{ field: 'cabecStatus', header: 'Estado' }] : [])
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.contrib = {
            id: null,
            title: '',
            code: '',
            type: '', // certifique-se de usar um valor válido de ContribType (enum)
            description: '',
            total: 0,
            totalApproved: 0,
            createdAt: null,
            updatedAt: null,
            event_id: null,
            eventCode: '',
            cabecStatus: '' // certifique-se de usar um valor válido de ContribStatus (enum)
        };
        this.submitted = false;
        this.contribDialog = true;
    }

    saveContrib(contrib: CabecContrib) {}

    deleteContrib(contrib: CabecContrib) {}

    deleteSelectedContrib() {}

    editContrib(contrib: CabecContrib) {
        this.contribDialog = true;
    }

    handleSave(line: LineContrib) {
        console.log('Linha salva:', line);

        // Exemplo: você pode atualizar o array contribuitions ou fazer chamada ao backend
        this.messageService.add({
            severity: 'success',
            summary: 'Salvo',
            detail: 'Linha de contribuição salva com sucesso.'
        });
    }
}
