// shared/OrbitCalculator.ts

export class OrbitCalculator {
  private solarMass: number;
  private numberOfPlanets: number;

  constructor(solarMass: number, numberOfPlanets: number) {
    this.solarMass = solarMass;
    this.numberOfPlanets = numberOfPlanets;
  }

  public calculateOrbitalPeriods(): number[] {
    const orbitalPeriods: number[] = [];
    for (let i = 1; i <= this.numberOfPlanets; i++) {
      const period = this.calculateOrbitalPeriod(i);
      orbitalPeriods.push(period);
    }
    return orbitalPeriods;
  }

  private calculateOrbitalPeriod(planetIndex: number): number {
    // Simplified calculation using Kepler's third law
    const semiMajorAxis = planetIndex; // Assume each planet is 1 AU apart
    const period = Math.sqrt(Math.pow(semiMajorAxis, 3) / this.solarMass);
    return period;
  }
}
