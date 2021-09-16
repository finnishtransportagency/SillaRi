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
  jointDamage: boolean;
  bendOrDisplacement: boolean;
  otherObservations: boolean;
  otherObservationsInfo: string;
  additionalInfo: string;
  draft: boolean;
}
