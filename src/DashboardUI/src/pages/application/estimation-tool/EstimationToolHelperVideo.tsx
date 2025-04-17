// import 'video.js/dist/video-js.css';
import './estimation-tool-helper-video.css';

export interface EstimationToolHelperVideoProps {
  onVideoEnd: () => void;
}

export function EstimationToolHelperVideo(props: EstimationToolHelperVideoProps) {
  return (
    <>
      <video
        id="my-video"
        className="video-js"
        // controls
        preload="auto"
        // leave video dimensions alone
        // width="200"
        // height="264"
        poster="MY_VIDEO_POSTER.jpg"
        data-setup="{}"
        // autoplay on load
        autoPlay
        muted
        onEnded={props.onVideoEnd}
        // hide all playback controls
        // close on finish
      >
        <source src="https://westdaatqa.blob.core.windows.net/$web/static/video/estimation-tool-tip.mp4" />
      </video>
    </>
  );
}
