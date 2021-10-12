import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import moment from "moment";

export const groupSupervisionsByDate = (supervisions: ISupervision[]): ISupervisionDay[] => {
  const supervisionDays: ISupervisionDay[] = [];

  supervisions.forEach((supervision) => {
    const existingDayMatch: ISupervisionDay[] = supervisionDays.filter((supervisionDay) => {
      return moment(supervision.plannedTime).isSame(moment(supervisionDay.date), "day");
    });
    // Should be only one match if found
    if (existingDayMatch.length > 0) {
      existingDayMatch[0].supervisions.push(supervision);
    } else {
      const newSupervisionDay: ISupervisionDay = { date: supervision.plannedTime, supervisions: [supervision] };
      supervisionDays.push(newSupervisionDay);
    }
  });
  supervisionDays.sort((a, b) => moment(a.date).diff(moment(b.date), "days"));
  return supervisionDays;
};
