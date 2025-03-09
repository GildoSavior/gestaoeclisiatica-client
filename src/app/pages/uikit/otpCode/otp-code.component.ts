import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-code',
  templateUrl: './otp-code.component.html',
  styleUrls: ['./otp-code.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class OtpCodeComponent {
  // Array que armazena cada dígito do código
  codeDigits: string[] = ['', '', '', '', '', ''];

  // Chamado sempre que o usuário digitar algo no campo
  onDigitInput(event: any, index: number) {
    const inputValue = event.target.value;
    // Permite apenas um caractere (ou filtra se quiser só dígitos)
    if (inputValue.length > 1) {
      this.codeDigits[index] = inputValue.charAt(inputValue.length - 1);
    } else {
      this.codeDigits[index] = inputValue;
    }

    // Se o usuário digitou e não está no último input, move o foco para o próximo
    if (inputValue && index < this.codeDigits.length - 1) {
      const nextInput = document.getElementById('digit-' + (index + 1));
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  }

  // Combina os dígitos em uma string
  getCode(): string {
    return this.codeDigits.join('');
  }

  // Exemplo de método para enviar ou validar
  validateCode() {
    const code = this.getCode();
    console.log('Código digitado:', code);
    // Chamar seu serviço ou emitir evento
  }
}
