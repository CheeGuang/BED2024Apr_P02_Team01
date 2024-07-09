class Map {
  static async getMapApiKey() {
    // Retrieve the API key from a secure location such as environment variables
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    return apiKey;
  }
}

module.exports = Map;
