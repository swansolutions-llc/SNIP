import { useEffect, useRef } from 'react';

const VideoPlayer = ({ videoUrl, autoplay = true }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && autoplay) {
      videoRef.current.play();
    }
  }, [videoRef, autoplay]);

  return (
    <div>
      <video ref={videoRef} controls autoPlay={autoplay}>
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
