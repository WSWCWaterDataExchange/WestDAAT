import 'video.js/dist/video-js.css';

export function EstimationToolHelperVideo() {
  return (
    <>
      <video
        id="my-video"
        className="video-js"
        controls
        preload="auto"
        width="640"
        height="264"
        poster="MY_VIDEO_POSTER.jpg"
        data-setup="{}"
      >
        <source src="https://shattereddisk.github.io/rickroll/rickroll.mp4" />
      </video>
    </>
  );
}
