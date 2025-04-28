interface ApplicationStaticMapProps {
  mapImageUrl: string | undefined;
}
function ApplicationStaticMap(props: ApplicationStaticMapProps) {
  return <img src={props.mapImageUrl} alt="Map" className="w-100" />;
}

export default ApplicationStaticMap;
