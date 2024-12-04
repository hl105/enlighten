interface PlanetInfo {
  name: string;
  constellation: string;
  rightAscension: string; // In "HH:MM:SS" format
  declination: string;    // In "±DD:MM:SS" format
  altitude: string;       // Degrees
  azimuth: string;        // Degrees
  aboveHorizon: string;
  magnitude: string;
  nakedEyeObject: boolean;
  imageUrl: string;       // URL of the planet's image
}

class PlanetVisibilityService {
  private static baseApiUrl = "https://api.visibleplanets.dev/v3";
  private static commonsBaseUrl = "https://commons.wikimedia.org/w/api.php";

  /**
   * Fetch visible planets data from the API.
   * @param latitude Latitude of the observation point.
   * @param longitude Longitude of the observation point.
   * @returns An array of planet information.
   */
  async getVisiblePlanets(latitude: number, longitude: number): Promise<PlanetInfo[]> {
    const url = `${PlanetVisibilityService.baseApiUrl}?latitude=${latitude}&longitude=${longitude}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch visible planets: ${response.statusText}`);
    }

    const data = await response.json();
    const planetPromises = data.data.map((planet: any) => this.mapPlanetData(planet));
    return Promise.all(planetPromises); // Ensure all async calls are resolved
  }

  /**
   * Map API response data to the PlanetInfo interface.
   * @param planet Raw planet data from the API.
   * @returns A PlanetInfo object.
   */
  private async mapPlanetData(planet: any): Promise<PlanetInfo> {
    const rightAscension = `${planet.rightAscension.hours}:${planet.rightAscension.minutes}:${planet.rightAscension.seconds.toFixed(1)}`;
    const declination = `${planet.declination.negative ? "-" : "+"}${planet.declination.degrees}:${planet.declination.arcminutes}:${planet.declination.arcseconds.toFixed(1)}`;

    return {
      name: planet.name,
      constellation: planet.constellation,
      rightAscension,
      declination,
      altitude: planet.altitude.toString(),
      azimuth: planet.azimuth.toString(),
      aboveHorizon: planet.aboveHorizon.toString(),
      magnitude: planet.magnitude.toString(),
      nakedEyeObject: planet.nakedEyeObject,
      imageUrl: await this.getPlanetImageUrl(planet.name),
    };
  }

  /**
   * Generate a URL for a planet's image from Wikimedia Commons.
   * @param planetName Name of the planet.
   * @returns A URL string for the planet's image.
   */
  private async getPlanetImageUrl(planetName: string): Promise<string> {
    const formattedPlanetName = planetName.replace(/\s/g, "_"); // Replace spaces with underscores for URL compatibility
    const url = `${PlanetVisibilityService.commonsBaseUrl}?action=query&titles=File:${formattedPlanetName}.jpg&prop=imageinfo&iiprop=url&format=json&origin=*`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch planet image from Wikimedia Commons for ${planetName}: ${response.statusText}`);
      }

      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];

      if (pageId === "-1" || !pages[pageId].imageinfo) {
        console.warn(`No image found for planet ${planetName}. Using placeholder image.`);
        return "https://via.placeholder.com/150"; // Fallback to placeholder image
      }

      const imageInfo = pages[pageId].imageinfo[0];
      return imageInfo.url || "https://via.placeholder.com/150"; // Use placeholder if no URL exists
    } catch (error) {
      console.error(`Error fetching image for planet ${planetName}:`, error);
      return "https://via.placeholder.com/150"; // Fallback to placeholder on error
    }
  }

}

export { PlanetVisibilityService };
export type { PlanetInfo };

