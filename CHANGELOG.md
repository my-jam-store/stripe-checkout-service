# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Replace checkout line items deprecated data parameters with `price_data`.

## [0.4.0] - 2020-10-06
### Added
- An environment variable to enable/disable promotion codes.
- An environment variable to change Payment Intent capture method.

### Changed
- Refactor crypto module `ctrKey` function.

## [0.3.0] - 2020-10-05
### Added
- Shipping fee feature.

### Changed
- Replace checkout line items amount `code` field with encrypted amount field.
- Rename checkout lines items `id` field to `product_id`.
- Refactor checkout line items amount functions.
- Enable promotion codes feature.
- Bump `argon2` version number to `0.27.0`.

### Removed
- Checkout line items data validation.
- Checkout line items fields mapping.

## [0.2.0] - 2020-10-04
### Added
- Shipping address allowed countries feature.
- `gitignore` file.
- Add error logging to routes.

### Changed
- Session create endpoint request data structure.
- Rename project.
- Bump `lodash` version number to `4.17.20`.
- Rename routes.
- Refactor routes.
- Move Stripe module line items data processing code to a separate module and refactor code accordingly.
- Refactor Stripe module create checkout session function.

### Fixed
- Handling of line items quantity default value.
- `now.json` indentation.
- Handling line items multiple images.
- Add a missing `break` statement to Stripe function `processedLineItems` `switch` statement.
- Add some missing `Async/Await` keywords to Stripe module.

## [0.1.0] - 2020-04-27
### Added
- Initial release.

[Unreleased]: https://github.com/my-jam-store/stripe-checkout-service/compare/0.4.0...HEAD
[0.4.0]: https://github.com/my-jam-store/stripe-checkout-service/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/my-jam-store/stripe-checkout-service/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/my-jam-store/stripe-checkout-service/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/my-jam-store/stripe-checkout-service/releases/tag/0.1.0
