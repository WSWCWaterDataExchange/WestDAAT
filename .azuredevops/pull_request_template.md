## DPL Pull Request Checklist
The reviewers of this Pull Request will verify that the conditions below have been met. Please review the first section to make sure you have included everything before submitting the PR
### Review before submitting
- Your code builds clean without any errors or warnings
- PR is small enough to be effectively reviewed. (Less than 200-400 lines of reviewable code)
- Assign the necessary reviewers to the PR
- Assign corresponding Stories and Activities
- Attach Screenshots of developed UI
### Testing
- [ ] Appropriate Unit Tests were created with the Code
- [ ] Appropriate Integration Tests were added if crossing services
- [ ] Appropriate UI Tests were created where needed
- [ ] Code Coverage was maintained
### Architecture
- [ ] New services have not been added that weren't in the architecture
- [ ] Functionality being added to existing services belongs in that service
- [ ] Engines are not referencing managers
- [ ] Accessors are not referencing engines and managers
- [ ] Manager to Manager calls are all Async or Queued
- [ ] Business logic is properly being encapsulated and tested in engines
- [ ] UI calls to managers are not too chatty or chunky
- [ ] Services are not directly referenced. (Only through dependency injection or service calls)
- [ ] Business volatilities are properly encapsulated (Minimal coupling, High cohesion, and Information Hiding)
- [ ] New methods on contracts followed Detailed Design
- [ ] Breaking changes have been identified for contracts
- [ ] New Data Contracts followed Detailed Design
- [ ] Contracts are being mapped properly between layers
### General Code Review
- [ ] Configuration file changes are correct
- [ ] No secure credentials are stored in source code
- [ ] Code is self documenting
    - User Variable Names
    - Comments
    - One class, data structure, interface, or enum per file
- [ ] Exceptions are handled properly
- [ ] Logging has been added to new code
- [ ] New external libaries have proper license
- [ ] New external libaries are encapsulated correctly
- [ ] Existing frameworks are on latest stable version where possible
### New Projects
- [ ] Namespacing is correct
- [ ] New Project belongs in this solution
- [ ] Code belongs in new project and not existing project
### Database Changes
- [ ] Upgrade Scripts account for all code changes
- [ ] Data types for new fields are correct
- [ ] No logic was added to the database that belongs in code
- [ ] No scalability concerns exist for new data
- [ ] Indexes are properly defined
- [ ] Foreign Keys are properly defined
### UI Changes
- [ ] Design comps were followed
- [ ] Client side architecture was followed
### Cloud Architecture Changes
- [ ] New cloud services have been provisioned
- [ ] New cloud services are secured
- [ ] Release pipeline was updated to deploy new services