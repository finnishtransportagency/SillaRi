import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";

export default class UserVectorLayer extends VectorLayer {
  constructor() {
    // The marker feature will be added after initialisation
    const userSource = new VectorSource({ features: [] });

    // Note: to get this to work, the following has been added to location.svg: width='32px' height='32px' fill='#fff'
    const userStyle = new Style({
      image: new Icon({
        src: "assets/location.svg",
        color: "rgba(0, 102, 204, 1.0)",
        anchor: [0.5, 1],
      }),
    });

    // Create a vector layer showing the user position
    super({ source: userSource, style: userStyle });
    this.set("id", "route");
  }
}
