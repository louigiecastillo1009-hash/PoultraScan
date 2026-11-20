# Graph Report - Poultry Scanner  (2026-11-20)

## Corpus Check
- 269 files · ~73,690 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 1371 nodes · 3951 edges · 68 communities (46 shown, 22 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 210 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6068e66c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuth
- ScanSessionController
- ScanSummaryController
- app/index.js
- AiScan.jsx
- CreateNotificationSchema
- FarmController
- io
- sqlalchemy
- AuthController
- frontend/package.json
- Surface
- JournalEntryController
- test_abstract_email_service.py
- activity_log_route.py
- chicken_image_route.py
- Farm.jsx
- routes.jsx
- react
- project.yml
- apiRequest
- react
- ai_prediction_route.py
- AIPredictionService
- gemini_client.py
- gemini_image_counter.py
- BottomNav.jsx
- avatarIcons.jsx
- gemini_disease_classifier.py
- ResultsView.jsx
- test_quota_retry_replaces_previous_rows
- psgcApi.js
- EmailService
- test_scan_integrity.py
- FastAPI
- env.py
- ScanHistory.jsx
- ChickenWeightEstimator
- farmApi.js
- .oxlintrc.json
- roboflow_client.py
- json
- vercel.json
- CreateNotificationSchema
- useNotification.js
- count_chickens
- main.py
- run_migrations_offline
- PoultryScanLoader
- ScanDetailModal.jsx
- run_migrations_online
- home/components/Footer.jsx
- auth_middleware.py

## God Nodes (most connected - your core abstractions)
1. `react-icons` - 73 edges
2. `react` - 61 edges
3. `apiRequest()` - 44 edges
4. `AIPredictionService` - 39 edges
5. `Button()` - 36 edges
6. `react-router-dom` - 34 edges
7. `Base` - 29 edges
8. `UserService` - 28 edges
9. `User` - 24 edges
10. `ScanSession` - 24 edges

## Surprising Connections (you probably didn't know these)
- `_send_welcome_email_task()` --uses--> `UserService`  [INFERRED]
  backend/controllers/auth_controller.py → backend/services/user_service.py
- `_welcome_email_task_for()` --uses--> `UserService`  [INFERRED]
  backend/controllers/auth_controller.py → backend/services/user_service.py
- `AuthController` --uses--> `EmailService`  [INFERRED]
  backend/controllers/auth_controller.py → backend/services/email_service.py
- `AuthController` --uses--> `UserService`  [INFERRED]
  backend/controllers/auth_controller.py → backend/services/user_service.py
- `FeedbackController` --uses--> `EmailService`  [INFERRED]
  backend/controllers/feedback_controller.py → backend/services/email_service.py

## Import Cycles
- 2-file cycle: `frontend/src/pages/home/components/HowItWorks.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HowItWorks.jsx`
- 2-file cycle: `frontend/src/pages/home/components/Hero.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/Hero.jsx`
- 2-file cycle: `frontend/src/pages/home/components/FeatureGrid.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/FeatureGrid.jsx`
- 2-file cycle: `frontend/src/pages/home/components/CtaBanner.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/CtaBanner.jsx`
- 2-file cycle: `frontend/src/pages/home/components/HeroVisual.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HeroVisual.jsx`
- 2-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/Footer.jsx`
- 2-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ChickenCard.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/FarmRequiredModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/NoActiveFarmNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/AccuracyNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/CameraCaptureModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ScanningView.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/TotalsFooter.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 4-file cycle: `frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx`
- 4-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 5-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 5-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 5-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`

## Communities (68 total, 22 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.08
Nodes (27): useAuth(), getDashboardStats(), useDashboardStats(), Dashboard(), getFirstName(), getGreeting(), CtaBanner(), FeatureCard() (+19 more)

### Community 1 - "ScanSessionController"
Cohesion: 0.12
Nodes (14): ScanSessionController, ScanStatus, create_scan_session(), delete_scan_session(), get_all_scan_sessions(), get_scan_session_by_id(), get_scan_sessions_by_farm(), update_scan_session_status() (+6 more)

### Community 2 - "ScanSummaryController"
Cohesion: 0.10
Nodes (19): ScanSummaryController, create_scan_summary(), delete_scan_summary(), generate_scan_summary(), get_all_scan_summaries(), get_my_dashboard_stats(), get_my_scan_history(), get_scan_summary_by_id() (+11 more)

### Community 3 - "app/index.js"
Cohesion: 0.13
Nodes (12): Button(), buttonStyles(), sizes, variants, ModalShell(), AppModal(), sizeMap, variantConfig (+4 more)

### Community 4 - "AiScan.jsx"
Cohesion: 0.15
Nodes (16): SEVERITY_RANK, summarize(), useQuickScan(), predictDisease(), countChickens(), createScanSession(), presentChicken(), useAiPrediction() (+8 more)

### Community 5 - "CreateNotificationSchema"
Cohesion: 0.18
Nodes (10): NotificationController, Notification, delete_notification(), get_all_notifications(), get_notification_by_id(), get_notifications_by_user(), mark_notification_as_read(), NotificationResponseSchema (+2 more)

### Community 6 - "FarmController"
Cohesion: 0.10
Nodes (14): FarmController, downgrade(), upgrade(), create_farm(), delete_farm(), get_all_farms(), get_farm_by_id(), get_my_farms() (+6 more)

### Community 7 - "io"
Cohesion: 0.12
Nodes (6): save_farm_image(), compress_image(), convert_to_jpeg(), preprocess_image(), should_tile(), split_into_tiles()

### Community 8 - "sqlalchemy"
Cohesion: 0.07
Nodes (13): upgrade(), downgrade(), upgrade(), downgrade(), upgrade(), upgrade(), upgrade(), upgrade() (+5 more)

### Community 9 - "AuthController"
Cohesion: 0.18
Nodes (17): AuthController, forgot_password(), get_current_user(), google_login(), login(), logout(), register(), reset_password() (+9 more)

### Community 10 - "frontend/package.json"
Cohesion: 0.07
Nodes (35): dependencies, lucide-react@^1.23.0, react@^19.2.7, react-dom@^19.2.7, react-icons@^5.7.0, @react-oauth/google@^0.13.5, react-router-dom@^7.18.1, tailwindcss@^4.3.2 (+27 more)

### Community 11 - "Surface"
Cohesion: 0.11
Nodes (27): Badge(), sizes, tones, EmptyState(), paddings, radii, Surface(), tones (+19 more)

### Community 12 - "JournalEntryController"
Cohesion: 0.15
Nodes (13): JournalEntryController, JournalEntry, create_journal_entry(), delete_journal_entry(), get_journal_entries_by_farm(), get_journal_entry_by_id(), get_my_journal_entries(), update_journal_entry() (+5 more)

### Community 13 - "test_abstract_email_service.py"
Cohesion: 0.06
Nodes (35): UserController, User, delete_user(), get_all_users(), get_user(), update_user(), upload_avatar(), UpdateUserSchema (+27 more)

### Community 14 - "activity_log_route.py"
Cohesion: 0.11
Nodes (14): ActivityLogController, _detect_ssl_mode(), _ensure_database_exists(), get_db(), _resolve_ssl_ca_path(), ActivityLog, create_activity_log(), delete_activity_log() (+6 more)

### Community 15 - "chicken_image_route.py"
Cohesion: 0.15
Nodes (10): ChickenImageController, create_chicken_image(), delete_chicken_image(), get_all_chicken_images(), get_chicken_image_by_id(), get_images_by_detected_chicken(), ChickenImageResponseSchema, CreateChickenImageSchema (+2 more)

### Community 16 - "Farm.jsx"
Cohesion: 0.13
Nodes (15): sizes, PageHeader(), DeleteFarmModal(), EditFarmModal(), emptyPlaceholder(), FarmLocationSelect(), handleSearchKey(), handleSelect() (+7 more)

### Community 17 - "routes.jsx"
Cohesion: 0.16
Nodes (25): LoadingScreen(), HomeRedirect(), ProtectedRoute(), checkServerHealth(), forgotPassword(), resetPassword(), verifyResetCode(), AuthAlert() (+17 more)

### Community 18 - "react"
Cohesion: 0.13
Nodes (5): SEVERITY_STYLES, AccuracyNotice(), ChickenCard(), ScanningView(), VIEWS

### Community 19 - "project.yml"
Cohesion: 0.08
Nodes (25): activation_command, activation_command_timeout, added_modes, agent_interface, default_modes, encoding, excluded_apis, excluded_tools (+17 more)

### Community 20 - "apiRequest"
Cohesion: 0.18
Nodes (17): apiRequest(), BASE_URL, formatErrorDetail(), FeedbackAPI, AuthContext, AuthProvider(), getCurrentUser(), googleLogin() (+9 more)

### Community 21 - "react"
Cohesion: 0.19
Nodes (10): Notice(), tones, TextField(), SettingsMenu(), ProfileAPI, AvatarModal(), InfoRow(), useProfile() (+2 more)

### Community 22 - "ai_prediction_route.py"
Cohesion: 0.17
Nodes (9): AIPredictionController, predict_disease(), BatchPredictionResponseSchema, ChickenPredictionSchema, ImageTypeSchema, MeasurementResponseSchema, MeasurementSchema, test_invalid_measurement_rejected() (+1 more)

### Community 24 - "AIPredictionService"
Cohesion: 0.12
Nodes (8): get_measurements(), get_predictions_by_session(), save_measurements(), AIPredictionService, test_illness_is_only_flagged_at_80_percent_confidence(), test_market_target_is_generic(), test_provider_failure_is_distinct_from_photo_retake(), assess_market_readiness()

### Community 25 - "gemini_client.py"
Cohesion: 0.14
Nodes (13): test_no_fabricated_weight_or_oil_when_provider_cannot_estimate(), test_scan_estimates_keep_image_mapping_and_calculate_oil(), _build_prompt(), _compute_oil_ml(), _detect_mime_type(), get_disease_insights(), get_disease_insights_batch(), _sanitize_weight() (+5 more)

### Community 26 - "gemini_image_counter.py"
Cohesion: 0.13
Nodes (10): _build_model_chain(), _convert_box_2d_to_pixel_box(), count_chickens_with_gemini(), _detect_mime_type(), GeminiCountingError, _get_image_dimensions(), _sanitize_confidence(), _sanitize_detections() (+2 more)

### Community 28 - "BottomNav.jsx"
Cohesion: 0.13
Nodes (13): App(), AppLayout(), BottomNav(), ProfileMenu(), QuickScanModal(), getActiveFromPath(), navLinks, TopNav() (+5 more)

### Community 29 - "avatarIcons.jsx"
Cohesion: 0.22
Nodes (8): MiniAvatar(), Avatar(), AVATAR_ICON_KEYS, AVATAR_ICONS, getIconKey(), isIconAvatar(), resolveAvatarSrc(), getInitials()

### Community 30 - "gemini_disease_classifier.py"
Cohesion: 0.12
Nodes (14): test_named_disease_requires_confirmed_visible_signs(), _apply_healthy_confidence_floor(), _cannot_assess_result(), classify_disease_with_gemini(), classify_diseases_batch_with_gemini(), _confirmed_visible_signs(), _hash_image(), _load_cache() (+6 more)

### Community 32 - "test_quota_retry_replaces_previous_rows"
Cohesion: 0.22
Nodes (9): test_quota_retry_replaces_previous_rows(), fail_gemini(), fail_router(), test_unavailable_classification_is_unknown_not_healthy(), fail_gemini(), fail_router(), GeminiInsightsError, DiseaseClassificationError (+1 more)

### Community 33 - "psgcApi.js"
Cohesion: 0.27
Nodes (14): cache, fetchBarangays(), fetchProvinceCitiesMunicipalities(), fetchProvinces(), fetchPsgc(), fetchRegionCitiesMunicipalities(), fetchRegions(), inFlight (+6 more)

### Community 34 - "EmailService"
Cohesion: 0.16
Nodes (3): _send_welcome_email_task(), _welcome_email_task_for(), EmailService

### Community 35 - "test_scan_integrity.py"
Cohesion: 0.12
Nodes (11): photo(), test_capacity_rejects_parallel_request_and_releases_after_failure(), test_crop_cap_preserves_aspect_ratio(), test_invalid_box_never_substitutes_whole_flock(), test_multi_angle_persistence_history_and_duplicate_submission(), test_out_of_order_response_stays_attached_to_correct_image(), test_partial_or_malformed_batch_is_rejected(), test_source_storage_preserves_detection_coordinates() (+3 more)

### Community 36 - "FastAPI"
Cohesion: 0.26
Nodes (4): FeedbackController, submit_feedback(), FeedbackSchema, get_google_user_info()

### Community 38 - "env.py"
Cohesion: 0.19
Nodes (15): Base, AIPrediction, ChickenImage, ImageType, DetectedChicken, Farm, ScanPhoto, ScanSession (+7 more)

### Community 39 - "ScanHistory.jsx"
Cohesion: 0.20
Nodes (4): deleteScanSummary(), getScanHistory(), getScanSummaryBySession(), useScanHistory()

### Community 41 - "farmApi.js"
Cohesion: 0.33
Nodes (9): buildFarmFormData(), createFarm(), deleteFarm(), getFarmById(), getMyFarms(), updateFarm(), useSaveFarm(), useFarm() (+1 more)

### Community 42 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 43 - "roboflow_client.py"
Cohesion: 0.24
Nodes (3): RoboflowAPIError, RoboflowTimeoutError, run_chicken_detection()

### Community 44 - "json"
Cohesion: 0.23
Nodes (5): get_disease_recommendation(), _hygiene_only(), _load_cache(), RecommendationError, _save_cache()

### Community 52 - "count_chickens"
Cohesion: 0.15
Nodes (5): DetectionController, count_chickens(), BoundingBox, ChickenDetection, DetectionResponse

### Community 53 - "main.py"
Cohesion: 0.15
Nodes (6): _build_alembic_config(), ensure_migrated(), health_check(), lifespan(), unhandled_exception_handler(), Config

### Community 57 - "PoultryScanLoader"
Cohesion: 0.36
Nodes (4): NotificationsMenu(), timeAgo(), PoultryScanLoader(), useNotifications()

### Community 58 - "ScanDetailModal.jsx"
Cohesion: 0.12
Nodes (19): MeasurementEditor(), FarmCard(), FarmInfoCard(), ChickenPredictionCard(), DetailStat(), TONES, HealthBreakdown(), ManualScanLog() (+11 more)

### Community 65 - "home/components/Footer.jsx"
Cohesion: 0.29
Nodes (12): ContactSupportContent(), FeedbackModal(), Footer(), navigateLinks, InfoModal(), PrivacyPolicyContent(), TermsOfServiceContent(), Register() (+4 more)

### Community 66 - "auth_middleware.py"
Cohesion: 0.32
Nodes (3): get_current_user_id(), create_access_token(), decode_token()

## Knowledge Gaps
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-icons` connect `routes.jsx` to `useAuth`, `home/components/Footer.jsx`, `app/index.js`, `AiScan.jsx`, `ScanHistory.jsx`, `frontend/package.json`, `Surface`, `Farm.jsx`, `react`, `react`, `PoultryScanLoader`, `ScanDetailModal.jsx`, `BottomNav.jsx`, `avatarIcons.jsx`, `ResultsView.jsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `useAuth`, `home/components/Footer.jsx`, `psgcApi.js`, `app/index.js`, `AiScan.jsx`, `ScanHistory.jsx`, `farmApi.js`, `frontend/package.json`, `Surface`, `Farm.jsx`, `routes.jsx`, `react`, `useNotification.js`, `apiRequest`, `PoultryScanLoader`, `ScanDetailModal.jsx`, `BottomNav.jsx`, `ResultsView.jsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `ScanSessionController` be split into smaller, more focused modules?**
  _Cohesion score 0.12427409988385599 - nodes in this community are weakly interconnected._
- **Why does `User` connect `test_abstract_email_service.py` to `gemini_client.py`, `CreateNotificationSchema`, `test_scan_integrity.py`, `env.py`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `ScanSummaryController` be split into smaller, more focused modules?**
  _Cohesion score 0.09796806966618288 - nodes in this community are weakly interconnected._
- **Should `app/index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12962962962962962 - nodes in this community are weakly interconnected._