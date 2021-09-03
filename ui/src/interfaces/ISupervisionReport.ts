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
  otherObservations: string;
  additionalInfo: string;
  draft: boolean;
  created: Date;
  modified: Date;
}
