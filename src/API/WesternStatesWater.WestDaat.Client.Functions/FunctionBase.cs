using System.Net;
using System.Text.Json;
using Azure.Core.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.Errors;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class FunctionBase
    {
        private static JsonSerializerOptions JsonSerializerOptions => new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        protected static async Task<HttpResponseData> CreateOkResponse<T>(
            HttpRequestData request,
            T response)
        {
            var data = request.CreateResponse(HttpStatusCode.OK);

            await data.WriteAsJsonAsync((object) response, new JsonObjectSerializer(JsonSerializerOptions));

            return data;
        }

        protected static Task<HttpResponseData> CreateBadRequestResponse(HttpRequestData request, ValidationError error)
        {
            var details = new HttpValidationProblemDetails(error.Errors)
            {
                Status = (int) HttpStatusCode.BadRequest,
                Title = "One or more validation errors occurred.",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1"
            };

            return CreateProblemDetailsResponse(request, details, HttpStatusCode.BadRequest);
        }

        private static async Task<HttpResponseData> CreateProblemDetailsResponse(
            HttpRequestData request,
            ProblemDetails details,
            HttpStatusCode statusCode)
        {
            var response = request.CreateResponse();

            // Casting to object for polymorphic serialization
            await response.WriteAsJsonAsync<object>(
                details,
                new JsonObjectSerializer(JsonSerializerOptions),
                statusCode);

            return response;
        }
    }
}