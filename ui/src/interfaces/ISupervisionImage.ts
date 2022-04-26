export default interface ISupervisionImage {
  id: number;
  supervisionId: number;
  objectKey: string;
  taken: string;
  filename: string;
  // mimetype: string;
  // encoding: string;
  base64?: string;
}
