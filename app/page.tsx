"use client"
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1>Theif Catcher</h1>
      <Webcam
        audio={false}
        height={50}
        screenshotFormat="image/jpeg"
        width={680}
        videoConstraints={videoConstraints}
      />
    </div>
  );
}
