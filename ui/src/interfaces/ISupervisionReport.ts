export default interface ISupervisionReport {
  id: number;
  supervisionId: number;
  drivingLineOk: boolean;
  drivingLineInfo: string;
  speedLimitOk: boolean;
  speedLimitInfo: string;
  anomalies: boolean;
  anomaliesDescription: string;
  surfaceDamage: boolean;
  seamDamage: boolean;
  bendsDisplacements: boolean;
  otherObservations: boolean;
  otherObservationsInfo: string;
  additionalInfo: string;
  draft: boolean;
}
