import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { generalAnimation, slideDownAnimation } from './animations';
import { MostrarQuienSoyDirective } from './directives/mostrar-quien-soy.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MostrarQuienSoyDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [generalAnimation, slideDownAnimation]
})
export class AppComponent {
  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }

}
