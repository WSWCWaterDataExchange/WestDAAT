using Newtonsoft.Json;
using System.IO;
using System.Net;
using System.Text.Json;
using Azure.Core.Serialization;
using WesternStatesWater.WestDaat.Contracts.Client;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class System(ISystemManager systemManager, INotificationManager notificationManager)
        : FunctionBase
    {
        [Function(nameof(GetDashboardFilters))]
        public async Task<HttpResponseData> GetDashboardFilters([HttpTrigger(AuthorizationLevel.Anonymous, "get",
                Route = "system/filters")]
            HttpRequestData req)
        {
            var results = await systemManager.LoadFilters();
            // This cannot run through CreateOKResponse because the serializer options will convert enum to string
            // This will break the UI.
            var data = req.CreateResponse(HttpStatusCode.OK);
            await data.WriteAsJsonAsync<object>(results, new JsonObjectSerializer(
                new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                }));
            return data;
        }

        [Function(nameof(GetRiverBasinPolygonsByName))]
        public async Task<HttpResponseData> GetRiverBasinPolygonsByName(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/RiverBasins")]
            HttpRequestData request)
        {
            string requestBody = String.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }

            var basinNames = JsonConvert.DeserializeObject<string[]>(requestBody);

            var result = systemManager.GetRiverBasinPolygonsByName(basinNames);

            return await CreateOkResponse(request, result);
        }

        [Function(nameof(PostFeedback))]
        public async Task<HttpResponseData> PostFeedback(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "system/feedback")]
            HttpRequestData request)
        {
            string requestBody = string.Empty;
            using (StreamReader streamReader = new StreamReader(request.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }

            var feedbackRequest = JsonConvert.DeserializeObject<FeedbackRequest>(requestBody);

            await notificationManager.SendFeedback(feedbackRequest);

            return request.CreateResponse(HttpStatusCode.OK);
        }
    }
}