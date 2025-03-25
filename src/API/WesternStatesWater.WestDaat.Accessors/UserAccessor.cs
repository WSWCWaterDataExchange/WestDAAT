using AutoMapper.QueryableExtensions;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Accessors.Mapping;

namespace WesternStatesWater.WestDaat.Accessors;

internal class UserAccessor : AccessorBase, IUserAccessor
{
    private readonly EFWD.IWestDaatDatabaseContextFactory _westdaatDatabaseContextFactory;

    public UserAccessor(ILogger<UserAccessor> logger, EFWD.IWestDaatDatabaseContextFactory westdaatDatabaseContextFactory) : base(logger)
    {
        _westdaatDatabaseContextFactory = westdaatDatabaseContextFactory;
    }

    public async Task<UserLoadResponseBase> Load(UserLoadRequestBase request)
    {
        return request switch
        {
            NotificationUserRequest req => await GetNotificationUser(req),
            UserExistsRequest req => await GetUserExists(req),
            UserListRequest req => await ListUsers(req),
            UserLoadRolesRequest req => await GetUserRoles(req),
            UserNameExistsRequest req => await GetUserNameExists(req),
            UserProfileRequest req => await GetUserProfile(req),
            UserSearchRequest req => await SearchUsers(req),
            _ => throw new NotImplementedException(
                $"Handling of request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private async Task<NotificationUserResponse> GetNotificationUser(NotificationUserRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var user = await db.Users
            .Where(u => u.Id == request.UserId)
            .ProjectTo<NotificationUser>(DtoMapper.Configuration)
            .SingleOrDefaultAsync();

        NotFoundException.ThrowIfNull(user, $"User not found for id {request.UserId}");

        return new NotificationUserResponse
        {
            User = user,
        };
    }

    private async Task<UserLoadRolesResponse> GetUserRoles(UserLoadRolesRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var user = await db.Users
            .AsNoTracking()
            .Include(u => u.UserRoles)
            .Include(u => u.UserOrganizations)
            .ThenInclude(uor => uor.UserOrganizationRoles)
            .FirstOrDefaultAsync(u => u.ExternalAuthId == request.ExternalAuthId);

        NotFoundException.ThrowIfNull(user, $"User not found for auth id {request.ExternalAuthId}");

        return new UserLoadRolesResponse
        {
            UserId = user.Id,
            UserRoles = user.UserRoles.Select(ur => ur.Role).ToArray(),
            UserOrganizationRoles = user.UserOrganizations.SelectMany(uo => uo.UserOrganizationRoles.Select(uor => new UserOrganizationRoleDetails
            {
                OrganizationId = uo.OrganizationId,
                Role = uor.Role
            })).ToArray()
        };
    }

    private async Task<UserProfileResponse> GetUserProfile(UserProfileRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var user = await db.Users
            .Where(u => u.Id == request.UserId)
            .ProjectTo<UserProfile>(DtoMapper.Configuration)
            .FirstOrDefaultAsync();

        NotFoundException.ThrowIfNull(user, $"User not found for id {request.UserId}");

        return new UserProfileResponse
        {
            UserProfile = user
        };
    }

    private async Task<UserExistsResponse> GetUserExists(UserExistsRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var userExists = await db.Users.AnyAsync(u => u.ExternalAuthId == request.ExternalAuthId);

        return new UserExistsResponse
        {
            UserExists = userExists
        };
    }

    private async Task<UserListResponse> ListUsers(UserListRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var query = db.Users
            .Where(u => u.UserProfile != null)
            .OrderBy(u => u.UserProfile.FirstName)
            .ThenBy(u => u.UserProfile.LastName)
            .AsQueryable();

        if (request.OrganizationId != null)
        {
            query = query.Where(u => u.UserOrganizations.Any(uo => uo.OrganizationId == request.OrganizationId));
        }

        var users = await query
            .ProjectTo<UserListResult>(DtoMapper.Configuration)
            .ToArrayAsync();

        return new UserListResponse
        {
            Users = users
        };
    }

    private async Task<UserSearchResponse> SearchUsers(UserSearchRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var trimmedSearchTerm = request.SearchTerm.Trim();

        var searchResults = await db.Users
            .Where(user => user.UserProfile != null)
            .Where(user =>
                user.UserProfile.FirstName.Contains(trimmedSearchTerm) ||
                user.UserProfile.LastName.Contains(trimmedSearchTerm) ||
                user.UserProfile.UserName.Contains(trimmedSearchTerm) ||
                (user.UserProfile.FirstName + " " + user.UserProfile.LastName).Contains(trimmedSearchTerm)
            )
            .OrderBy(u => u.UserProfile.FirstName)
            .ThenBy(u => u.UserProfile.LastName)
            .Take(20)
            .ProjectTo<UserSearchResult>(DtoMapper.Configuration)
            .ToArrayAsync();

        return new UserSearchResponse
        {
            SearchResults = searchResults
        };
    }

    private async Task<UserNameExistsResponse> GetUserNameExists(UserNameExistsRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var usernameExists = await db.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.UserProfile != null && u.UserProfile.UserName == request.UserName);

        return new UserNameExistsResponse
        {
            Exists = usernameExists
        };
    }

    public async Task<UserStoreResponseBase> Store(UserStoreRequestBase request)
    {
        return request switch
        {
            UserStoreCreateRequest req => await CreateUser(req),
            UserProfileCreateRequest req => await CreateUserProfile(req),
            UserProfileUpdateRequest req => await UpdateUserProfile(req),
            _ => throw new NotImplementedException(
                $"Handling of request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private async Task<UserStoreResponseBase> CreateUser(UserStoreCreateRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var entity = DtoMapper.Map<EFWD.User>(request);

        await db.Users.AddAsync(entity);
        await db.SaveChangesAsync();

        return new UserStoreResponseBase();
    }

    private async Task<UserStoreResponseBase> CreateUserProfile(UserProfileCreateRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var user = await db.Users
            .Include(u => u.UserProfile)
            .FirstOrDefaultAsync(u => u.Id == request.UserId);

        if (user.UserProfile != null)
        {
            throw new InvalidOperationException($"User profile already exists for user id {request.UserId}");
        }

        var entity = DtoMapper.Map<EFWD.UserProfile>(request);

        user!.UserProfile = entity;

        await db.SaveChangesAsync();

        return new UserStoreResponseBase();
    }

    private async Task<UserStoreResponseBase> UpdateUserProfile(UserProfileUpdateRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var user = await db.Users
            .Include(u => u.UserProfile)
            .FirstOrDefaultAsync(u => u.Id == request.UserId);

        NotFoundException.ThrowIfNull(user?.UserProfile, $"User profile not found for id {request.UserId}");

        DtoMapper.Map(request, user!.UserProfile);

        await db.SaveChangesAsync();

        return new UserStoreResponseBase();
    }
}