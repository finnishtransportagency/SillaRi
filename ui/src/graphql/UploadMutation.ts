import { gql } from "@apollo/client";

class UploadMutation {
  static uploadMutation = gql`
    mutation singleUpload($crossingId: String!, $filename: String!, $base64image: String!, $taken: String!) {
      singleUpload(crossingId: $crossingId, filename: $filename, file: $base64image, taken: $taken) {
        id
        crossingId
        objectKey
        taken
        filename
        mimetype
        encoding
      }
    }
  `;
}

export default UploadMutation;
