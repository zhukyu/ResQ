import moment, { locale } from "moment";
import "moment/locale/vi";
import { loadLanguage } from "../lang/i18n";

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

export function formatTime(time, type = "fromNow", format = "YYYY-MM-DD") {

    const now = moment();
    const givenTime = moment(time);

    if (type === "fromNow") {
        return givenTime.fromNow();
    } else if (type === "calendar") {
        return givenTime.calendar();
    } else if (type === "format") {
        if (givenTime.isSame(now, "day")) {
            return givenTime.format("HH:mm"); // Return hh:mm if same day
        } else if (givenTime.isSame(now, "year")) {
            return givenTime.format("MM-DD"); // Return date only if within the same year
        } else {
            return givenTime.format("YYYY-MM-DD"); // Include year if not the same year
        }
    } else if (type === "customFormat") {
        return givenTime.format(format);
    } else {
        return givenTime.fromNow();
    }
}
