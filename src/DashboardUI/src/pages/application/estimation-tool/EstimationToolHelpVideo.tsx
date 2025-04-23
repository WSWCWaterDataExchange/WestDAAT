export interface EstimationToolHelpVideoProps {
  onVideoEnd: () => void;
}

export function EstimationToolHelpVideo(props: EstimationToolHelpVideoProps) {
  // Use relative path in Azure. Locally use config value
  const videoUrl = process.env.REACT_APP_ESTIMATION_TOOL_HELP_VIDEO_URL ?? '/static/video/estimation-tool-tip.mp4';

  return (
    <>
      <video controls preload="auto" autoPlay muted onEnded={props.onVideoEnd}>
        <source src={videoUrl} />
      </video>
    </>
  );
}
