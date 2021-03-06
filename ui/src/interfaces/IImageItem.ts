export default interface IImageItem {
  id: string;
  filename: string;
  dataUrl: string | undefined;
  date: Date;
  base64: string;
}
