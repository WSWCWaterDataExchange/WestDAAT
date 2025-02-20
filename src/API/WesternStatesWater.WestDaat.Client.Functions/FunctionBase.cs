using Azure.Core.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker.Http;
using System.IO;
using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Accessors.Mapping;

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public abstract class FunctionBase(ILogger logger)
    {
        private static JsonSerializerOptions JsonSerializerOptions => new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        protected async Task<HttpResponseData> CreateResponse(HttpRequestData request, ResponseBase response)
        {
            return response switch
            {
                { Error: null } => await CreateOkResponse(request, response),
                _ => await CreateErrorResponse(request, response.Error),
            };
        }

        /// <summary>
        /// This method should be used only by older methods that do not have a response object. Newer endpoints should
        /// always use <see cref="CreateResponse" />".
        /// </summary>
        protected static async Task<HttpResponseData> CreateOkResponse<T>(HttpRequestData request, T response)
        {
            if (response.GetType().IsSubclassOf(typeof(ResponseBase)))
            {
                throw new InvalidOperationException("This method should not be used with ResponseBase objects. Use CreateResponse instead.");
            }

            var data = request.CreateResponse(HttpStatusCode.OK);

            await data.WriteAsJsonAsync((object)response, new JsonObjectSerializer(JsonSerializerOptions));

            return data;
        }

        private static async Task<HttpResponseData> CreateOkResponse(HttpRequestData request, ResponseBase response)
        {
            var data = request.CreateResponse(HttpStatusCode.OK);

            await data.WriteAsJsonAsync((object)response, new JsonObjectSerializer(JsonSerializerOptions));

            return data;
        }

        private async Task<HttpResponseData> CreateErrorResponse(HttpRequestData request, ErrorBase error)
        {
            logger.LogError($"Request resulted in an error response. LogMessage: {error.LogMessage}");

            return error switch
            {
                ConflictError => await CreateConflictResponse(request),
                ForbiddenError => await CreateForbiddenResponse(request),
                InternalError => await CreateInternalServerErrorResponse(request),
                NotFoundError err => await CreateNotFoundResponse(request, err),
                ValidationError err => await CreateBadRequestResponse(request, err),
                ServiceUnavailableError err => await CreateServiceUnavailableResponse(request, err),
                _ => await CreateInternalServerErrorResponse(request)
            };
        }

        private static Task<HttpResponseData> CreateConflictResponse(HttpRequestData request)
        {
            var details = new ProblemDetails
            {
                Status = (int)HttpStatusCode.Conflict,
                Title = "Conflict",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                Detail = "The request could not be completed due to a conflict with the current state of the resource."
            };

            return CreateProblemDetailsResponse(request, details, HttpStatusCode.Conflict);
        }

        private static Task<HttpResponseData> CreateForbiddenResponse(HttpRequestData request)
        {
            var details = new ProblemDetails
            {
                Status = (int)HttpStatusCode.Forbidden,
                Title = "Forbidden",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                Detail = "You do not have permission to perform this action.",
            };

            return CreateProblemDetailsResponse(request, details, HttpStatusCode.Forbidden);
        }

        private static Task<HttpResponseData> CreateInternalServerErrorResponse(HttpRequestData request)
        {
            var details = new ProblemDetails
            {
                Status = (int)HttpStatusCode.InternalServerError,
                Title = "An unexpected error has occurred",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1"
            };

            return CreateProblemDetailsResponse(request, details, HttpStatusCode.InternalServerError);
        }

        private static Task<HttpResponseData> CreateNotFoundResponse(HttpRequestData request, NotFoundError err)
        {
            var details = new ProblemDetails
            {
                Status = (int)HttpStatusCode.NotFound,
                Title = "Resource not found",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                Detail = err.PublicMessage
            };

            return CreateProblemDetailsResponse(request, details, HttpStatusCode.NotFound);
        }

        private static Task<HttpResponseData> CreateBadRequestResponse(HttpRequestData request, ValidationError error)
        {
            var details = new HttpValidationProblemDetails(error.Errors)
            {
                Status = (int)HttpStatusCode.BadRequest,
                Title = "One or more validation errors occurred",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1"
            };

            return CreateProblemDetailsResponse(request, details, HttpStatusCode.BadRequest);
        }

        private static Task<HttpResponseData> CreateServiceUnavailableResponse(HttpRequestData request, ServiceUnavailableError error)
        {
            var details = new ProblemDetails
            {
                Status = (int)HttpStatusCode.ServiceUnavailable,
                Title = "Service Unavailable",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.6.4",
            };

            return CreateProblemDetailsResponse(request, details, HttpStatusCode.ServiceUnavailable);
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

        protected async Task<T> ParseRequestBody<T>(HttpRequestData req, Dictionary<string, object> routeParams = null)
        {
            var requestBody = string.Empty;
            using (var streamReader = new StreamReader(req.Body))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }

            var dto = JsonSerializer.Deserialize<T>(requestBody, JsonSerializerOptions);

            // Map the optional route parameters to the DTO
            if (dto is not null && routeParams is not null)
            {
                DtoMapper.Map(routeParams, dto);
            }

            return dto;
        }
    }
}