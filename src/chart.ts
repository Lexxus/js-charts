import { data as sourceData, RawData } from './data';

export function draw() {
  const STEP_X = 10;
  const chartData = sourceData[0];
  const svg = document.getElementById('chart') as unknown as SVGSVGElement;

  svg.append(drawChart(chartData));

  function drawChart(data: RawData): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g') as unknown as SVGGElement;
    const columns = data.columns.reduce<Record<string, Array<number>>>((res, col) => {
      res[col[0]] = col.slice(1) as Array<number>;

      return res;
    }, {});
    const graphs: Array<string> = [];
    const height = svg.height.baseVal.value;
    let x: Array<number>;
    let minX: number;
    let maxX: number;
    let xFactor: number;
    let yFactor: number;

    Object.keys(data.types).forEach((key) => {
      const chartType = data.types[key];

      if (chartType === 'x') {
        x = columns[key];
      } else {
        graphs.push(key);
      }
    });

    minX = x[0];
    maxX = x[x.length - 1];
    xFactor = STEP_X / ((maxX - minX) / x.length);

    graphs.forEach((id) => {
      const graph = columns[id];
      const minY = graph.reduce((currentMin, num) => Math.min(currentMin, num), Infinity);
      const maxY = graph.reduce((currentMax, num) => Math.max(currentMax, num), -Infinity);
      yFactor = height / (maxY - minY);
      const points = graph.map((y, i) => getXY(x[i], y));
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

      polyline.setAttribute('stroke', data.colors[id]);
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('points', points.join(' '));

      g.append(polyline);
    });

    return g;

    function getXY(x1, y1): string {
      const x = Math.round((x1 - minX) * xFactor);
      const y = height - (y1 * yFactor);

      return `${x},${y}`;
    }
  }
}
