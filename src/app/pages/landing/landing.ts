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

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, HeroWidget, FeaturesWidget, HighlightsWidget, PricingWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, CarouselModule],
    templateUrl: 'landing.html',
})
export class Landing {
    imagens = [
        { src: 'assets/carousel-images/image-1.jpeg', alt: 'Igreja 1' },
        { src: 'assets/carousel-images/image-3.jpg', alt: 'Igreja 2' },
        { src: 'assets/carousel-images/image-2.jpg', alt: 'Igreja 3' },
      ];
}
