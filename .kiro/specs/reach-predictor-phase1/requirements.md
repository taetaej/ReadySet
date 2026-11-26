# Requirements Document

## Introduction

This document specifies the requirements for implementing Reach Predictor Phase 1 in the CreateScenario component. The Reach Predictor module enables users to predict advertising reach and performance metrics based on media budget allocation. Phase 1 focuses on establishing the basic media selection UI with support for both linked media (with product hierarchies) and unlinked media (standalone media without products).

## Glossary

- **Reach_Predictor**: An analysis module that predicts advertising reach and performance metrics based on media budget allocation
- **Linked_Media**: Media types that have associated product hierarchies (e.g., Google Ads with specific ad products)
- **Unlinked_Media**: Media types without product hierarchies, representing standalone media platforms
- **Confirmed_Budget**: The allocated budget amount for a specific media in thousands of Korean Won (천원)
- **Expected_Impressions**: The anticipated number of ad impressions for a specific media
- **CPM**: Cost Per Mille (thousand impressions), calculated as (Confirmed Budget / Expected Impressions) × 1000
- **Media_Row**: A single entry in the media selection table representing one media with its budget and impression data
- **Configuration_Summary**: The right-side panel that displays real-time summary of scenario settings

## Requirements

### Requirement 1: Media Selection Table Structure

**User Story:** As a user, I want to see a structured table for media selection, so that I can organize and manage my media budget allocations clearly.

#### Acceptance Criteria

1. WHEN the user is on Step 2 with Reach Predictor selected, THE System SHALL display a media selection table
2. THE Media_Selection_Table SHALL support two types of media: Linked_Media and Unlinked_Media
3. WHEN a media row is added, THE System SHALL display input fields for Confirmed_Budget, Expected_Impressions, and CPM
4. THE System SHALL display a "매체 추가" (Add Media) button to open the media selection dialog
5. WHEN no media are selected, THE System SHALL display an empty state message

### Requirement 2: Linked Media Selection

**User Story:** As a user, I want to select linked media with their products, so that I can include media that have product hierarchies in my analysis.

#### Acceptance Criteria

1. WHEN the user clicks "매체 추가" button, THE System SHALL open a media selection dialog
2. THE Media_Selection_Dialog SHALL display two tabs: "연동 매체" (Linked Media) and "미연동 매체" (Unlinked Media)
3. WHEN the "연동 매체" tab is active, THE System SHALL display all available linked media from mediaData (DIGITAL and TV categories)
4. WHEN a user selects a linked media, THE System SHALL open a product selection dialog for that media
5. WHEN products are selected, THE System SHALL add a new media row with the selected media and products
6. THE System SHALL use the same product selection pattern as Ratio Finder for consistency

### Requirement 3: Unlinked Media Selection

**User Story:** As a user, I want to select unlinked media without product selection, so that I can include standalone media platforms in my analysis.

#### Acceptance Criteria

1. WHEN the "미연동 매체" tab is active, THE System SHALL display all available unlinked media from the unlinkedMedia array
2. WHEN a user selects an unlinked media, THE System SHALL add a new media row without requiring product selection
3. THE System SHALL close the dialog immediately after unlinked media selection
4. THE Unlinked_Media list SHALL include: SMR, 11번가, CJ ONE, L.POINT, OK캐쉬백, SOOP, X(구.트위터), 골프존, 네이트, 넷플릭스, 다나와, 당근, 리멤버, 마이클, 배달의민족, 블라인드, 스노우, 스카이스캐너, 알바몬, 에브리타임, 에이블리, 엔카, 오늘의집, 웨이브, 잡코리아, 직방, 치지직, 카카오 T, 카카오뱅크, 카카오페이, 카카오페이지, 쿠팡, 토스, 티맵, 티빙, 틱톡, 페이코, 해피포인트

### Requirement 4: Budget Input Fields

**User Story:** As a user, I want to enter confirmed budget amounts for each media, so that I can specify my planned spending.

#### Acceptance Criteria

1. WHEN a media row is displayed, THE System SHALL provide a Confirmed_Budget input field
2. THE Confirmed_Budget field SHALL be marked as required with a red asterisk
3. THE Confirmed_Budget input SHALL accept numeric values only
4. THE System SHALL format the Confirmed_Budget input with thousand separators (e.g., 1,000,000)
5. WHEN the user enters a budget value, THE System SHALL update the CPM calculation if Expected_Impressions is also entered
6. THE Confirmed_Budget field SHALL display validation errors when empty or zero

### Requirement 5: Impressions Input Fields

**User Story:** As a user, I want to optionally enter expected impression counts, so that I can calculate CPM values for my media.

#### Acceptance Criteria

1. WHEN a media row is displayed, THE System SHALL provide an Expected_Impressions input field
2. THE Expected_Impressions field SHALL be optional (not required)
3. THE Expected_Impressions input SHALL accept numeric values only
4. THE System SHALL format the Expected_Impressions input with thousand separators
5. WHEN the user enters an impressions value, THE System SHALL update the CPM calculation if Confirmed_Budget is also entered
6. IF Expected_Impressions is entered, THEN it SHALL be greater than zero

### Requirement 6: CPM Auto-Calculation

**User Story:** As a user, I want CPM to be automatically calculated, so that I can see the cost efficiency of my media selections.

#### Acceptance Criteria

1. WHEN both Confirmed_Budget and Expected_Impressions are entered for a media row, THE System SHALL calculate CPM automatically
2. THE CPM calculation SHALL use the formula: (Confirmed_Budget / Expected_Impressions) × 1000
3. THE CPM field SHALL be read-only and display-only
4. WHEN either Confirmed_Budget or Expected_Impressions is empty, THE CPM field SHALL display "—" or remain empty
5. THE CPM value SHALL be formatted with thousand separators and display "원" unit

### Requirement 7: Media Row Management

**User Story:** As a user, I want to add and remove media rows, so that I can adjust my media selection as needed.

#### Acceptance Criteria

1. WHEN the user clicks "매체 추가" button, THE System SHALL open the media selection dialog
2. WHEN a media is selected from the dialog, THE System SHALL add a new row to the media table
3. WHEN a media row is displayed, THE System SHALL provide a delete button (X icon)
4. WHEN the user clicks the delete button, THE System SHALL remove that media row from the table
5. THE System SHALL prevent duplicate media selections (same media cannot be added twice)

### Requirement 8: Total Budget Display

**User Story:** As a user, I want to see the total sum of all confirmed budgets, so that I can track my overall spending.

#### Acceptance Criteria

1. WHEN media rows with Confirmed_Budget values exist, THE System SHALL calculate the total budget sum
2. THE System SHALL display the total budget sum at the bottom of the media table
3. THE Total_Budget display SHALL format the value with thousand separators
4. THE Total_Budget display SHALL update in real-time as budget values change
5. WHEN no media rows exist or all budgets are empty, THE Total_Budget SHALL display "0천원"

### Requirement 9: Step 2 Validation for Reach Predictor

**User Story:** As a user, I want validation feedback on my Reach Predictor settings, so that I can ensure all required information is provided before proceeding.

#### Acceptance Criteria

1. WHEN the user attempts to proceed from Step 2, THE System SHALL validate Reach Predictor settings
2. THE System SHALL require at least 1 media to be selected
3. THE System SHALL require each selected media to have a Confirmed_Budget greater than zero
4. IF Expected_Impressions is entered for any media, THEN it SHALL be greater than zero
5. WHEN validation fails, THE System SHALL display error messages below the relevant fields with red borders
6. WHEN validation passes, THE System SHALL enable the "다음" (Next) button

### Requirement 10: Configuration Summary Update

**User Story:** As a user, I want the Configuration Summary to reflect my Reach Predictor settings, so that I can review my selections in real-time.

#### Acceptance Criteria

1. WHEN media are selected in Reach Predictor, THE Configuration_Summary SHALL display the count of selected media
2. THE Configuration_Summary SHALL display the total confirmed budget sum
3. THE Configuration_Summary SHALL update in real-time as the user modifies media selections
4. WHEN no media are selected, THE Configuration_Summary SHALL display "—" for media count and budget
5. THE Configuration_Summary SHALL follow the same styling and format as Ratio Finder summary

### Requirement 11: UI Consistency with Ratio Finder

**User Story:** As a developer, I want Reach Predictor UI to follow Ratio Finder patterns, so that the user experience is consistent across modules.

#### Acceptance Criteria

1. THE Reach_Predictor UI SHALL use the same card width (800px) as Ratio Finder
2. THE Reach_Predictor UI SHALL use the same dark mode theme with hsl CSS variables
3. THE Reach_Predictor UI SHALL use the same button styles (btn, btn-ghost, btn-primary classes)
4. THE Reach_Predictor UI SHALL use the same input field styles (input class)
5. THE Reach_Predictor UI SHALL use the same dialog styles (dialog-overlay, dialog-content classes)
6. THE Reach_Predictor UI SHALL use the same validation pattern (red border + error message below field)

### Requirement 12: Media Selection Dialog UI

**User Story:** As a user, I want an intuitive media selection dialog, so that I can easily choose between linked and unlinked media.

#### Acceptance Criteria

1. THE Media_Selection_Dialog SHALL display two tabs: "연동 매체" and "미연동 매체"
2. WHEN a tab is clicked, THE System SHALL switch the active tab and display the corresponding media list
3. THE Active_Tab SHALL be visually distinguished with a bottom border and different background color
4. THE Media list SHALL be displayed in a scrollable area if content exceeds dialog height
5. THE Dialog SHALL include "취소" (Cancel) and "확인" (Confirm) buttons in the footer
6. WHEN "취소" is clicked, THE System SHALL close the dialog without making changes
7. WHEN "확인" is clicked for linked media, THE System SHALL proceed to product selection
8. WHEN "확인" is clicked for unlinked media, THE System SHALL add the media row and close the dialog
