# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2025-11-17

### Added

#### Password Management System

- **Cambiar Contraseña (Change Password)** - Complete change password flow

  - Component for authenticated users to change their password
  - Validation: current password, new password (min 8 chars), confirm password
  - Password visibility toggles for all fields
  - Custom validator for password match
  - Success message with automatic redirect to login
  - Security note about re-authentication requirement
  - Route: `/change-password`
  - Accessible from topbar user menu dropdown

- **Recuperar Contraseña (Forgot/Recover Password)** - Password recovery flow

  - Email input form to request password reset
  - Server sends recovery email with reset link
  - Token validation from URL (route params and query params)
  - Success messages and error handling
  - Route: `/auth/forgot-password`
  - Link available on login page

- **Restablecer Contraseña (Reset Password)** - Password reset with token

  - Token-based password reset form
  - New password and confirm password fields with validation
  - Password strength requirements (8+ chars, uppercase, lowercase, numbers)
  - Token expiration handling
  - Automatic redirect to login after successful reset
  - Route: `/auth/reset-password/:token`
  - Consolidated in same component as forgot-password (RecoverPasswordComponent)

- **Password Management Consolidation**
  - Single RecoverPasswordComponent handles both forgot and reset flows
  - Detects token presence in URL to switch between modes
  - Reads token from route params (`/reset-password/:token`) OR query params (`?token=xxx`)
  - Dynamic form fields based on current mode (email vs password fields)
  - Custom password match validator shared across components

#### User Profile Management

- **Mi Cuenta (My Account)** - Complete user profile system

  - Profile page showing authenticated user information
  - User info card with avatar, name, position, email
  - Social media links (Facebook, Twitter, Instagram, LinkedIn, GitHub)
  - Conditional display of social icons (only if URL configured)
  - Route: `/apps/contacts/profile`
  - Accessible from topbar user menu dropdown

- **Editable Profile Form** - Full profile editing capabilities

  - Form fields: First Name, Last Name, Phone Number, Position
  - Social media URL inputs for 5 platforms
  - Form validation (required fields for name)
  - Success/error message display
  - Backend integration via PATCH `/api/v1/auth/profile`
  - Automatic localStorage update after profile changes
  - Loading states with spinner during save
  - Profile data loaded from `/api/v1/auth/validate` endpoint

- **Profile Simplification**
  - Removed inbox section (commented out)
  - Removed tabs navigation (Activities, Projects, Settings)
  - Removed "Acerca de" and "Actividad" sections
  - Removed website field from profile form
  - Clean layout: user card + editable form only

#### Internationalization (i18n)

- **Complete Translation System** - Full i18n implementation for authentication and profile

  - TranslocoModule integrated in all auth and profile components
  - 80+ new translation keys added to `es.json`
  - Organized in hierarchical structure: `auth` and `profile` sections

- **Auth Translations** (`auth` section)

  - Change password: titles, labels, placeholders, validation messages
  - Forgot password: email form, send instructions, info messages
  - Reset password: new password form, security notes
  - Common: buttons, errors, success messages, redirects
  - Password requirements and strength hints
  - Security notes and user guidance

- **Profile Translations** (`profile` section)

  - Personal information section labels
  - Form field labels and placeholders (first name, last name, phone, position)
  - Social network names and placeholders (Facebook, Twitter, Instagram, LinkedIn, GitHub)
  - Validation messages (required fields, field format)
  - Action buttons (save, saving, cancel)
  - Success/error messages
  - User card labels (about, full name, email, position, website)
  - Conditional texts (not specified, user)

- **Translation Coverage**
  - ✅ `change-password.component.html` - Fully translated
  - ✅ `recover-password.component.html` - Fully translated (both modes)
  - ✅ `profile.component.html` - Fully translated
  - ✅ `settings.component.html` - Fully translated
  - ✅ `userbox.component.html` - Fully translated

#### API Integration

- **Auth Service Extensions**

  - `updateProfile(payload: UpdateProfileDto)` - PATCH endpoint for profile updates
  - Updates localStorage with new user data after successful save
  - `validateToken()` - Gets full user data including social media fields

- **New Interfaces** (`auth.interface.ts`)

  - `UpdateProfileDto` - DTO for profile update requests
  - `UserProfile` - User profile data structure
  - `UpdateProfileResponse` - API response structure
  - Extended `ValidatedUser` - Added social media fields (facebook, twitter, instagram, linkedin, github) and headquarters

- **MemberInfo Interface** - Extended with social fields
  - Added: email, phoneNumber, facebook, twitter, instagram, linkedin, github
  - Used by profile components for display and editing

### Changed

#### Navigation and Menu

- **Topbar User Menu** - Enhanced with new options

  - Added "Mi Cuenta" link to user profile (`/apps/contacts/profile`)
  - Added "Cambiar Contraseña" link (`/change-password`)
  - Restructured dropdown with proper icons and styling

- **Contacts Module** - Enabled routing
  - Uncommented contacts route in `apps-routing.module.ts`
  - Profile route now accessible: `/apps/contacts/profile`

#### Component Architecture

- **ProfileComponent** - Refactored for authenticated user

  - Changed from static data to dynamic API call
  - Uses `validateToken()` instead of `currentUser()` for full user data
  - Added loading state with spinner
  - Imported TranslocoModule for translations
  - Adapted to show logged-in user's profile

- **SettingsComponent** - Enhanced profile editing

  - Added social media form controls (5 platforms)
  - Integrated UpdateProfileDto for backend communication
  - Success/error messaging with dismissible alerts
  - Loading state on save button
  - Profile update event emitter for parent components
  - Imported TranslocoModule for translations

- **UserboxComponent** - Enhanced user card
  - Social icons display conditionally with \*ngIf
  - Shows user data from ValidatedUser interface
  - Imported TranslocoModule for translations
  - Clean layout without unnecessary sections

#### Token Handling

- **RecoverPasswordComponent** - Improved token reading
  - Reads token from route params: `/reset-password/:token`
  - Fallback to query params: `/reset-password?token=xxx`
  - Handles both URL formats for better compatibility
  - Token validation before showing form

### Technical

#### Documentation

- **README.md** - Updated version and roadmap

  - Version bumped to 1.2.0
  - Updated roadmap with completed features (password management, i18n, profile)
  - Marked items as completed with ✅ emoji

- **CHANGELOG.md** - This comprehensive update

  - Documented all password management features
  - Detailed profile management system
  - Complete i18n implementation details
  - API changes and interface updates

- **Removed Obsolete Documentation**
  - Deleted `docs/README_OLD.md` - Outdated documentation file
  - Cleaned up documentation folder for better organization

#### Build Information

- **Bundle Size**: Stable (no significant increase)
- **New Components**: 2 (ChangePasswordComponent, enhanced RecoverPasswordComponent)
- **Updated Components**: 5 (ProfileComponent, SettingsComponent, UserboxComponent, ChangePasswordComponent, RecoverPasswordComponent)
- **Translation Keys**: +80 new keys in es.json

#### File Structure

```
src/app/
├── auth/
│   ├── account/
│   │   ├── change-password/          # NEW
│   │   │   ├── change-password.component.ts
│   │   │   ├── change-password.component.html
│   │   │   └── change-password.component.scss
│   │   └── recover-password/         # ENHANCED
│   │       ├── recover-password.component.ts
│   │       ├── recover-password.component.html
│   │       └── recover-password.component.scss
│   └── auth.routes.ts                # UPDATED
├── apps/contacts/profile/            # ENHANCED
│   ├── profile.component.ts          # UPDATED
│   ├── profile.component.html        # UPDATED
│   ├── settings/                     # UPDATED
│   │   ├── settings.component.ts
│   │   └── settings.component.html
│   └── userbox/                      # UPDATED
│       ├── userbox.component.ts
│       └── userbox.component.html
├── core/
│   ├── interfaces/
│   │   └── auth.interface.ts         # UPDATED
│   ├── services/
│   │   └── auth.service.ts           # UPDATED
│   └── validators/
│       └── password-match.validator.ts # NEW
└── assets/i18n/
    └── es.json                        # UPDATED (+80 keys)
```

### Fixed

- Token reading from URL in password reset flow
- Profile form validation and error handling
- Social media icons conditional rendering
- Loading states across profile components
- Translation pipe errors (added missing TranslocoModule imports)

### Security

- Password validation strengthened (min 8 chars, pattern requirements)
- Current password verification for password changes
- Token-based password reset with expiration
- Secure token transmission via URL params
- Re-authentication required after password change
- PATCH endpoint for profile updates with authentication

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
