### Web Security
- [ ] HTTP Requests are restricted to the expected type
- [ ] Requests that change data are POSTs
- [ ] Requests that change data are protected by an anti-forgery token
- [ ] Output of untrusted data is properly escaped
- [ ] APIs are parameterized
- [ ] Actions are protected with an authentication check before executing code
- [ ] All pages and resources are protected by authentication unless intended to be public
- [ ] Server side checks are performed based on trusted information (not solely based on submitted information)
- [ ] Authentication Credentials are stored securely
- [ ] X-Frame-Options header is included on every response
### Cookie Security
- [ ] Secure Flag and httponly flag are set on every cookie
- [ ] Session cookies only contain randomly generated identifiers
- [ ] Session cookies expire within a reasonable amount of time
- [ ] Session IDs are invalidated on user logout
### App Security
- [ ] Global Error Handling is implemented (no unhandled exceptions)
### Sensitive Data
- [ ] Encrypted at rest
- [ ] Encrypted in transit
- [ ] Only stored when necessary
- [ ] Discarded as soon as possible
- [ ] Autocomplete is disable in the UI for field with sensitive data
- [ ] Pages with sensitive data disable caching
- [ ] All compliance is followed (e.g. HIPAA, PCI, COPPA)
