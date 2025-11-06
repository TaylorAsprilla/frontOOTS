# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2025-11-15

### Added

#### Configuration Modules

- **Situaciones Identificadas (Identified Situations)** - Complete CRUD module
  - List component with search, filter by status, sorting, and pagination
  - Form component for create/edit with validation (3-200 characters)
  - Toggle active/inactive status functionality
  - Delete with SweetAlert2 confirmation
  - Integration with case creation form as checkbox list
  - API endpoints: `/api/identified-situations` with full CRUD operations
  - Translations for Spanish and English

#### UI/UX Improvements

- **Configuration Menu Dropdown** - Reorganized configuration menu
  - Converted 11 individual menu items into single collapsible dropdown
  - Grouped all configuration modules under "Configuración"
  - Improved navigation with parent-child menu relationships
  - Icon-based navigation with `settings` icon

#### Case Management

- **Dynamic Situation Checkboxes** - Enhanced case creation form
  - Step 2 now loads situations dynamically from API
  - Changed from textarea to responsive checkbox grid (3 columns)
  - Real-time selection with FormArray integration
  - Validation: at least one situation must be selected
  - Only active situations are displayed

#### Documentation

- **Comprehensive README** - Enhanced main documentation

  - Added badges for Angular, TypeScript, Bootstrap, License
  - Expanded Features section with emojis and descriptions
  - Detailed Technologies section with links and versions
  - Complete installation guide with prerequisites
  - Development section with all npm scripts explained
  - Project structure tree (300+ lines)
  - Configuration examples for dev/prod environments
  - Internationalization guide with code examples
  - Deployment section with Nginx/Apache configurations
  - Testing, contribution (Conventional Commits), troubleshooting
  - Metrics (bundle sizes, Lighthouse scores)
  - Roadmap with completed/in-progress/planned features

- **CONFIGURATION.md** - New comprehensive configuration documentation

  - Detailed documentation for all 11 configuration modules
  - Common architecture patterns (services, routes, components)
  - Code examples for each module
  - API endpoints reference
  - Translation structure
  - Troubleshooting section
  - Special focus on Identified Situations module

- **docs/README.md** - Enhanced documentation index
  - Professional structure with badges
  - Complete documentation table with status tracking
  - Quick start guides for different roles
  - Documentation conventions and best practices
  - Contribution guidelines for documentation
  - Links to external resources

### Changed

#### Menu Structure

- Reorganized configuration items from flat list to hierarchical dropdown
- Updated menu-meta.ts with parent-child relationships using `parentKey`
- All configuration items now under `configuration-management` parent

#### Translations

- Added `identifiedSituation` section to es.json and en.json
- Structured translations with nested objects for validation messages
- Added `configuration.title` for menu dropdown label

### Technical

#### Build Information

- **Build 1** (Post-CRUD): Hash `2fcd372809854080`, Time: 19.1s

  - Added 3 new chunks for identified-situations module
  - Chunk 232.js (list component): 13.86 kB
  - Chunk 5864.js (form component): 10.04 kB
  - Chunk 2626.js (routes): 600 bytes

- **Build 2** (Post-Menu): Hash `516a88fe309831dc`, Time: 20.5s
  - Configuration routes chunk increased: 424 → 447 bytes
  - All other chunks stable

#### Dependencies

- No new dependencies added
- All features implemented with existing Angular and Bootstrap capabilities

---

## [1.0.0] - 2025-10-XX

### Initial Release

#### Core Features

- User authentication with JWT
- Dashboard with statistics and charts
- User management module
- Participant management module
- Case management with 11-step wizard
- Configuration modules (10 initial modules):
  - Academic Levels
  - Approach Types
  - Document Types
  - Family Relationships
  - Genders
  - Health Insurance
  - Housing Types
  - Income Levels
  - Income Sources
  - Marital Statuses

#### UI Components

- Advanced table with sorting, filtering, pagination
- Reusable form components
- Modal system
- Alert and notification system
- Breadcrumb navigation
- Page title component

#### Technical Foundation

- Angular 20.1.6 with standalone components
- Bootstrap 5.3.3 for UI
- Transloco for i18n (Spanish/English)
- RxJS for reactive programming
- TypeScript 5.7.2
- SCSS for styling

#### Authentication System

- JWT token-based authentication
- HTTP interceptors for automatic token injection
- Route guards for protected routes
- Token storage in localStorage
- Session validation
- Login/logout flows

#### Documentation

- README with basic setup instructions
- AUTH_SYSTEM.md with authentication details
- TABLE_ACTIONS.md with table action patterns

---

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): New functionality in a backwards compatible manner
- **PATCH** version (0.0.X): Backwards compatible bug fixes

---

## Types of Changes

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security vulnerability fixes
- **Technical** - Build, dependency, or infrastructure changes

---

## Links

- [Angular Documentation](https://angular.io/docs)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

<div align="center">

**Last updated:** November 2025  
**Current version:** 1.1.0

</div>
