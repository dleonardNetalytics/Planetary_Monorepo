import { Component, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrbitCalculator } from '@planetary-monorepo/shared-utils';

@Component({
  selector: 'app-orbit-drawer',
  templateUrl: './orbit-drawer.component.html',
  styleUrls: ['./orbit-drawer.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class OrbitDrawerComponent implements AfterViewInit {
  @Output() formSubmit = new EventEmitter<{ numberOfPlanets: number; starMass: number }>();
  @ViewChild('orbitCanvas') orbitCanvas!: ElementRef<HTMLCanvasElement>;

  orbitForm: FormGroup;
  orbitalPeriods: number[] = [];
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private startTime: number = 0;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.orbitForm = this.fb.group({
      solarMass: [null, [Validators.required, Validators.min(0.1)]],
      numberOfPlanets: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngAfterViewInit() {
    if (this.orbitCanvas && this.orbitCanvas.nativeElement) {
      this.ctx = this.orbitCanvas.nativeElement.getContext('2d')!;
    } else {
      console.error('Canvas element is not available.');
    }
  }

  calculateOrbits() {
    if (this.orbitForm.valid) {
      const { solarMass, numberOfPlanets } = this.orbitForm.value;
      const calculator = new OrbitCalculator(solarMass, numberOfPlanets);
      this.orbitalPeriods = calculator.calculateOrbitalPeriods();
      this.formSubmit.emit({ numberOfPlanets, starMass: solarMass });

      this.cdr.detectChanges(); // Ensure the view is updated

      if (this.orbitCanvas && this.orbitCanvas.nativeElement) {
        this.ctx = this.orbitCanvas.nativeElement.getContext('2d')!;
        if (this.ctx) {
          this.startAnimation();
        } else {
          console.error('Canvas context is not available.');
        }
      } else {
        console.error('Canvas element is not available.');
      }
    }
  }

  private startAnimation() {
    this.startTime = performance.now();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animate();
  }

  private animate() {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - this.startTime) / 1000; // Convert to seconds

    this.drawOrbits(this.orbitForm.value.numberOfPlanets, elapsedTime);
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private drawOrbits(numberOfPlanets: number, elapsedTime: number) {
    const canvas = this.orbitCanvas.nativeElement;
    const ctx = this.ctx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;
    const colors = ['blue', 'red', 'green', 'orange', 'purple', 'pink', 'cyan', 'magenta'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the star at the center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();

    // Draw the orbits and planets
    for (let i = 1; i <= numberOfPlanets; i++) {
      const radius = (i / numberOfPlanets) * maxRadius;
      const angle = (elapsedTime / this.orbitalPeriods[i - 1]) * 2 * Math.PI; // Calculate angle based on time

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'white';
      ctx.stroke();

      // Draw the planet at the calculated angle
      const planetX = centerX + radius * Math.cos(angle);
      const planetY = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(planetX, planetY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = colors[i % colors.length]; // Assign color based on index
      ctx.fill();
    }
  }
}
