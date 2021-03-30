import { gql } from "@apollo/client";

class UploadMutation {
  static uploadMutation = gql`
    mutation singleUpload($crossingId: String!, $filename: String!, $base64image: String!) {
      singleUpload(crossingId: $crossingId, filename: $filename, file: $base64image) {
        id
        filename
        mimetype
        encoding
      }
    }
  `;
}

export default UploadMutation;
