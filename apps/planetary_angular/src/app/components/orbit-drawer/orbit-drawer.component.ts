import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Planet {
  id: number;
  distance: number;
  period: number;
  name: string;
}

@Component({
  selector: 'app-orbit-drawer',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './orbit-drawer.component.html',
  styleUrls: ['./orbit-drawer.component.css']
})
export class OrbitDrawerComponent implements AfterViewInit {
  @Input() starMass = 1.0;
  @Input() numberOfPlanets = 0;
  @Input() systemInfo = 'The Dave System'
  @Output() systemUpdate = new EventEmitter<{
    numberOfPlanets: number;
    starMass: number;
    systemInfo: string;
  }>();

  planets: Planet[] = [];
  canvasWidth = 800;
  canvasHeight = 800;
  centerX = this.canvasWidth / 2;
  centerY = this.canvasHeight / 2;
  padding = 50;
  scaleFactor = 200;

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  ngOnInit() {
    this.initializePlanets();
  }

  ngAfterViewInit() {
    this.canvas = document.querySelector('canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      this.startAnimation();
    }
  }

  private resizeCanvas() {
    if (!this.canvas) return;

    const container = this.canvas.parentElement;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    this.canvas.width = width;
    this.canvas.height = height;

    this.canvasWidth = width;
    this.canvasHeight = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  initializePlanets() {
    this.planets = Array(this.numberOfPlanets).fill(null).map((_, index) => ({
      id: index,
      name: `Planet ${index + 1}`,
      distance: this.getDefaultDistance(index),
      period: 0
    }));
    this.updateOrbitalPeriods();
  }

  getDefaultDistance(index: number): number {
    return Math.round((0.4 * Math.pow(1.6, index)) * 10) / 10;
  }

  updateStarMass(value: number) {
    this.starMass = Math.max(0.1, value);
    this.updateOrbitalPeriods();
    this.emitUpdate();
  }

  updatesystemInfo(value: string) {
    this.systemInfo = value;
    this.emitUpdate();
  }

  updatePlanetCount(value: number) {
    const newCount = Math.max(0, Math.min(10, value));
    this.numberOfPlanets = newCount;

    if (newCount > this.planets.length) {
      while (this.planets.length < newCount) {
        this.planets.push({
          id: this.planets.length,
          name: `Planet ${this.planets.length + 1}`,
          distance: this.getDefaultDistance(this.planets.length),
          period: 0
        });
      }
    } else {
      this.planets = this.planets.slice(0, newCount);
    }

    this.updateOrbitalPeriods();
    this.emitUpdate();
  }

  updatePlanetDistance(index: number, value: number) {
    const newDistance = Math.max(0.1, value);

    if (index >= 0 && index < this.planets.length) {
      this.planets[index].distance = newDistance;
      this.updateOrbitalPeriods();
    }
  }

  updateOrbitalPeriods() {
    this.planets.forEach(planet => {
      planet.period = this.calculateOrbitalPeriod(planet.distance);
    });
  }

  calculateOrbitalPeriod(distance: number): number {
    return Math.sqrt(Math.pow(distance, 3) / this.starMass);
  }

  calculateScaleFactor(): number {
    if (this.planets.length === 0) return this.scaleFactor;

    const maxDistance = Math.max(...this.planets.map(p => p.distance));
    const maxRadius = Math.min(this.canvasWidth, this.canvasHeight) / 2 - this.padding;

    return maxRadius / maxDistance;
  }

  updateOrbitalVisualization() {
    if (!this.canvas || !this.ctx) {
      // Try to get the context if we don't have it
      this.canvas = document.querySelector('canvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return; // Exit if we still can't get the context
      } else {
        return; // Exit if we can't find the canvas
      }
    }

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.scaleFactor = this.calculateScaleFactor();

    // Draw grid
    this.drawGrid(this.ctx);

    // Draw star
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 8, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#FFD700';
    this.ctx.fill();
    this.ctx.strokeStyle = '#FFE55C';
    this.ctx.stroke();

    // Draw orbits and planets
    this.planets.forEach((planet, index) => {
      const orbitRadius = planet.distance * this.scaleFactor;

      // Draw orbit path
      this.ctx!.beginPath();
      this.ctx!.arc(this.centerX, this.centerY, orbitRadius, 0, 2 * Math.PI);
      this.ctx!.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx!.stroke();

      // Calculate planet position
      const angle = (Date.now() / (planet.period * 1000)) % (2 * Math.PI);
      const x = this.centerX + orbitRadius * Math.cos(angle);
      const y = this.centerY + orbitRadius * Math.sin(angle);

      // Draw planet trail
      this.drawPlanetTrail(this.ctx!, planet, index);

      // Draw planet
      this.ctx!.beginPath();
      this.ctx!.arc(x, y, 6, 0, 2 * Math.PI);
      this.ctx!.fillStyle = this.getPlanetColor(index);
      this.ctx!.fill();
    });

    requestAnimationFrame(() => this.updateOrbitalVisualization());
  }

  drawGrid(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    const maxDistance = Math.ceil(Math.max(...this.planets.map(p => p.distance)));
    for (let i = 1; i <= maxDistance; i++) {
      const radius = i * this.scaleFactor;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '12px Arial';
      ctx.fillText(`${i} AU`, this.centerX + radius + 5, this.centerY);
    }
  }

  drawPlanetTrail(ctx: CanvasRenderingContext2D, planet: Planet, index: number) {
    if (!ctx) return;

    const steps = 50;
    const orbitRadius = planet.distance * this.scaleFactor;
    const baseAngle = (Date.now() / (planet.period * 1000)) % (2 * Math.PI);

    ctx.beginPath();
    for (let i = 0; i < steps; i++) {
      const angle = baseAngle - (i * 0.1);
      const x = this.centerX + orbitRadius * Math.cos(angle);
      const y = this.centerY + orbitRadius * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.strokeStyle = `${this.getPlanetColor(index)}40`;
    ctx.stroke();
  }

  getPlanetColor(index: number): string {
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Cyan
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEEAD', // Yellow
      '#D4A5A5', // Pink
      '#9FA4C4', // Purple
      '#B5EAD7', // Mint
      '#E2F0CB', // Light Green
      '#FFCAD4'  // Light Pink
    ];
    return colors[index % colors.length];
  }

  emitUpdate() {
    this.systemUpdate.emit({
      numberOfPlanets: this.numberOfPlanets,
      starMass: this.starMass,
      systemInfo: this.systemInfo
    });
  }

  startAnimation() {
    this.updateOrbitalVisualization();
  }
}
