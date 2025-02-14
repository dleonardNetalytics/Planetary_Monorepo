import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrbitDrawerComponent } from './components/orbit-drawer/orbit-drawer.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import '../../../../dist/vue-web-components/index.mjs';

@Component({
  standalone: true,
  imports: [RouterModule, OrbitDrawerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'Solar System';
  systemInfo = 'Milky Way';
  numberOfPlanets = 8;
  starMass = 1.0;

  updateHeader(data: { numberOfPlanets: number; starMass: number }) {
    this.numberOfPlanets = data.numberOfPlanets;
    this.starMass = data.starMass;
  }
}
