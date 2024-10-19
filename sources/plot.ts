import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { DOMParser } from "linkedom";

if (import.meta.main) {
  const dateNow = new Date();
  const dateStart = d3.utcMonday.floor(d3.utcMonday.offset(dateNow, -1));
  const dateEnd = d3.utcFriday.ceil(d3.utcFriday.offset(dateNow, 0));
  console.log(dateStart, dateEnd);

  const createSvgDocument = () => {
    const parser = new DOMParser();
    return parser.parseFromString("<svg>", "image/svg+xml");
  };
  const svgDocument = createSvgDocument();
  const svg = Plot.plot({
    document: svgDocument,
  });
  console.log(svg.toString());
}
