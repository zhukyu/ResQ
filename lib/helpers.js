export function formatCoordinates(lat, lng) {
    const latDirection = lat >= 0 ? "N" : "S";
    const lngDirection = lng >= 0 ? "E" : "W";

    const latDegrees = Math.floor(Math.abs(lat));
    const latMinutes = Math.floor((Math.abs(lat) - latDegrees) * 60);
    const latSeconds = Math.round(
        ((Math.abs(lat) - latDegrees) * 60 - latMinutes) * 60
    );

    const lngDegrees = Math.floor(Math.abs(lng));
    const lngMinutes = Math.floor((Math.abs(lng) - lngDegrees) * 60);
    const lngSeconds = Math.round(
        ((Math.abs(lng) - lngDegrees) * 60 - lngMinutes) * 60
    );

    // return `${latDirection}, ${latDegrees}°${latMinutes}'${latSeconds}'', ${lngDirection}, ${lngDegrees}°${lngMinutes}'${lngSeconds}''`;
    return {
        latitude: `${latDirection}, ${latDegrees}°${latMinutes}'${latSeconds}''`,
        longitude: `${lngDirection}, ${lngDegrees}°${lngMinutes}'${lngSeconds}''`,
    };
}

export function formatTime(time, format) {
    const date = new Date(time);
    
    const options = {
        hour: "2-digit",
        minute: "2-digit",
    };

    return date.toLocaleTimeString(undefined, options);
}
