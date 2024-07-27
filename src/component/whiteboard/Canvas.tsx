import { useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import "../../css/style.css";
import { useWhiteboardWebSocket } from "../../hooks/useWhiteboard";

type DrawingLineData = {
  start: Array<number>;
  end: Array<number>;
};

const setDrawingLineData = (ws: WebSocket, data: DrawingLineData) => {
  const shouldSend = ws.readyState === ws.OPEN && data;

  if (shouldSend) {
    ws.send(
      JSON.stringify({
        scope: "whiteboard",
        data,
      }),
    );
  }
};

export const Canvas = (): JSX.Element => {
  const id = useParams<{ id: string }>().id;
  const { wsRef } = useWhiteboardWebSocket(id);
  const pc = useRef<HTMLCanvasElement>(null);
  const sendDrawingData = useCallback(
    function (data: DrawingLineData) {
      if (!wsRef.current) {
        console.log("wsRef do not exist");
        return;
      }

      setDrawingLineData(wsRef.current, data);
    },
    [wsRef],
  );

  useEffect(
    function setIncommingData() {
      if (!wsRef.current) {
        console.log("wsRef do not exist");
        return;
      }

      const ws = wsRef.current;
      const ctx = pc.current?.getContext("2d");

      const onmessage = ((event: CustomEvent) => {
        if (ctx && ws) {
          const rawData = event.detail?.data;
          const data = JSON.parse(rawData);
          const { start, end } = data?.data;

          ctx.beginPath();
          ctx.moveTo(start[0], start[1]);
          ctx.lineTo(end[0], end[1]);
          ctx.stroke();
        }
      }) as EventListener;

      window.addEventListener("whiteboard-ws-onmessage", onmessage);

      return () => {
        window.removeEventListener("whiteboard-ws-onmessage", onmessage);
      };
    },
    [wsRef],
  );

  useEffect(
    function setupDrawing() {
      const canvas = pc.current;

      const cc = new CanvasController({
        width: 600,
        height: 400,
        lineJoin: "round",
        lineCap: "round",
        lineWidth: 5,
        strokeStyle: "#ac0000",
        canvas: canvas!,
        storeCallback: sendDrawingData,
      });

      const ceh = new CanvasEventHub(cc, pc?.current!);
      const cleanUpCallback = ceh.subscrubeEvent();
      return cleanUpCallback as unknown as any;
    },

    [sendDrawingData],
  );

  return (
    <>
      <canvas ref={pc} id="canvas" style={{ border: "solid 2px red" }}></canvas>
    </>
  );
};

type CanvasMetaData = {
  width: number;
  height: number;
  lineJoin: "round";
  lineCap: "round";
  lineWidth: number;
  strokeStyle: "#ac0000";
  canvas: HTMLCanvasElement;
  storeCallback: (data: DrawingLineData) => void;
  // c: any;
};

class CanvasController {
  private lastX = 0;
  private lastY = 0;
  private isDrawing = false;
  ctx: CanvasRenderingContext2D;

  constructor(private canvasMetaData: CanvasMetaData) {
    this.ctx = canvasMetaData.canvas.getContext("2d")!;
    canvasMetaData.canvas.width = 700;
    canvasMetaData.canvas.height = 400;
    this.ctx.lineWidth = 5;
  }

  draw(e: MouseEvent) {
    const ctx = this.ctx;

    if (!ctx) {
      return;
    }

    if (!this.isDrawing || !ctx) return;

    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    const drawingContent = {
      start: [this.lastX, this.lastY],
      end: [e.offsetX, e.offsetY],
    };

    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];

    this.canvasMetaData.storeCallback(drawingContent);
  }

  setIsDraw(b: boolean) {
    this.isDrawing = b;
  }

  setXY(x: number, y: number) {
    this.lastX = x;
    this.lastY = y;
  }
}

class CanvasEventHub {
  constructor(
    private cc: CanvasController,
    private canvas: HTMLCanvasElement,
  ) {}

  subscrubeEvent(): Function {
    const canvas = this.canvas;

    const mouseDownFunc = (e: MouseEvent) => {
      this.cc.setXY(e.offsetX, e.offsetY);
      this.cc.setIsDraw(true);
    };

    const mousemoveFunc = (e: MouseEvent) => {
      this.cc.draw(e);
    };
    const mouseupFunc = () => this.cc.setIsDraw(false);
    const mouseoutFunc = () => this.cc.setIsDraw(false);

    canvas.addEventListener("mousedown", mouseDownFunc);
    canvas.addEventListener("mousemove", mousemoveFunc);
    canvas.addEventListener("mouseup", mouseupFunc);
    canvas.addEventListener("mouseout", mouseoutFunc);
    console.log("register all events");

    return () => {
      console.log("clean up");
      canvas.removeEventListener("mousedown", mouseDownFunc);
      canvas.removeEventListener("mousemove", mousemoveFunc);
      canvas.removeEventListener("mouseup", mouseupFunc);
      canvas.removeEventListener("mouseout", mouseoutFunc);
    };
  }
}
