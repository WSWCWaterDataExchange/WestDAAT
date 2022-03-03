using AutoMapper;
using Client = WesternStatesWater.WestDaat.Contracts.Client;
using DC = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Mappings
{
    internal class ApiProfile : Profile
    {
        public ApiProfile()
        {
            CreateMap<Client.Site, DC.Site>();
        }
    }
}