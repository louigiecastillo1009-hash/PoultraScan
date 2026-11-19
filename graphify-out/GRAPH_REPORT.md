# Graph Report - Poultry Scanner  (2026-11-19)

## Corpus Check
- 262 files · ~69,816 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 1301 nodes · 3823 edges · 48 communities (38 shown, 10 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 216 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c099df0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuth
- ScanSessionController
- ScanSummaryController
- src/components/index.js
- apiRequest
- database.py
- FarmController
- os
- sqlalchemy
- AuthController
- frontend/package.json
- Surface
- Button
- test_abstract_email_service.py
- activity_log_route.py
- chicken_image_route.py
- src/components/index.js
- UserService
- react-icons
- project.yml
- app/index.js
- Notice
- UserController
- main.py
- AIPredictionService
- gemini_disease_classifier.py
- gemini_image_counter.py
- FarmLocationSelect
- avatarIcons.jsx
- routes.jsx
- user_service.py
- psgcApi.js
- EmailService
- AiScan.jsx
- test_measurements.py
- ChickenWeightEstimator
- FastAPI
- .oxlintrc.json
- test_quota_retry_replaces_previous_rows
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `react-icons` - 73 edges
2. `react` - 60 edges
3. `Button()` - 44 edges
4. `apiRequest()` - 42 edges
5. `react-router-dom` - 34 edges
6. `AIPredictionService` - 30 edges
7. `AuthController` - 28 edges
8. `UserService` - 27 edges
9. `Base` - 27 edges
10. `Surface()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `get_measurements()` --uses--> `DetectedChicken`  [INFERRED]
  backend/routes/ai_prediction_route.py → backend/models/detected_chicken.py
- `AIPredictionService` --uses--> `DetectedChicken`  [INFERRED]
  backend/services/ai_prediction_service.py → backend/models/detected_chicken.py
- `DetectionService` --uses--> `DetectedChicken`  [INFERRED]
  backend/services/detection_service.py → backend/models/detected_chicken.py
- `ScanSummaryService` --uses--> `DetectedChicken`  [INFERRED]
  backend/services/scan_summary_service.py → backend/models/detected_chicken.py
- `save_measurements()` --uses--> `MeasurementSchema`  [INFERRED]
  backend/routes/ai_prediction_route.py → backend/schemas/ai_prediction_schema.py

## Import Cycles
- 2-file cycle: `frontend/src/pages/home/components/HowItWorks.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HowItWorks.jsx`
- 2-file cycle: `frontend/src/pages/home/components/Hero.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/Hero.jsx`
- 2-file cycle: `frontend/src/pages/home/components/FeatureGrid.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/FeatureGrid.jsx`
- 2-file cycle: `frontend/src/pages/home/components/CtaBanner.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/CtaBanner.jsx`
- 2-file cycle: `frontend/src/pages/home/components/HeroVisual.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HeroVisual.jsx`
- 2-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/Footer.jsx`
- 2-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ChickenCard.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/TotalsFooter.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/AccuracyNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/CameraCaptureModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/FarmRequiredModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/NoActiveFarmNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ScanningView.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 4-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx`
- 5-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 5-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 5-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`

## Communities (48 total, 10 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.12
Nodes (22): useAuth(), CtaBanner(), FeatureCard(), FeatureGrid(), features, checks, Hero(), HeroVisual() (+14 more)

### Community 1 - "ScanSessionController"
Cohesion: 0.07
Nodes (29): NotificationController, ScanSessionController, get_current_user_id(), Notification, ScanSession, ScanStatus, create_notification(), delete_notification() (+21 more)

### Community 2 - "ScanSummaryController"
Cohesion: 0.10
Nodes (20): ScanSummaryController, ScanSummary, create_scan_summary(), delete_scan_summary(), generate_scan_summary(), get_all_scan_summaries(), get_my_dashboard_stats(), get_my_scan_history() (+12 more)

### Community 3 - "src/components/index.js"
Cohesion: 0.18
Nodes (12): Badge(), sizes, tones, NotificationsMenu(), timeAgo(), PoultryScanLoader(), useNotifications(), formatDate() (+4 more)

### Community 4 - "apiRequest"
Cohesion: 0.07
Nodes (49): apiRequest(), BASE_URL, formatErrorDetail(), FeedbackAPI, NotificationAPI, AuthContext, AuthProvider(), checkServerHealth() (+41 more)

### Community 5 - "database.py"
Cohesion: 0.16
Nodes (12): JournalEntryController, JournalEntry, create_journal_entry(), delete_journal_entry(), get_journal_entries_by_farm(), get_journal_entry_by_id(), get_my_journal_entries(), update_journal_entry() (+4 more)

### Community 6 - "FarmController"
Cohesion: 0.08
Nodes (18): FarmController, downgrade(), upgrade(), Farm, create_farm(), delete_farm(), get_all_farms(), get_farm_by_id() (+10 more)

### Community 7 - "os"
Cohesion: 0.11
Nodes (7): save_farm_image(), compress_image(), convert_to_jpeg(), preprocess_image(), save_compressed_image(), should_tile(), split_into_tiles()

### Community 8 - "sqlalchemy"
Cohesion: 0.07
Nodes (18): Base, run_migrations_offline(), run_migrations_online(), upgrade(), downgrade(), upgrade(), downgrade(), upgrade() (+10 more)

### Community 9 - "AuthController"
Cohesion: 0.16
Nodes (19): AuthController, forgot_password(), get_current_user(), google_login(), login(), logout(), register(), reset_password() (+11 more)

### Community 10 - "frontend/package.json"
Cohesion: 0.07
Nodes (35): dependencies, lucide-react@^1.23.0, react@^19.2.7, react-dom@^19.2.7, react-icons@^5.7.0, @react-oauth/google@^0.13.5, react-router-dom@^7.18.1, tailwindcss@^4.3.2 (+27 more)

### Community 11 - "Surface"
Cohesion: 0.13
Nodes (23): EmptyState(), paddings, radii, Surface(), tones, NoActiveFarmNotice(), AlertFeed(), timeAgo() (+15 more)

### Community 12 - "Button"
Cohesion: 0.16
Nodes (19): Button(), getPredictionsBySession(), ChickenPredictionCard(), ConfirmDeleteModal(), DetailStat(), TONES, FilterBar(), HealthBreakdown() (+11 more)

### Community 13 - "test_abstract_email_service.py"
Cohesion: 0.16
Nodes (19): AbstractEmailService, FakeResponse, test_check_disabled_in_development_without_api_call(), fake_get(), test_check_disabled_when_app_env_is_development(), fake_get(), test_check_skipped_when_api_key_missing_in_production(), fake_get() (+11 more)

### Community 14 - "activity_log_route.py"
Cohesion: 0.16
Nodes (10): ActivityLogController, ActivityLog, create_activity_log(), delete_activity_log(), get_activity_log_by_id(), get_activity_logs_by_user(), get_all_activity_logs(), ActivityLogResponseSchema (+2 more)

### Community 15 - "chicken_image_route.py"
Cohesion: 0.15
Nodes (11): ChickenImageController, ChickenImage, create_chicken_image(), delete_chicken_image(), get_all_chicken_images(), get_chicken_image_by_id(), get_images_by_detected_chicken(), ChickenImageResponseSchema (+3 more)

### Community 16 - "src/components/index.js"
Cohesion: 0.15
Nodes (18): ModalShell(), AppModal(), sizeMap, variantConfig, ContactSupportContent(), FeedbackModal(), Footer(), navigateLinks (+10 more)

### Community 17 - "UserService"
Cohesion: 0.17
Nodes (7): User, UserService, FakeDB, test_register_allows_valid_email(), test_register_rejects_risky_email(), blocked(), test_update_email_change_checks_new_email()

### Community 18 - "react-icons"
Cohesion: 0.10
Nodes (13): sizes, QuickScanModal(), SettingsMenu(), navLinks, navLinksRight, SEVERITY_STYLES, AccuracyNotice(), CameraCaptureModal() (+5 more)

### Community 19 - "project.yml"
Cohesion: 0.08
Nodes (25): activation_command, activation_command_timeout, added_modes, agent_interface, default_modes, encoding, excluded_apis, excluded_tools (+17 more)

### Community 20 - "app/index.js"
Cohesion: 0.13
Nodes (10): AppLayout(), buttonStyles(), sizes, variants, tones, BottomNav(), ProfileMenu(), getActiveFromPath() (+2 more)

### Community 21 - "Notice"
Cohesion: 0.25
Nodes (14): Notice(), PageHeader(), TextField(), useActiveFarm(), DeleteFarmModal(), EditFarmModal(), FarmCard(), FarmInfoCard() (+6 more)

### Community 22 - "UserController"
Cohesion: 0.19
Nodes (7): UserController, delete_user(), get_all_users(), get_user(), update_user(), upload_avatar(), UpdateUserSchema

### Community 23 - "main.py"
Cohesion: 0.16
Nodes (5): _build_alembic_config(), ensure_migrated(), health_check(), lifespan(), unhandled_exception_handler()

### Community 24 - "AIPredictionService"
Cohesion: 0.11
Nodes (8): get_measurements(), get_predictions_by_session(), predict_disease(), save_measurements(), AIPredictionService, test_provider_failure_is_distinct_from_photo_retake(), test_multi_angle_persistence_history_and_duplicate_submission(), test_unavailable_classification_is_unknown_not_healthy()

### Community 25 - "gemini_disease_classifier.py"
Cohesion: 0.05
Nodes (33): RoboflowAPIError, RoboflowTimeoutError, run_chicken_detection(), test_out_of_order_response_stays_attached_to_correct_image(), _build_prompt(), _compute_oil_ml(), _detect_mime_type(), GeminiInsightsError (+25 more)

### Community 26 - "gemini_image_counter.py"
Cohesion: 0.10
Nodes (11): DetectionController, DetectionService, _build_model_chain(), _convert_box_2d_to_pixel_box(), count_chickens_with_gemini(), _detect_mime_type(), GeminiCountingError, _get_image_dimensions() (+3 more)

### Community 28 - "FarmLocationSelect"
Cohesion: 0.33
Nodes (4): emptyPlaceholder(), FarmLocationSelect(), handleSearchKey(), handleSelect()

### Community 29 - "avatarIcons.jsx"
Cohesion: 0.18
Nodes (8): MiniAvatar(), Avatar(), AVATAR_ICON_KEYS, AVATAR_ICONS, getIconKey(), isIconAvatar(), resolveAvatarSrc(), getInitials()

### Community 30 - "routes.jsx"
Cohesion: 0.15
Nodes (13): App(), LoadingScreen(), ActiveFarmContext, ActiveFarmProvider(), HomeRedirect(), ProtectedRoute(), NotFound(), ProfileAPI (+5 more)

### Community 32 - "user_service.py"
Cohesion: 0.22
Nodes (3): create_access_token(), hash_password(), verify_password()

### Community 33 - "psgcApi.js"
Cohesion: 0.27
Nodes (14): cache, fetchBarangays(), fetchProvinceCitiesMunicipalities(), fetchProvinces(), fetchPsgc(), fetchRegionCitiesMunicipalities(), fetchRegions(), inFlight (+6 more)

### Community 34 - "EmailService"
Cohesion: 0.16
Nodes (4): FeedbackController, submit_feedback(), FeedbackSchema, EmailService

### Community 37 - "AiScan.jsx"
Cohesion: 0.08
Nodes (20): SEVERITY_RANK, summarize(), useQuickScan(), predictDisease(), countChickens(), createScanSession(), MeasurementForm(), presentChicken() (+12 more)

### Community 38 - "test_measurements.py"
Cohesion: 0.36
Nodes (6): DetectedChicken, ScanType, MeasurementSchema, test_invalid_measurement_rejected(), test_measurement_roundtrip_ownership_and_partial_update(), test_partial_or_malformed_batch_is_rejected()

### Community 41 - "FastAPI"
Cohesion: 0.12
Nodes (10): AIPredictionController, _detect_ssl_mode(), _ensure_database_exists(), get_db(), _resolve_ssl_ca_path(), count_chickens(), BatchPredictionResponseSchema, ChickenPredictionSchema (+2 more)

### Community 42 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 44 - "test_quota_retry_replaces_previous_rows"
Cohesion: 0.18
Nodes (13): photo(), test_capacity_rejects_parallel_request_and_releases_after_failure(), test_crop_cap_preserves_aspect_ratio(), test_invalid_box_never_substitutes_whole_flock(), test_quota_retry_replaces_previous_rows(), fail_gemini(), fail_router(), test_source_storage_preserves_detection_coordinates() (+5 more)

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-icons` connect `react-icons` to `useAuth`, `src/components/index.js`, `apiRequest`, `AiScan.jsx`, `frontend/package.json`, `Surface`, `Button`, `src/components/index.js`, `app/index.js`, `Notice`, `avatarIcons.jsx`, `routes.jsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.12233285917496443 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react-icons` to `useAuth`, `psgcApi.js`, `src/components/index.js`, `apiRequest`, `AiScan.jsx`, `frontend/package.json`, `Surface`, `Button`, `src/components/index.js`, `app/index.js`, `Notice`, `routes.jsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `ScanSessionController` be split into smaller, more focused modules?**
  _Cohesion score 0.06593707250341997 - nodes in this community are weakly interconnected._
- **Why does `User` connect `UserService` to `user_service.py`, `test_measurements.py`, `sqlalchemy`, `test_quota_retry_replaces_previous_rows`, `test_abstract_email_service.py`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Should `ScanSummaryController` be split into smaller, more focused modules?**
  _Cohesion score 0.10377358490566038 - nodes in this community are weakly interconnected._
- **Should `apiRequest` be split into smaller, more focused modules?**
  _Cohesion score 0.06846846846846846 - nodes in this community are weakly interconnected._