import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, current } from "@reduxjs/toolkit";
import IFailedQuery from "../interfaces/IFailedQuery";
import ISupervisionImage from "../interfaces/ISupervisionImage";
import IImageItem from "../interfaces/IImageItem";
import INetworkStatus from "../interfaces/INetworkStatus";

interface IStateProps {
  images: IImageItem[];
  networkStatus: INetworkStatus;
}

const initialState: IStateProps = {
  images: [],
  networkStatus: {
    isFailed: {},
  },
};

const supervisionSlice = createSlice({
  name: "supervision",
  initialState,
  reducers: {
    SET_IMAGES: (state, action: PayloadAction<IImageItem[]>) => {
      console.log("SET_IMAGES", action.payload);
      return { ...state, images: action.payload };
    },
    UPDATE_IMAGES: (state, action: PayloadAction<ISupervisionImage[]>) => {
      // Remove any camera images from the state that have been uploaded, and so are now in the supervision images
      console.log("UPDATE_IMAGES", action.payload);
      const supervisionImages = action.payload || [];
      const cameraImages = current(state.images).reduce((acc: IImageItem[], image) => {
        const isStateImageInPayload = supervisionImages.some((supervisionImage) => supervisionImage.filename === image.filename);
        return isStateImageInPayload ? acc : [...acc, image];
      }, []);
      console.log("CAMERA_IMAGES", cameraImages);
      return { ...state, images: cameraImages };
    },
    SET_FAILED_QUERY: (state, action: PayloadAction<IFailedQuery>) => {
      // console.log("SET_FAILED_QUERY", action.payload);
      return { ...state, networkStatus: { ...state.networkStatus, isFailed: { ...state.networkStatus.isFailed, ...action.payload } } };
    },
  },
});

export const { actions } = supervisionSlice;
export default supervisionSlice;
