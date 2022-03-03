using AutoMapper;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal static class DtoMapper
    {
        static IMapper _mapper;
        private static IConfigurationProvider _config;

        private static IMapper Mapper => _mapper ?? (_mapper = Configuration.CreateMapper());

        public static IConfigurationProvider Configuration
        {
            get
            {
                if (_config == null)
                {
                    var config = new AutoMapper.MapperConfiguration(cfg =>
                    {
                        // NOTE: CreateMap<Source, Destination>()
                        // ForMember(destination member, source mapping/member option)
                    });
                    _config = config;
                }
                return _config;
            }
        }

        public static void Map(object source, object dest)
        {
            Mapper.Map(source, dest, source.GetType(), dest.GetType());
        }

        public static T Map<T>(object source)
        {
            return Mapper.Map<T>(source);
        }
    }
}
