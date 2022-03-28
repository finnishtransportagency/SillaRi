import ISupervision from "../interfaces/ISupervision";

export const constructTimesForComparison = (departureTime: Date | undefined, supervisions: ISupervision[], currentIndex: number): Date[] => {
  const dates: Date[] = [];
  if (departureTime) {
    dates.push(departureTime);
  }
  supervisions.forEach((supervision, index) => {
    if (index < currentIndex) {
      const { plannedTime } = supervision;
      if (plannedTime) {
        dates.push(plannedTime);
      }
    }
  });
  return dates;
};
