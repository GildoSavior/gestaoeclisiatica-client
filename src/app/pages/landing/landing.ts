import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget.component';
import { HeroWidget } from './components/herowidget';
import { FeaturesWidget } from './components/featureswidget';
import { HighlightsWidget } from './components/highlightswidget';
import { PricingWidget } from './components/pricingwidget';
import { FooterWidget } from './components/footerwidget';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterModule, TopbarWidget, HeroWidget, FeaturesWidget, HighlightsWidget, PricingWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, CarouselModule, CardModule],
    templateUrl: 'landing.html',
})
export class Landing {
    imagens = [
        { src: 'assets/carousel-images/image-1.jpeg', alt: 'Igreja 1' },
        { src: 'assets/carousel-images/image-2.jpeg', alt: 'Igreja 2' },
        { src: 'assets/carousel-images/image-1.jpeg', alt: 'Igreja 3' },
      ];

      eventos = [
        { horario: '9h00', titulo: 'Sábado de manhã', descricao: 'Culto' },
        { horario: '10h30', titulo: 'Sábado de manhã', descricao: 'Escola Sabatina' },
        { horario: '18h00', titulo: 'Sábado à tarde', descricao: 'Culto Jovem' },
        { horario: '19h30', titulo: 'Domingo', descricao: 'Culto Evangelístico' },
        { horario: '19h30', titulo: 'Quarta-feira', descricao: 'Culto de Oração' }
      ];
}
