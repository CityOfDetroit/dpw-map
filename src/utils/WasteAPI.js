/**
 * Returns the API endpoint for the City of Detroit Waste Schedule API.
 * @param {number} routeNum - The number denoting the waste pickup route.
 * @param {string} year - The year formatted as YYYY.
 * @param {string} month - The month formatted as MM and 1-indexed.
 * @returns {string} - A REST API endpoint URL.
 */
function buildWasteAPI(routeNum, year, month) {
  return `https://apis.detroitmi.gov/waste_schedule/details/${routeNum}/year/${year}/month/${month}/`;
}

export {buildWasteAPI};