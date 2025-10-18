function Video() {
  const isProd = import.meta.env.PROD;

  const assets = {
    playback_video: isProd
      ? `/api/getAsset?asset=playback_video`
      : import.meta.env.VITE_CLOUDINARY_PLAYBACK_VIDEO,
  };

  return (
    <div>
      <video
        autoPlay
        loop
        muted
        src={assets.playback_video}
        className="media__video"
      />
    </div>
  );
}

export default Video;
