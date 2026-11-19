# Graph Report - Poultry Scanner  (2026-11-19)

## Corpus Check
- 268 files · ~72,856 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 1354 nodes · 3927 edges · 65 communities (47 shown, 18 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 216 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d4b8796e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuth
- ScanSessionController
- ScanSummaryController
- RecentScansTable.jsx
- AiScan.jsx
- CreateNotificationSchema
- FarmController
- io
- sqlalchemy
- AuthController
- frontend/package.json
- Surface
- ScanDetailModal.jsx
- test_abstract_email_service.py
- activity_log_route.py
- chicken_image_route.py
- test_scan_integrity.py
- routes.jsx
- react
- project.yml
- apiRequest
- compress_image
- sqlalchemy_orm
- AIPredictionService
- gemini_client.py
- gemini_image_counter.py
- main.jsx
- avatarIcons.jsx
- openrouter_vision.py
- Dashboard.jsx
- UserController
- psgcApi.js
- EmailService
- test_quota_retry_replaces_previous_rows
- scan_session_service.py
- NotificationService
- env.py
- run_migrations_offline
- ChickenWeightEstimator
- farmApi.js
- .oxlintrc.json
- assess_market_readiness
- json
- run_migrations_online
- vercel.json
- UserService
- detection_controller.py
- main.py
- src/components/index.js
- ScanCard.jsx
- user_service.py
- FakeDB
- database.py
- BottomNav.jsx
- FastAPI
- FarmLocationSelect

## God Nodes (most connected - your core abstractions)
1. `react-icons` - 73 edges
2. `react` - 61 edges
3. `apiRequest()` - 44 edges
4. `AIPredictionService` - 39 edges
5. `Button()` - 36 edges
6. `react-router-dom` - 34 edges
7. `Base` - 29 edges
8. `AuthController` - 28 edges
9. `UserService` - 27 edges
10. `ScanSession` - 24 edges

## Surprising Connections (you probably didn't know these)
- `test_multi_angle_persistence_history_and_duplicate_submission()` --uses--> `ScanType`  [INFERRED]
  backend/tests/test_scan_integrity.py → backend/models/scan_session.py
- `test_quota_retry_replaces_previous_rows()` --uses--> `ScanType`  [INFERRED]
  backend/tests/test_scan_integrity.py → backend/models/scan_session.py
- `AIPredictionService` --uses--> `ScanStatus`  [INFERRED]
  backend/services/ai_prediction_service.py → backend/models/scan_session.py
- `ScanSessionService` --uses--> `ScanStatus`  [INFERRED]
  backend/services/scan_session_service.py → backend/models/scan_session.py
- `AIPredictionService` --uses--> `ScanSession`  [INFERRED]
  backend/services/ai_prediction_service.py → backend/models/scan_session.py

## Import Cycles
- 2-file cycle: `frontend/src/pages/home/components/HowItWorks.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HowItWorks.jsx`
- 2-file cycle: `frontend/src/pages/home/components/Hero.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/Hero.jsx`
- 2-file cycle: `frontend/src/pages/home/components/FeatureGrid.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/FeatureGrid.jsx`
- 2-file cycle: `frontend/src/pages/home/components/CtaBanner.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/CtaBanner.jsx`
- 2-file cycle: `frontend/src/pages/home/components/HeroVisual.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HeroVisual.jsx`
- 2-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/Footer.jsx`
- 2-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/TotalsFooter.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/NoActiveFarmNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/CameraCaptureModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ChickenCard.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/AccuracyNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/FarmRequiredModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ScanningView.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 4-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx`
- 5-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 5-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 5-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`

## Communities (65 total, 18 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.12
Nodes (23): useAuth(), CtaBanner(), FeatureCard(), FeatureGrid(), features, checks, Hero(), HeroVisual() (+15 more)

### Community 1 - "ScanSessionController"
Cohesion: 0.17
Nodes (10): ScanSessionController, create_scan_session(), delete_scan_session(), get_all_scan_sessions(), get_scan_session_by_id(), get_scan_sessions_by_farm(), update_scan_session_status(), CreateScanSessionSchema (+2 more)

### Community 2 - "ScanSummaryController"
Cohesion: 0.06
Nodes (32): JournalEntryController, ScanSummaryController, JournalEntry, create_journal_entry(), delete_journal_entry(), get_journal_entries_by_farm(), get_journal_entry_by_id(), get_my_journal_entries() (+24 more)

### Community 3 - "RecentScansTable.jsx"
Cohesion: 0.13
Nodes (17): Badge(), sizes, tones, createScanSession(), deleteScanSession(), getScanSessionById(), getScanSessionsByFarm(), formatDate() (+9 more)

### Community 4 - "AiScan.jsx"
Cohesion: 0.16
Nodes (16): useActiveFarm(), SEVERITY_RANK, summarize(), useQuickScan(), predictDisease(), countChickens(), createScanSession(), useAiPrediction() (+8 more)

### Community 5 - "CreateNotificationSchema"
Cohesion: 0.20
Nodes (10): NotificationController, create_notification(), delete_notification(), get_all_notifications(), get_notification_by_id(), get_notifications_by_user(), mark_notification_as_read(), CreateNotificationSchema (+2 more)

### Community 6 - "FarmController"
Cohesion: 0.12
Nodes (12): FarmController, create_farm(), delete_farm(), get_all_farms(), get_farm_by_id(), get_my_farms(), update_farm(), CreateFarmSchema (+4 more)

### Community 7 - "io"
Cohesion: 0.18
Nodes (3): preprocess_image(), should_tile(), split_into_tiles()

### Community 8 - "sqlalchemy"
Cohesion: 0.07
Nodes (14): upgrade(), downgrade(), upgrade(), downgrade(), upgrade(), upgrade(), upgrade(), upgrade() (+6 more)

### Community 9 - "AuthController"
Cohesion: 0.16
Nodes (18): AuthController, forgot_password(), get_current_user(), google_login(), login(), logout(), register(), reset_password() (+10 more)

### Community 10 - "frontend/package.json"
Cohesion: 0.07
Nodes (35): dependencies, lucide-react@^1.23.0, react@^19.2.7, react-dom@^19.2.7, react-icons@^5.7.0, @react-oauth/google@^0.13.5, react-router-dom@^7.18.1, tailwindcss@^4.3.2 (+27 more)

### Community 11 - "Surface"
Cohesion: 0.12
Nodes (21): EmptyState(), paddings, radii, Surface(), tones, NoActiveFarmNotice(), AlertFeed(), timeAgo() (+13 more)

### Community 12 - "ScanDetailModal.jsx"
Cohesion: 0.25
Nodes (8): FarmCard(), FarmInfoCard(), getPredictionsBySession(), ChickenPredictionCard(), DetailStat(), TONES, ScanDetailModal(), thumbnailSrc()

### Community 13 - "test_abstract_email_service.py"
Cohesion: 0.16
Nodes (19): AbstractEmailService, FakeResponse, test_check_disabled_in_development_without_api_call(), fake_get(), test_check_disabled_when_app_env_is_development(), fake_get(), test_check_skipped_when_api_key_missing_in_production(), fake_get() (+11 more)

### Community 14 - "activity_log_route.py"
Cohesion: 0.16
Nodes (10): ActivityLogController, ActivityLog, create_activity_log(), delete_activity_log(), get_activity_log_by_id(), get_activity_logs_by_user(), get_all_activity_logs(), ActivityLogResponseSchema (+2 more)

### Community 15 - "chicken_image_route.py"
Cohesion: 0.15
Nodes (10): ChickenImageController, create_chicken_image(), delete_chicken_image(), get_all_chicken_images(), get_chicken_image_by_id(), get_images_by_detected_chicken(), ChickenImageResponseSchema, CreateChickenImageSchema (+2 more)

### Community 16 - "test_scan_integrity.py"
Cohesion: 0.23
Nodes (9): photo(), test_capacity_rejects_parallel_request_and_releases_after_failure(), test_crop_cap_preserves_aspect_ratio(), test_invalid_box_never_substitutes_whole_flock(), test_out_of_order_response_stays_attached_to_correct_image(), test_partial_or_malformed_batch_is_rejected(), test_source_storage_preserves_detection_coordinates(), crop_chicken_image() (+1 more)

### Community 17 - "routes.jsx"
Cohesion: 0.12
Nodes (32): ContactSupportContent(), FeedbackModal(), Footer(), navigateLinks, InfoModal(), LoadingScreen(), PrivacyPolicyContent(), TermsOfServiceContent() (+24 more)

### Community 18 - "react"
Cohesion: 0.06
Nodes (12): FeedbackAPI, tones, SettingsMenu(), SEVERITY_STYLES, AccuracyNotice(), ChickenCard(), MeasurementEditor(), presentChicken() (+4 more)

### Community 19 - "project.yml"
Cohesion: 0.08
Nodes (25): activation_command, activation_command_timeout, added_modes, agent_interface, default_modes, encoding, excluded_apis, excluded_tools (+17 more)

### Community 20 - "apiRequest"
Cohesion: 0.18
Nodes (19): apiRequest(), BASE_URL, formatErrorDetail(), AuthContext, AuthProvider(), checkServerHealth(), forgotPassword(), getCurrentUser() (+11 more)

### Community 21 - "compress_image"
Cohesion: 0.27
Nodes (3): save_farm_image(), compress_image(), save_compressed_image()

### Community 22 - "sqlalchemy_orm"
Cohesion: 0.16
Nodes (9): AIPredictionController, count_chickens(), BatchPredictionResponseSchema, ChickenPredictionSchema, ImageTypeSchema, MeasurementResponseSchema, MeasurementSchema, test_invalid_measurement_rejected() (+1 more)

### Community 24 - "AIPredictionService"
Cohesion: 0.09
Nodes (9): get_measurements(), get_predictions_by_session(), predict_disease(), save_measurements(), AIPredictionService, test_illness_is_only_flagged_at_80_percent_confidence(), test_provider_failure_is_distinct_from_photo_retake(), test_multi_angle_persistence_history_and_duplicate_submission() (+1 more)

### Community 25 - "gemini_client.py"
Cohesion: 0.14
Nodes (11): test_no_fabricated_weight_or_oil_when_provider_cannot_estimate(), test_scan_estimates_keep_image_mapping_and_calculate_oil(), _build_prompt(), _compute_oil_ml(), _detect_mime_type(), GeminiInsightsError, get_disease_insights(), get_disease_insights_batch() (+3 more)

### Community 26 - "gemini_image_counter.py"
Cohesion: 0.11
Nodes (13): classify_disease_with_gemini(), _hash_image(), _load_cache(), _save_cache(), _build_model_chain(), _convert_box_2d_to_pixel_box(), count_chickens_with_gemini(), _detect_mime_type() (+5 more)

### Community 28 - "main.jsx"
Cohesion: 0.18
Nodes (5): App(), sizes, ActiveFarmContext, ActiveFarmProvider(), react-dom

### Community 29 - "avatarIcons.jsx"
Cohesion: 0.14
Nodes (14): TextField(), MiniAvatar(), ProfileAPI, Avatar(), AvatarModal(), InfoRow(), useProfile(), Profile() (+6 more)

### Community 30 - "openrouter_vision.py"
Cohesion: 0.13
Nodes (14): test_named_disease_requires_confirmed_visible_signs(), _apply_healthy_confidence_floor(), _cannot_assess_result(), classify_diseases_batch_with_gemini(), _confirmed_visible_signs(), _parse_framing(), _sanitize_confidence(), _sanitize_disease_name() (+6 more)

### Community 31 - "Dashboard.jsx"
Cohesion: 0.12
Nodes (5): getDashboardStats(), useDashboardStats(), Dashboard(), getFirstName(), getGreeting()

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
Nodes (10): ScanPhoto, ScanStatus, DetectionService, test_quota_retry_replaces_previous_rows(), fail_gemini(), fail_router(), fail_gemini(), fail_router() (+2 more)

### Community 36 - "scan_session_service.py"
Cohesion: 0.25
Nodes (3): ScanSessionResponseSchema, ScanStatusSchema, ScanTypeSchema

### Community 38 - "env.py"
Cohesion: 0.21
Nodes (13): Base, AIPrediction, ChickenImage, ImageType, DetectedChicken, Farm, ScanSession, ScanType (+5 more)

### Community 41 - "farmApi.js"
Cohesion: 0.21
Nodes (18): Notice(), PageHeader(), buildFarmFormData(), createFarm(), deleteFarm(), getFarmById(), getMyFarms(), updateFarm() (+10 more)

### Community 42 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 44 - "json"
Cohesion: 0.29
Nodes (5): get_disease_recommendation(), _hygiene_only(), _load_cache(), RecommendationError, _save_cache()

### Community 50 - "UserService"
Cohesion: 0.21
Nodes (6): User, UserService, test_register_rejects_risky_email(), blocked(), test_update_email_change_checks_new_email(), hash_password()

### Community 53 - "main.py"
Cohesion: 0.15
Nodes (6): _build_alembic_config(), ensure_migrated(), health_check(), lifespan(), unhandled_exception_handler(), Config

### Community 57 - "src/components/index.js"
Cohesion: 0.18
Nodes (9): NotificationAPI, NotificationsMenu(), timeAgo(), ProfileMenu(), getActiveFromPath(), navLinks, TopNav(), PoultryScanLoader() (+1 more)

### Community 58 - "ScanCard.jsx"
Cohesion: 0.14
Nodes (17): Button(), buttonStyles(), sizes, variants, ModalShell(), AppModal(), sizeMap, variantConfig (+9 more)

### Community 63 - "database.py"
Cohesion: 0.24
Nodes (3): _detect_ssl_mode(), _ensure_database_exists(), _resolve_ssl_ca_path()

### Community 65 - "BottomNav.jsx"
Cohesion: 0.43
Nodes (5): AppLayout(), BottomNav(), QuickScanModal(), navLinks, navLinksRight

### Community 66 - "FastAPI"
Cohesion: 0.13
Nodes (6): get_db(), get_current_user_id(), BoundingBox, ChickenDetection, DetectionResponse, decode_token()

### Community 68 - "FarmLocationSelect"
Cohesion: 0.33
Nodes (4): emptyPlaceholder(), FarmLocationSelect(), handleSearchKey(), handleSelect()

## Knowledge Gaps
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-icons` connect `useAuth` to `BottomNav.jsx`, `RecentScansTable.jsx`, `AiScan.jsx`, `farmApi.js`, `frontend/package.json`, `Surface`, `ScanDetailModal.jsx`, `routes.jsx`, `react`, `src/components/index.js`, `ScanCard.jsx`, `main.jsx`, `avatarIcons.jsx`, `Dashboard.jsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.12051282051282051 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `useAuth`, `BottomNav.jsx`, `psgcApi.js`, `RecentScansTable.jsx`, `AiScan.jsx`, `farmApi.js`, `frontend/package.json`, `Surface`, `ScanDetailModal.jsx`, `routes.jsx`, `apiRequest`, `src/components/index.js`, `ScanCard.jsx`, `main.jsx`, `avatarIcons.jsx`, `Dashboard.jsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `ScanSummaryController` be split into smaller, more focused modules?**
  _Cohesion score 0.06358543417366946 - nodes in this community are weakly interconnected._
- **Why does `User` connect `UserService` to `env.py`, `test_abstract_email_service.py`, `test_scan_integrity.py`, `gemini_client.py`, `user_service.py`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `RecentScansTable.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13405797101449277 - nodes in this community are weakly interconnected._
- **Should `FarmController` be split into smaller, more focused modules?**
  _Cohesion score 0.12070874861572536 - nodes in this community are weakly interconnected._