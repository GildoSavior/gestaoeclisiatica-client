import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabecContrib } from '../../../models/cabec-contrib.model';
import { LineContrib } from '../../../models/line-contrib.model';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinner } from 'primeng/progressspinner';
import { LineService } from '../../../service/contrib/line-contrib.service';

@Component({
    selector: 'app-line-contribuitions-details',
    templateUrl: './line-contribuitions-details.component.html',
    imports: [ButtonModule, FormsModule, CommonModule, DialogModule, FileUploadModule, ProgressSpinner],
    styleUrls: ['./line-contribuitions-details.component.scss']
})
export class LineContribuitionsDetailsComponent {
    @Input() contrib: CabecContrib = {} as CabecContrib;
    @Input() visible: boolean = false;
    @Input() submitted: boolean = false;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<void>();

    constructor(
        private readonly messageService: MessageService,
        private readonly lineService: LineService
    ) {}

    uploadedFile: any = null;
    imagePreview: string | ArrayBuffer | null = null;

    onFileSelected(event: any) {
        const file = event.files?.[0];

        if (file) {
            this.uploadedFile = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    isLoading = false;

    line: LineContrib = {
        id: 0,
        cabec_id: 0,
        cabecTitle: '',
        cabecCode: '',
        userEmail: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        total: 0,
        contribStatus: 'PENDING', // ou outro valor do enum ContribStatus
        image: ''
    };

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message
        });
    }

    private showSuccess(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: message
        });
    }

    hideDialog() {
        this.visibleChange.emit(false);
    }

    onSave(line: LineContrib) {
        if (!this.uploadedFile) {
            this.showError('É obrigatorio colocar o comprovativo');
            this.isLoading = false;
            return;
        }

        this.isLoading = true;
        line.cabecCode = this.contrib.code;
        line.cabec_id = this.contrib.id;
        line.cabecTitle = this.contrib.title;

        const saveObservable = this.lineService.createLine(line);

        saveObservable.subscribe({
            next: (response: any) => {
                const savedEvent = response.data;
                this.showSuccess('Evento salvo com sucesso');

                if (this.uploadedFile) {
                    if (line.id != null) {
                        this.uploadImage(line?.id);
                    }
                } else {
                    this.finishSaving();
                }
            },
            error: (err) => {
                this.isLoading = false;
                const erroMsg = err?.error?.message || 'Falha ao salvar o evento.';
                this.showError(erroMsg);
            }
        });

        this.isLoading = false;
        this.hideDialog();
        this.save.emit();
    }

    uploadImage(lineId: number) {
        const formData = new FormData();

        formData.append('file', this.uploadedFile.file);

        this.lineService.uploadLineImage(lineId, formData).subscribe({
            next: () => {
                this.showSuccess('Imagens enviadas com sucesso.');
                this.finishSaving();
            },
            error: (err) => {
                this.isLoading = false;
                const erroMessage = err?.error?.message || 'Falha ao enviar imagens.';
                this.showError(erroMessage);
            }
        });
    }

    finishSaving() {
        this.isLoading = false;
        this.hideDialog();
        this.save.emit();
        this.uploadedFile = []; // limpa o estado dos arquivos
    }
}



