export default function isThemeActive(startMonth, startDay, endMonth, endDay) {
    const currentDate = new Date();
    const start = new Date(currentDate.getFullYear(), startMonth - 1, startDay);
    const end = new Date(currentDate.getFullYear(), endMonth - 1, endDay);

    return currentDate >= start && currentDate <= end;
}