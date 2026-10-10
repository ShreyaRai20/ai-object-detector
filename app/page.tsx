"use client";

import "@tensorflow/tfjs"; // registers backends (webgl, cpu) as a side effect
import * as tf from "@tensorflow/tfjs";
import { load as cocoSsdLoad, ObjectDetection } from "@tensorflow-models/coco-ssd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<ObjectDetection | null>(null);
  const [loading, setLoading] = useState(true);

  // Load the model once
  useEffect(() => {
    let cancelled = false;

    (async () => {
      await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));
      await tf.ready();
      const loaded = await cocoSsdLoad();
      if (!cancelled) {
        setModel(loaded);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Run detection once the model is ready
  useEffect(() => {
    if (!model) return;

    const interval = setInterval(async () => {
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4) return;

      const predictions = await model.detect(video);
      console.log(predictions);
    }, 100);

    return () => clearInterval(interval);
  }, [model]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1>Thief Catcher</h1>
      {loading && <p>Loading model...</p>}
      <Webcam
        ref={webcamRef}
        audio={false}
        width={680}
        height={50}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        mirrored={true}
      />
    </div>
  );
}