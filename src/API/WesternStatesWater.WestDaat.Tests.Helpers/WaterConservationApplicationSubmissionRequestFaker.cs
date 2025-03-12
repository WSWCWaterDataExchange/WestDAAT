namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationSubmissionRequestFaker : Faker<Contracts.Client.Requests.Conservation.WaterConservationApplicationSubmissionRequest>
{
    public WaterConservationApplicationSubmissionRequestFaker()
    {
        RuleFor(wcas => wcas.AgentName, f => f.Person.FullName);

        RuleFor(wcas => wcas.AgentEmail, f => f.Person.Email);

        RuleFor(wcas => wcas.AgentPhoneNumber, f => f.Phone.PhoneNumber());

        RuleFor(wcas => wcas.AgentAdditionalDetails, f => f.Lorem.Sentence());

        RuleFor(wcas => wcas.LandownerName, f => f.Person.FullName);

        RuleFor(wcas => wcas.LandownerEmail, f => f.Person.Email);

        RuleFor(wcas => wcas.LandownerPhoneNumber, f => f.Phone.PhoneNumber());

        RuleFor(wcas => wcas.LandownerAddress, f => f.Address.StreetAddress());

        RuleFor(wcas => wcas.LandownerCity, f => f.Address.City());

        RuleFor(wcas => wcas.LandownerState, f => f.Address.StateAbbr());

        RuleFor(wcas => wcas.LandownerZipCode, f => f.Address.ZipCode());

        RuleFor(wcas => wcas.CanalOrIrrigationEntityName, f => f.Company.CompanyName());

        RuleFor(wcas => wcas.CanalOrIrrigationEntityEmail, f => f.Person.Email);

        RuleFor(wcas => wcas.CanalOrIrrigationEntityPhoneNumber, f => f.Phone.PhoneNumber());

        RuleFor(wcas => wcas.CanalOrIrrigationAdditionalDetails, f => f.Lorem.Sentence());

        RuleFor(wcas => wcas.ConservationPlanFundingRequestDollarAmount, f => f.Random.Number(100, 1000));

        RuleFor(wcas => wcas.ConservationPlanFundingRequestCompensationRateUnits, f => f.PickRandomWithout(Common.DataContracts.CompensationRateUnits.None));

        RuleFor(wcas => wcas.ConservationPlanDescription, f => f.Lorem.Sentence());

        RuleFor(wcas => wcas.ConservationPlanAdditionalInfo, f => f.Lorem.Sentence());

        RuleFor(wcas => wcas.EstimationSupplementaryDetails, f => f.Lorem.Sentence());

        RuleFor(wcas => wcas.PermitNumber, f => f.Random.Number(100000000, 1000000000).ToString());

        RuleFor(wcas => wcas.FacilityDitchName, f => f.Company.CompanyName());

        RuleFor(wcas => wcas.PriorityDate, f => f.Date.PastDateOnly(40));

        RuleFor(wcas => wcas.CertificateNumber, f => f.Random.Number(100000000, 1000000000).ToString());

        RuleFor(wcas => wcas.ShareNumber, f => f.Random.Number(100000000, 1000000000).ToString());

        RuleFor(wcas => wcas.WaterRightState, f => f.Address.StateAbbr());

        RuleFor(wcas => wcas.WaterUseDescription, f => f.Lorem.Sentence());

        RuleFor(wcas => wcas.FieldDetails, f => []);
    }
}
