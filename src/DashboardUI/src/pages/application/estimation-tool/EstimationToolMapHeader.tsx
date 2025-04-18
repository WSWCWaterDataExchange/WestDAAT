import { useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { parseGISFileToGeoJSON } from '../../../utilities/gisFileParser';
import { Feature, FeatureCollection, GeoJsonProperties, Polygon } from 'geojson';
import { toast } from 'react-toastify';
import {
  conservationApplicationMaxPolygonAcreage,
  conservationApplicationMaxPolygonCount,
} from '../../../config/constants';
import { doesPointExistWithinPolygon, doPolygonsIntersect } from '../../../utilities/geometryHelpers';
import {
  fromGeometryFeatureToMapSelectionPolygonData,
  fromPartialPointDataToPointFeature,
  fromPartialPolygonDataToPolygonFeature,
} from '../../../utilities/mapUtility';
import { formatNumber } from '../../../utilities/valueFormatters';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { ApplicationReviewPerspective } from '../../../data-contracts/ApplicationReviewPerspective';

interface EstimationToolMapHeaderProps {
  perspective: ApplicationReviewPerspective;
}

export function EstimationToolMapHeader(props: EstimationToolMapHeaderProps) {
  const { state, dispatch } = useConservationApplicationContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFile = async (file: File): Promise<FeatureCollection> => {
    let data: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    try {
      data = await parseGISFileToGeoJSON(file);
    } catch (error: any) {
      toast.error(`Error parsing file: "${error.message}"`);
    }

    return data;
  };

  const validateUploadedFileFeatures = (
    data: FeatureCollection,
  ): {
    doPolygonsOverlap: boolean;
    doesControlLocationOverlapWithPolygons: boolean;
  } => {
    // combine new polygons from file upload with data already in state for validation
    const uploadedFilePolygonFeatures = data.features
      .filter((feature) => feature.geometry.type === 'Polygon')
      .map((feature) => feature as Feature<Polygon, GeoJsonProperties>);

    const polygonFeaturesInState = state.conservationApplication.estimateLocations.map(
      fromPartialPolygonDataToPolygonFeature,
    );

    const allPolygonFeatures = uploadedFilePolygonFeatures.concat(polygonFeaturesInState);

    // validate irrigated field locations
    if (allPolygonFeatures.length > conservationApplicationMaxPolygonCount) {
      toast.error(
        `You may only select up to ${conservationApplicationMaxPolygonCount} fields at a time. Please redraw the polygons so there are ${conservationApplicationMaxPolygonCount} or fewer.`,
      );
    }

    const doPolygonsOverlap = doPolygonsIntersect(allPolygonFeatures);
    if (doPolygonsOverlap) {
      toast.error('Polygons may not intersect. Please redraw the polygons so they do not overlap.');
    }

    const uploadedFilePolygonData = uploadedFilePolygonFeatures.map(fromGeometryFeatureToMapSelectionPolygonData);

    // data in state has already been checked for this - only need to check the new polygons
    if (uploadedFilePolygonData.some((p) => p.acreage > conservationApplicationMaxPolygonAcreage)) {
      toast.error(`Polygons may not exceed ${formatNumber(conservationApplicationMaxPolygonAcreage, 0)} acres.`);
    }

    // validate control location if it already exists in state
    const location = state.conservationApplication.controlLocation;
    if (!location) {
      return {
        doPolygonsOverlap,
        doesControlLocationOverlapWithPolygons: false,
      };
    }

    const controlLocationFeature = fromPartialPointDataToPointFeature(location);

    const doesControlLocationOverlapWithPolygons = allPolygonFeatures.some((polygonFeature) =>
      doesPointExistWithinPolygon(controlLocationFeature, polygonFeature),
    );

    if (doesControlLocationOverlapWithPolygons) {
      toast.error(
        'The control location may not be within any of the irrigated field locations. Please replace the control location or move the polygons.',
      );
    }

    return {
      doPolygonsOverlap,
      doesControlLocationOverlapWithPolygons,
    };
  };

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    // combine files' data into a single collection
    const uploadedFileFeatures: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileData = await parseFile(file);
      uploadedFileFeatures.features.push(...fileData.features);
    }

    const { doPolygonsOverlap, doesControlLocationOverlapWithPolygons } =
      validateUploadedFileFeatures(uploadedFileFeatures);

    dispatch({
      type: 'GIS_FILE_ADDED_TO_MAP',
      payload: {
        polygons: uploadedFileFeatures.features.map(fromGeometryFeatureToMapSelectionPolygonData),
        doPolygonsOverlap: doPolygonsOverlap,
        doesControlLocationOverlapWithPolygons,
        perspective: props.perspective,
      },
    });

    // reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-3 d-flex flex-column gap-2 d-print-none">
      <div>
        <span className="h5 fw-bold">Estimate consumptive use through OpenET for an irrigated field</span>
      </div>

      <div>
        <span className="me-2">
          Click once to begin drawing a polygon around your land by using the shape tool. Then, use the panel on the
          left to review estimates and potential compensation as part of a voluntary and temporary measure.
        </span>
      </div>

      <div>
        <span className="me-2">Or, you can upload a file from your device.</span>

        <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()}>
          Upload File
        </Button>

        <input
          type="file"
          accept=".json, .geojson, .zip, .shp"
          multiple
          className="d-none"
          ref={fileInputRef}
          onChange={handleFilesSelected}
        />
      </div>
    </div>
  );
}
