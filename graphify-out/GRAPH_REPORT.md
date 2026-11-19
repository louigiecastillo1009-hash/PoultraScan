# Graph Report - Poultry Scanner  (2026-11-19)

## Corpus Check
- 268 files · ~72,941 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 1355 nodes · 3930 edges · 71 communities (51 shown, 20 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 216 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74ac7a3f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuth
- ScanSessionController
- ScanSummaryController
- RecentScansTable.jsx
- AiScan.jsx
- database.py
- FarmController
- os
- sqlalchemy
- AuthController
- frontend/package.json
- Surface
- ScanDetailModal.jsx
- test_abstract_email_service.py
- activity_log_route.py
- chicken_image_route.py
- home/components/Footer.jsx
- routes.jsx
- react-icons
- project.yml
- apiRequest
- Button
- sqlalchemy_orm
- AIPredictionService
- gemini_client.py
- gemini_image_counter.py
- AuthContext.jsx
- avatarIcons.jsx
- gemini_disease_classifier.py
- Dashboard.jsx
- UserController
- psgcApi.js
- EmailService
- test_quota_retry_replaces_previous_rows
- delete_farm
- ResultsView.jsx
- env.py
- ChickenWeightEstimator
- farmApi.js
- .oxlintrc.json
- ai_prediction_service.py
- json
- app/index.js
- vercel.json
- FarmService
- UserService
- ActivityLogService
- DetectionController
- main.py
- b8d4e6c2f9a1_add_ai_prediction_insight_columns.py
- src/components/index.js
- ScanCard.jsx
- user_service.py
- RegisterUserSchema
- ScanSummaryService
- Profile.jsx
- database.py
- .create
- BottomNav.jsx
- pydantic
- ChickenImageService
- FarmLocationSelect

## God Nodes (most connected - your core abstractions)
1. `react-icons` - 73 edges
2. `react` - 61 edges
3. `apiRequest()` - 44 edges
4. `AIPredictionService` - 40 edges
5. `Button()` - 36 edges
6. `react-router-dom` - 34 edges
7. `Base` - 29 edges
8. `AuthController` - 28 edges
9. `UserService` - 27 edges
10. `User` - 24 edges

## Surprising Connections (you probably didn't know these)
- `ScanSummaryController` --uses--> `ScanSummaryService`  [INFERRED]
  backend/controllers/scan_summary_controller.py → backend/services/scan_summary_service.py
- `AIPredictionService` --uses--> `ScanSummaryService`  [INFERRED]
  backend/services/ai_prediction_service.py → backend/services/scan_summary_service.py
- `test_summary_does_not_count_low_confidence_findings_as_disease()` --uses--> `ScanSummaryService`  [INFERRED]
  backend/tests/test_market_and_corrections.py → backend/services/scan_summary_service.py
- `AIPredictionService` --uses--> `GeminiInsightsError`  [INFERRED]
  backend/services/ai_prediction_service.py → backend/utils/gemini_client.py
- `ChickenCard()` --calls--> `MeasurementEditor()`  [EXTRACTED]
  frontend/src/pages/ai-scan/components/ChickenCard.jsx → frontend/src/pages/ai-scan/components/MeasurementEditor.jsx

## Import Cycles
- 2-file cycle: `frontend/src/pages/home/components/HowItWorks.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HowItWorks.jsx`
- 2-file cycle: `frontend/src/pages/home/components/Hero.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/Hero.jsx`
- 2-file cycle: `frontend/src/pages/home/components/FeatureGrid.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/FeatureGrid.jsx`
- 2-file cycle: `frontend/src/pages/home/components/CtaBanner.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/CtaBanner.jsx`
- 2-file cycle: `frontend/src/pages/home/components/HeroVisual.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HeroVisual.jsx`
- 2-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/Footer.jsx`
- 2-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ChickenCard.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/NoActiveFarmNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/CameraCaptureModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/AccuracyNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/FarmRequiredModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ScanningView.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/TotalsFooter.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 4-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx`
- 5-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 5-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 5-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`

## Communities (71 total, 20 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.12
Nodes (21): useAuth(), CtaBanner(), FeatureCard(), FeatureGrid(), features, checks, Hero(), HeroVisual() (+13 more)

### Community 1 - "ScanSessionController"
Cohesion: 0.07
Nodes (26): NotificationController, ScanSessionController, Notification, create_notification(), delete_notification(), get_all_notifications(), get_notification_by_id(), get_notifications_by_user() (+18 more)

### Community 2 - "ScanSummaryController"
Cohesion: 0.12
Nodes (18): ScanSummaryController, create_scan_summary(), delete_scan_summary(), generate_scan_summary(), get_all_scan_summaries(), get_my_dashboard_stats(), get_my_scan_history(), get_scan_summary_by_id() (+10 more)

### Community 3 - "RecentScansTable.jsx"
Cohesion: 0.17
Nodes (14): Badge(), sizes, tones, getScanSessionsByFarm(), formatDate(), formatScanType(), RecentScansTable(), CONFIG (+6 more)

### Community 4 - "AiScan.jsx"
Cohesion: 0.16
Nodes (15): SEVERITY_RANK, summarize(), useQuickScan(), predictDisease(), countChickens(), createScanSession(), useAiPrediction(), useDetection() (+7 more)

### Community 5 - "database.py"
Cohesion: 0.15
Nodes (13): JournalEntryController, JournalEntry, create_journal_entry(), delete_journal_entry(), get_journal_entries_by_farm(), get_journal_entry_by_id(), get_my_journal_entries(), update_journal_entry() (+5 more)

### Community 6 - "FarmController"
Cohesion: 0.22
Nodes (9): FarmController, create_farm(), get_all_farms(), get_farm_by_id(), get_my_farms(), update_farm(), CreateFarmSchema, FarmResponseSchema (+1 more)

### Community 7 - "os"
Cohesion: 0.11
Nodes (7): save_farm_image(), compress_image(), convert_to_jpeg(), preprocess_image(), save_compressed_image(), should_tile(), split_into_tiles()

### Community 8 - "sqlalchemy"
Cohesion: 0.08
Nodes (7): upgrade(), upgrade(), upgrade(), upgrade(), upgrade(), upgrade(), upgrade()

### Community 9 - "AuthController"
Cohesion: 0.16
Nodes (17): AuthController, forgot_password(), get_current_user(), google_login(), login(), logout(), register(), reset_password() (+9 more)

### Community 10 - "frontend/package.json"
Cohesion: 0.07
Nodes (35): dependencies, lucide-react@^1.23.0, react@^19.2.7, react-dom@^19.2.7, react-icons@^5.7.0, @react-oauth/google@^0.13.5, react-router-dom@^7.18.1, tailwindcss@^4.3.2 (+27 more)

### Community 11 - "Surface"
Cohesion: 0.12
Nodes (21): EmptyState(), paddings, radii, Surface(), tones, NoActiveFarmNotice(), AlertFeed(), timeAgo() (+13 more)

### Community 12 - "ScanDetailModal.jsx"
Cohesion: 0.24
Nodes (8): MeasurementEditor(), FarmInfoCard(), getPredictionsBySession(), ChickenPredictionCard(), DetailStat(), TONES, ScanDetailModal(), thumbnailSrc()

### Community 13 - "test_abstract_email_service.py"
Cohesion: 0.16
Nodes (19): AbstractEmailService, FakeResponse, test_check_disabled_in_development_without_api_call(), fake_get(), test_check_disabled_when_app_env_is_development(), fake_get(), test_check_skipped_when_api_key_missing_in_production(), fake_get() (+11 more)

### Community 14 - "activity_log_route.py"
Cohesion: 0.26
Nodes (6): ActivityLogController, create_activity_log(), delete_activity_log(), get_activity_log_by_id(), get_activity_logs_by_user(), get_all_activity_logs()

### Community 15 - "chicken_image_route.py"
Cohesion: 0.17
Nodes (9): ChickenImageController, create_chicken_image(), delete_chicken_image(), get_all_chicken_images(), get_chicken_image_by_id(), get_images_by_detected_chicken(), ChickenImageResponseSchema, CreateChickenImageSchema (+1 more)

### Community 16 - "home/components/Footer.jsx"
Cohesion: 0.24
Nodes (14): AppLayout(), ContactSupportContent(), FeedbackModal(), Footer(), navigateLinks, InfoModal(), PrivacyPolicyContent(), TermsOfServiceContent() (+6 more)

### Community 17 - "routes.jsx"
Cohesion: 0.15
Nodes (26): LoadingScreen(), HomeRedirect(), ProtectedRoute(), checkServerHealth(), forgotPassword(), resetPassword(), verifyResetCode(), AuthAlert() (+18 more)

### Community 18 - "react-icons"
Cohesion: 0.11
Nodes (9): sizes, SettingsMenu(), SEVERITY_STYLES, ChickenCard(), VIEWS, links, react, react-dom (+1 more)

### Community 19 - "project.yml"
Cohesion: 0.08
Nodes (25): activation_command, activation_command_timeout, added_modes, agent_interface, default_modes, encoding, excluded_apis, excluded_tools (+17 more)

### Community 20 - "apiRequest"
Cohesion: 0.19
Nodes (14): apiRequest(), BASE_URL, formatErrorDetail(), FeedbackAPI, getDashboardStats(), useDashboardStats(), createScanSession(), deleteScanSession() (+6 more)

### Community 21 - "Button"
Cohesion: 0.20
Nodes (15): Button(), ModalShell(), Notice(), TextField(), AppModal(), sizeMap, variantConfig, CameraCaptureModal() (+7 more)

### Community 22 - "sqlalchemy_orm"
Cohesion: 0.14
Nodes (9): AIPredictionController, count_chickens(), BatchPredictionResponseSchema, ChickenPredictionSchema, ImageTypeSchema, MeasurementResponseSchema, MeasurementSchema, test_capacity_rejects_parallel_request_and_releases_after_failure() (+1 more)

### Community 24 - "AIPredictionService"
Cohesion: 0.12
Nodes (7): get_measurements(), get_predictions_by_session(), predict_disease(), save_measurements(), AIPredictionService, test_illness_is_only_flagged_at_80_percent_confidence(), test_provider_failure_is_distinct_from_photo_retake()

### Community 25 - "gemini_client.py"
Cohesion: 0.13
Nodes (12): test_no_fabricated_weight_or_oil_when_provider_cannot_estimate(), test_scan_estimates_keep_image_mapping_and_calculate_oil(), _build_prompt(), _compute_oil_ml(), _detect_mime_type(), GeminiInsightsError, get_disease_insights(), get_disease_insights_batch() (+4 more)

### Community 26 - "gemini_image_counter.py"
Cohesion: 0.15
Nodes (8): _build_model_chain(), _convert_box_2d_to_pixel_box(), count_chickens_with_gemini(), _detect_mime_type(), GeminiCountingError, _get_image_dimensions(), _sanitize_confidence(), _sanitize_detections()

### Community 28 - "AuthContext.jsx"
Cohesion: 0.21
Nodes (9): App(), ActiveFarmProvider(), AuthContext, AuthProvider(), getCurrentUser(), googleLogin(), loginUser(), logoutUser() (+1 more)

### Community 29 - "avatarIcons.jsx"
Cohesion: 0.22
Nodes (8): MiniAvatar(), Avatar(), AVATAR_ICON_KEYS, AVATAR_ICONS, getIconKey(), isIconAvatar(), resolveAvatarSrc(), getInitials()

### Community 30 - "gemini_disease_classifier.py"
Cohesion: 0.10
Nodes (18): test_out_of_order_response_stays_attached_to_correct_image(), test_partial_or_malformed_batch_is_rejected(), _apply_healthy_confidence_floor(), _cannot_assess_result(), classify_disease_with_gemini(), classify_diseases_batch_with_gemini(), _hash_image(), _load_cache() (+10 more)

### Community 31 - "Dashboard.jsx"
Cohesion: 0.11
Nodes (5): AccuracyNotice(), ScanningView(), Dashboard(), getFirstName(), getGreeting()

### Community 32 - "UserController"
Cohesion: 0.19
Nodes (7): UserController, delete_user(), get_all_users(), get_user(), update_user(), upload_avatar(), UpdateUserSchema

### Community 33 - "psgcApi.js"
Cohesion: 0.27
Nodes (14): cache, fetchBarangays(), fetchProvinceCitiesMunicipalities(), fetchProvinces(), fetchPsgc(), fetchRegionCitiesMunicipalities(), fetchRegions(), inFlight (+6 more)

### Community 34 - "EmailService"
Cohesion: 0.10
Nodes (7): RoboflowAPIError, RoboflowTimeoutError, run_chicken_detection(), FeedbackController, submit_feedback(), FeedbackSchema, EmailService

### Community 35 - "test_quota_retry_replaces_previous_rows"
Cohesion: 0.14
Nodes (14): photo(), test_crop_cap_preserves_aspect_ratio(), test_invalid_box_never_substitutes_whole_flock(), test_multi_angle_persistence_history_and_duplicate_submission(), test_quota_retry_replaces_previous_rows(), fail_gemini(), fail_router(), test_source_storage_preserves_detection_coordinates() (+6 more)

### Community 38 - "env.py"
Cohesion: 0.13
Nodes (14): Base, run_migrations_offline(), run_migrations_online(), downgrade(), upgrade(), downgrade(), upgrade(), upgrade() (+6 more)

### Community 41 - "farmApi.js"
Cohesion: 0.27
Nodes (14): PageHeader(), buildFarmFormData(), createFarm(), deleteFarm(), getFarmById(), getMyFarms(), updateFarm(), FarmCard() (+6 more)

### Community 42 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 43 - "ai_prediction_service.py"
Cohesion: 0.18
Nodes (14): DetectedChicken, Farm, ScanSession, ScanStatus, ScanType, test_market_targets_for_broiler_and_native(), test_summary_does_not_count_low_confidence_findings_as_disease(), test_user_correction_replaces_display_and_totals_but_keeps_ai_estimate() (+6 more)

### Community 44 - "json"
Cohesion: 0.26
Nodes (5): get_disease_recommendation(), _hygiene_only(), _load_cache(), RecommendationError, _save_cache()

### Community 46 - "app/index.js"
Cohesion: 0.17
Nodes (4): buttonStyles(), sizes, variants, tones

### Community 51 - "ActivityLogService"
Cohesion: 0.29
Nodes (4): ActivityLog, ActivityLogResponseSchema, CreateActivityLogSchema, ActivityLogService

### Community 53 - "main.py"
Cohesion: 0.15
Nodes (6): _build_alembic_config(), ensure_migrated(), health_check(), lifespan(), unhandled_exception_handler(), Config

### Community 57 - "src/components/index.js"
Cohesion: 0.20
Nodes (5): NotificationAPI, NotificationsMenu(), timeAgo(), PoultryScanLoader(), useNotifications()

### Community 58 - "ScanCard.jsx"
Cohesion: 0.29
Nodes (7): ConfirmDeleteModal(), HealthBreakdown(), MarketReadyBar(), ScanCard(), ScanRow(), StatusBadge(), formatDateTime()

### Community 59 - "user_service.py"
Cohesion: 0.18
Nodes (5): get_current_user_id(), create_access_token(), decode_token(), hash_password(), verify_password()

### Community 60 - "RegisterUserSchema"
Cohesion: 0.22
Nodes (6): RegisterUserSchema, FakeDB, test_register_allows_valid_email(), test_register_rejects_risky_email(), blocked(), test_update_email_change_checks_new_email()

### Community 62 - "Profile.jsx"
Cohesion: 0.35
Nodes (4): ProfileMenu(), ProfileAPI, InfoRow(), useProfile()

### Community 63 - "database.py"
Cohesion: 0.24
Nodes (4): _detect_ssl_mode(), _ensure_database_exists(), get_db(), _resolve_ssl_ca_path()

### Community 65 - "BottomNav.jsx"
Cohesion: 0.36
Nodes (6): BottomNav(), QuickScanModal(), navLinks, navLinksRight, ActiveFarmContext, useActiveFarm()

### Community 66 - "pydantic"
Cohesion: 0.38
Nodes (3): BoundingBox, ChickenDetection, DetectionResponse

### Community 68 - "FarmLocationSelect"
Cohesion: 0.33
Nodes (4): emptyPlaceholder(), FarmLocationSelect(), handleSearchKey(), handleSelect()

## Knowledge Gaps
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-icons` connect `react-icons` to `useAuth`, `BottomNav.jsx`, `RecentScansTable.jsx`, `AiScan.jsx`, `ResultsView.jsx`, `farmApi.js`, `frontend/package.json`, `Surface`, `ScanDetailModal.jsx`, `app/index.js`, `home/components/Footer.jsx`, `routes.jsx`, `Button`, `src/components/index.js`, `ScanCard.jsx`, `avatarIcons.jsx`, `Profile.jsx`, `Dashboard.jsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.12162162162162163 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react-icons` to `useAuth`, `RecentScansTable.jsx`, `AiScan.jsx`, `frontend/package.json`, `Surface`, `ScanDetailModal.jsx`, `home/components/Footer.jsx`, `routes.jsx`, `apiRequest`, `Button`, `AuthContext.jsx`, `avatarIcons.jsx`, `Dashboard.jsx`, `psgcApi.js`, `ResultsView.jsx`, `farmApi.js`, `app/index.js`, `src/components/index.js`, `ScanCard.jsx`, `Profile.jsx`, `BottomNav.jsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `ScanSessionController` be split into smaller, more focused modules?**
  _Cohesion score 0.07172995780590717 - nodes in this community are weakly interconnected._
- **Why does `AIPredictionService` connect `AIPredictionService` to `test_quota_retry_replaces_previous_rows`, `ai_prediction_service.py`, `sqlalchemy_orm`, `gemini_client.py`, `ScanSummaryService`, `gemini_disease_classifier.py`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `ScanSummaryController` be split into smaller, more focused modules?**
  _Cohesion score 0.11517165005537099 - nodes in this community are weakly interconnected._
- **Should `database.py` be split into smaller, more focused modules?**
  _Cohesion score 0.14509246088193456 - nodes in this community are weakly interconnected._