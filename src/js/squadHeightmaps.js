/**
 * Squad Heightmap
 * Load an heightmap in memory and calculate heights for given LatLng Points
 * @class squadHeightmap
 */
export default class SquadHeightmap {

    /**
     * Load the heightmap for the given map
     * @param {L.map} [map]
     */
    constructor(map) {
        this.map = map;
        this.width = 500;
        this.heightmapScaling = this.width / this.map.pixelSize;
        this.json = this.loadHeightmapJson(`maps${this.map.activeMap.mapURL}heightmap.json`);
    }


    /**
     * Load the heightmap from a JSON file
     * @param {string} [url] - URL to the JSON file
     */
    async loadHeightmapJson(url) {
        try {
            const response = await fetch(url); // Fetch the JSON file
            let data = await response.json();
            this.json = data;
        } catch (error) {
            console.error("Failed to load heightmap:", error);
        }
    }


    /**
     * Calculate heights for a given LatLng Point
     * https://github.com/sh4rkman/SquadCalc/wiki/Deducing-Altitude
     * @param {LatLng} [latlng] - LatLng Point
     * @returns {integer} - height in meters
     */
    getHeight(latlng){
        var row = Math.round(latlng.lat * -this.heightmapScaling);
        var col = Math.round(latlng.lng * this.heightmapScaling);
        var height = 0; // Todo: Implement a better way to handle this, like returning infinity

        if (this.json[row] && typeof this.json[row][col] !== "undefined") {
            height = this.json[row][col];
        }

        return height;
    }

    
    /**
     * Calculate a path of heights between two points
     * @param {LatLng} [mortarLatlng] - LatLng Point
     * @param {LatLng} [targetLatlng] - LatLng Point
     * @returns {Array} - Array containing all the Heights between weapon and Target in meters
     */
    getHeightPath(mortarLatlng, targetLatlng, STEP = 100) {
        const END = {lat: targetLatlng.lat, lng: targetLatlng.lng};
        var start = {lat: mortarLatlng.lat, lng: mortarLatlng.lng};
        var heightPath = [];
        var latDiff =  END.lat - start.lat;
        var lngDiff =  END.lng - start.lng;
        
        for (let i=0; i < STEP; i++){
            heightPath.push(this.getHeight(start));
            start.lat += latDiff/STEP;
            start.lng += lngDiff/STEP;
        }
    
        return heightPath;
    }

}