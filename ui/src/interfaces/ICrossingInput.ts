export default interface ICrossingInput {
  id: number;
  bridgeId: number;
  started: string;
  drivingLineInfo: boolean;
  drivingLineInfoDesc: string;
  speedInfo: boolean;
  speedInfoDesc: string;
  exceptionsInfo: boolean;
  exceptionsInfoDesc: string;
  describe: boolean;
  descriptionDesc: string;
  extraInfoDesc: string;
  permantBendings: boolean;
  twist: boolean;
  damage: boolean;
}
