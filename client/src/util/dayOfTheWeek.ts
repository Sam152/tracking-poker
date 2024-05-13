const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export function dayOfTheWeek(date: Date) {
    return weekday[date.getDay()];
}
