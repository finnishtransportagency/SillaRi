export default interface ISupervisionImage {
  id: number;
  supervisionId: number;
  objectKey: string;
  taken: string;
  filename: string;
  base64?: string;
}
