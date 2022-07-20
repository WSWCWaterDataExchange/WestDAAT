using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Utilities.Resources;

namespace WesternStatesWater.WestDaat.Utilities
{
    public class TemplateResourceSdk : ITemplateResourceSdk
    {
        public TemplateResourceSdk(ILogger<TemplateResourceSdk> logger)
        {
            _logger = logger;
        }

        private readonly ILogger _logger;

        public string GetTemplate(ResourceType type)
        {
            return type switch
            {
                ResourceType.JsonLD => GeoConnexJsonLDResource.GeoConnexJsonLDTemplate,
                ResourceType.Citation => GeoConnexJsonLDResource.Citation,
                _ => null
            };
        }
    }
}
