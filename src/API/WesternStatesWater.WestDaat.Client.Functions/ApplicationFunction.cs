using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Client.Functions;

public class ApplicationFunction : FunctionBase
{
    private readonly IApplicationManager _applicationManager;
    private readonly ILogger _logger;

    private const string RouteBase = "Applications";

    public ApplicationFunction(IApplicationManager applicationManager, ILogger<ApplicationFunction> logger) : base(logger)
    {
        _applicationManager = applicationManager;
        _logger = logger;
    }

    [Function(nameof(ApplicationSearch))]
    [OpenApiOperation(nameof(ApplicationSearch))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(ApplicationLoadResponseBase))]
    public async Task<HttpResponseData> ApplicationSearch(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/search")]
        HttpRequestData req)
    {
        var applicationLoadRequest = await ParseRequestBody<ApplicationLoadRequestBase>(req);
        var result = applicationLoadRequest switch
        {
            OrganizationApplicationDashboardLoadRequest request => await _applicationManager
                .Load<OrganizationApplicationDashboardLoadRequest, OrganizationApplicationDashboardLoadResponse>(request),
            _ => throw new NotImplementedException($"Request type {applicationLoadRequest.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }

    [Function(nameof(EstimateConsumptiveUse))]
    [OpenApiOperation(nameof(EstimateConsumptiveUse))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(ApplicantEstimateConsumptiveUseResponse))]
    public async Task<HttpResponseData> EstimateConsumptiveUse(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/EstimateConsumptiveUse")]
        HttpRequestData req)
    {
        var request = await ParseRequestBody<ApplicationStoreRequestBase>(req);

        ApplicationStoreResponseBase results = request switch
        {
            ApplicantEstimateConsumptiveUseRequest applicantRequest => await _applicationManager.Store<ApplicantEstimateConsumptiveUseRequest, ApplicantEstimateConsumptiveUseResponse>(applicantRequest),
            EstimateConsumptiveUseReviewerRequest reviewerRequest => await _applicationManager.Store<EstimateConsumptiveUseReviewerRequest, EstimateConsumptiveUseReviewerResponse>(reviewerRequest),
            _ => throw new NotImplementedException($"Request type {request.GetType()} is not implemented.")
        };

        return await CreateResponse(req, results);
    }

    [Function(nameof(CreateWaterConservationApplication))]
    [OpenApiOperation(nameof(CreateWaterConservationApplication))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(WaterConservationApplicationCreateResponse))]
    public async Task<HttpResponseData> CreateWaterConservationApplication(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}")]
        HttpRequestData req)
    {
        var request = await ParseRequestBody<WaterConservationApplicationCreateRequest>(req);
        var results = await _applicationManager.Store<WaterConservationApplicationCreateRequest, WaterConservationApplicationCreateResponse>(request);
        return await CreateResponse(req, results);
    }

    [Function(nameof(SubmitApplication))]
    [OpenApiOperation(nameof(SubmitApplication))]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    public async Task<HttpResponseData> SubmitApplication(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/Submit")]
        HttpRequestData req)
    {
        var request = await ParseRequestBody<ApplicationStoreRequestBase>(req);
        var results = request switch
        {
            WaterConservationApplicationSubmissionRequest submissionRequest => await _applicationManager
                .Store<WaterConservationApplicationSubmissionRequest, ApplicationStoreResponseBase>(submissionRequest),
            WaterConservationApplicationRecommendationRequest recommendationRequest => await _applicationManager
                .Store<WaterConservationApplicationRecommendationRequest, ApplicationStoreResponseBase>(recommendationRequest),
            _ => throw new NotImplementedException($"Request type {request.GetType()} is not implemented.")
        };
        return await CreateResponse(req, results);
    }

    [Function(nameof(UpdateApplication))]
    [OpenApiOperation(nameof(UpdateApplication))]
    [OpenApiParameter("id", In = ParameterLocation.Path, Required = true, Type = typeof(Guid))]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    public async Task<HttpResponseData> UpdateApplication(
        [HttpTrigger(AuthorizationLevel.Function, "put", Route = $"{RouteBase}/{{id}}")]
        HttpRequestData req, Guid id)
    {
        var request = await ParseRequestBody<WaterConservationApplicationSubmissionUpdateRequest>(req,
            new Dictionary<string, object> { { nameof(WaterConservationApplicationSubmissionUpdateRequest.WaterConservationApplicationId), id } });
        var results = await _applicationManager.Store<WaterConservationApplicationSubmissionUpdateRequest, ApplicationStoreResponseBase>(request);
        return await CreateResponse(req, results);
    }

    [Function(nameof(GetApplication))]
    [OpenApiOperation(nameof(GetApplication))]
    [OpenApiResponseWithBody(HttpStatusCode.OK, "OK", typeof(ApplicationLoadResponseBase))]
    public async Task<HttpResponseData> GetApplication(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = $"{RouteBase}/Load")]
        HttpRequestData req)
    {
        var request = await ParseRequestBody<ApplicationLoadRequestBase>(req);
        ApplicationLoadResponseBase result = request switch
        {
            ApplicantConservationApplicationLoadRequest applicantRequest => await _applicationManager
                .Load<ApplicantConservationApplicationLoadRequest, ApplicantConservationApplicationLoadResponse>(applicantRequest),
            ReviewerConservationApplicationLoadRequest reviewerRequest => await _applicationManager
                .Load<ReviewerConservationApplicationLoadRequest, ReviewerConservationApplicationLoadResponse>(reviewerRequest),
            _ => throw new NotImplementedException($"Request type {request.GetType()} is not implemented.")
        };
        return await CreateResponse(req, result);
    }

    [Function(nameof(OnApplicationSubmitted))]
    public async Task OnApplicationSubmitted(
        [ServiceBusTrigger(queueName: Queues.ConservationApplicationSubmitted, Connection = "ServiceBusConnection")]
        WaterConservationApplicationSubmittedEvent @event)
    {
        await _applicationManager.OnApplicationSubmitted<WaterConservationApplicationSubmittedEvent, EventResponseBase>(@event);
    }
}