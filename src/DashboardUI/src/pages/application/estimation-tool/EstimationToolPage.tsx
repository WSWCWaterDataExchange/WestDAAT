import { useNavigate, useParams } from 'react-router-dom';
import { EstimationToolSidebar } from './EstimationToolSidebar';
import { EstimationToolMapHeader } from './EstimationToolMapHeader';
import { EstimationToolMap } from './EstimationToolMap';
import { useConservationApplicationContext } from '../../../contexts/ConservationApplicationProvider';
import { useEffect } from 'react';
import {
  useCreateWaterConservationApplicationQuery,
  useFundingOrganizationQuery,
} from '../../../hooks/queries/useApplicationQuery';
import { useMutation } from 'react-query';
import { CompensationRateUnits } from '../../../data-contracts/CompensationRateUnits';
import { applicantEstimateConsumptiveUse, uploadApplicationStaticMap } from '../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';
import { ApplicantEstimateConsumptiveUseResponse } from '../../../data-contracts/EstimateConsumptiveUseApplicantResponse';
import { toast } from 'react-toastify';
import { ApplicationNavbar } from '../components/ApplicationNavbar';
import { useMapContext } from '../../../contexts/MapProvider';
import { MapPolygon } from '../../../data-contracts/MapPolygon';
import { blobToBase64 } from '../../../utilities/fileUploadHelpers';

import './estimation-tool-page.scss';

export function EstimationToolPage() {
  const context = useMsal();
  const navigate = useNavigate();
  const routeParams = useParams();
  const { state, dispatch } = useConservationApplicationContext();
  const mapContext = useMapContext();

  const { waterRightNativeId } = routeParams;

  useEffect(() => {
    if (waterRightNativeId) {
      dispatch({
        type: 'ESTIMATION_TOOL_PAGE_LOADED',
        payload: {
          waterRightNativeId: waterRightNativeId,
        },
      });
    }
  }, [waterRightNativeId]);

  const { isLoading: isLoadingFundingOrganization, isError: fundingOrganizationLoadFailed } =
    useFundingOrganizationQuery(state.conservationApplication.waterRightNativeId);

  const { isLoading: isLoadingApplication, isError: applicationLoadFailed } =
    useCreateWaterConservationApplicationQuery({
      waterRightNativeId: state.conservationApplication.waterRightNativeId,
      fundingOrganizationId: state.conservationApplication.fundingOrganizationId,
    });

  const estimateConsumptiveUseMutation = useMutation({
    mutationFn: async (fields: EstimateConsumptiveUseApiCallFields) => {
      validateFields(fields);

      const apiCallFields: Parameters<typeof applicantEstimateConsumptiveUse>[1] = {
        waterRightNativeId: fields.waterRightNativeId!,
        waterConservationApplicationId: fields.waterConservationApplicationId!,
        polygons: fields.polygons!,
        compensationRateDollars: fields.compensationRateDollars,
        units: fields.units,
      };

      return await applicantEstimateConsumptiveUse(context, apiCallFields);
    },
    onSuccess: (result: ApplicantEstimateConsumptiveUseResponse, data: EstimateConsumptiveUseApiCallFields) => {
      if (result) {
        dispatch({
          type: 'APPLICANT_CONSUMPTIVE_USE_ESTIMATED',
          payload: {
            cumulativeTotalEtInAcreFeet: result.cumulativeTotalEtInAcreFeet,
            conservationPayment: result.conservationPayment,
            dataCollections: result.dataCollections,
          },
        });

        const wasDataSavedToDatabase = data.compensationRateDollars && data.units;
        if (wasDataSavedToDatabase) {
          dispatch({
            type: 'APPLICATION_MAP_STATIC_IMAGE_GENERATE_STARTED',
          });

          // artificial delay to allow the field labels to render
          setTimeout(() => {
            mapContext.exportToPngFn!({
              height: 400,
              width: 600,
            })
              .then((blob) => {
                const applicationId = state.conservationApplication.waterConservationApplicationId;
                if (blob && applicationId) {
                  const file = new File([blob], `${applicationId}.png`, { type: blob.type });
                  uploadApplicationStaticMap(context, file, applicationId);

                  blobToBase64(blob).then((base64) => {
                    dispatch({
                      type: 'APPLICATION_MAP_STATIC_IMAGE_ADDED',
                      payload: {
                        mapImageUrl: base64,
                      },
                    });
                  });
                }
              })
              .finally(() => {
                dispatch({
                  type: 'APPLICATION_MAP_STATIC_IMAGE_GENERATE_COMPLETED',
                });
              });
          }, 1500);
        }
      }
    },
    onError: (error: Error) => {
      toast.error('Failed to estimate consumptive use. Please try again later.');
    },
  });

  const handleEstimateConsumptiveUseClicked = () => {
    estimateConsumptiveUseMutation.mutate({
      waterRightNativeId: state.conservationApplication.waterRightNativeId,
      waterConservationApplicationId: state.conservationApplication.waterConservationApplicationId,
      polygons: state.conservationApplication.estimateLocations.map(
        (polygon): MapPolygon => ({
          // backend overwrites locations for applicant EstimateConsumptiveUse use case
          waterConservationApplicationEstimateLocationId: null,
          polygonWkt: polygon.polygonWkt!,
          drawToolType: polygon.drawToolType!,
        }),
      ),
      compensationRateDollars: state.conservationApplication.desiredCompensationDollars,
      units: state.conservationApplication.desiredCompensationUnits,
    });
  };

  const navigateToWaterRightLandingPage = () => {
    navigate(`/details/right/${waterRightNativeId}`);
  };

  return (
    <main className="estimation-tool-page d-flex flex-column flex-grow-1 overflow-hidden h-100">
      <ApplicationNavbar
        navigateBack={navigateToWaterRightLandingPage}
        backButtonText="Back to Water Right Landing Page"
        centerText="Water Conservation Estimation Tool"
        centerTextIsLoading={false}
        displayWaterIcon={true}
      />

      <div className="flex-grow-1 overflow-y-auto">
        <div className="h-100 d-flex overflow-y-auto align-items-stretch">
          <div className="estimation-tool-side-panel d-flex flex-column overflow-y-auto">
            <EstimationToolSidebar
              perspective="applicant"
              isLoading={isLoadingFundingOrganization || isLoadingApplication}
              loadFailed={fundingOrganizationLoadFailed || applicationLoadFailed}
            />
          </div>

          <div className="flex-grow-1 d-flex flex-column overflow-y-hidden">
            <EstimationToolMapHeader />
            <EstimationToolMap
              waterRightNativeId={waterRightNativeId}
              handleEstimateConsumptiveUseClicked={handleEstimateConsumptiveUseClicked}
              isLoadingConsumptiveUseEstimate={estimateConsumptiveUseMutation.isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

interface EstimateConsumptiveUseApiCallFields {
  waterConservationApplicationId: string | undefined;
  waterRightNativeId: string | undefined;
  polygons: MapPolygon[] | undefined;
  compensationRateDollars: number | undefined;
  units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
}

const validateFields = (fields: EstimateConsumptiveUseApiCallFields) => {
  const isValid: boolean =
    !!fields.waterConservationApplicationId &&
    !!fields.waterRightNativeId &&
    !!fields.polygons &&
    fields.polygons.length > 0; // compensation rate is optional
  if (!isValid) {
    throw new Error('Invalid fields');
  }
};
