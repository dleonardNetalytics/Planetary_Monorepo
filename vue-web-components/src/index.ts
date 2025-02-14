import { defineCustomElement } from 'vue';
import PlanetaryPageHeader from './components/PlanetaryPageHeader.vue';

const PlanetaryPageHeaderElement = defineCustomElement(PlanetaryPageHeader);

customElements.define('app-planetary-page-header', PlanetaryPageHeaderElement);
