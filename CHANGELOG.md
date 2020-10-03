# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Shipping address allowed countries feature.
- `gitignore` file.
- Add error logging to routes.

### Changed
- Session create endpoint request data structure.
- Rename project.
- Bump `lodash` version number to `4.17.20`.

### Fixed
- Handling of line items quantity default value.
- `now.json` indentation.
- Handling line items multiple images.
- Add a missing `break` statement to Stripe function `processedLineItems` `switch` statement.

## [0.1.0] - 2020-04-27
### Added
- Initial release.

[0.1.0]: https://github.com/my-jam-store/stripe-server-checkout/releases/tag/0.1.0
