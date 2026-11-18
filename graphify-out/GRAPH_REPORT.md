# Graph Report - Poultry Scanner  (2026-11-18)

## Corpus Check
- 258 files · ~68,897 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 1272 nodes · 3752 edges · 56 communities (43 shown, 13 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 209 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `161a1e14`
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
- gemini_disease_classifier.py
- Notice
- UserController
- json
- AIPredictionService
- gemini_client.py
- gemini_image_counter.py
- env.py
- FarmLocationSelect
- avatarIcons.jsx
- Button
- user_service.py
- psgcApi.js
- EmailService
- Register.jsx
- DetectionController
- AiScan.jsx
- test_scan_integrity.py
- ChickenWeightEstimator
- detection_route.py
- .oxlintrc.json
- roboflow_client.py
- test_quota_retry_replaces_previous_rows
- predict_disease
- ai_prediction_route.py
- vercel.json
- main.jsx
- database.py
- detection_schema.py
- b8d4e6c2f9a1_add_ai_prediction_insight_columns.py
- google_auth.py
- run_migrations_offline
- run_migrations_online

## God Nodes (most connected - your core abstractions)
1. `react-icons` - 73 edges
2. `react` - 59 edges
3. `Button()` - 46 edges
4. `apiRequest()` - 40 edges
5. `react-router-dom` - 34 edges
6. `Surface()` - 29 edges
7. `AuthController` - 28 edges
8. `UserService` - 27 edges
9. `Base` - 26 edges
10. `Notice()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `ScanSummaryService` --uses--> `ScanSession`  [INFERRED]
  backend/services/scan_summary_service.py → backend/models/scan_session.py
- `AuthController` --uses--> `CreateNotificationSchema`  [INFERRED]
  backend/controllers/auth_controller.py → backend/schemas/notification_schema.py
- `AuthController` --uses--> `NotificationService`  [INFERRED]
  backend/controllers/auth_controller.py → backend/services/notification_service.py
- `ScanSessionService` --uses--> `Farm`  [INFERRED]
  backend/services/scan_session_service.py → backend/models/farm.py
- `ScanSessionService` --uses--> `ScanStatus`  [INFERRED]
  backend/services/scan_session_service.py → backend/models/scan_session.py

## Import Cycles
- 2-file cycle: `frontend/src/pages/home/components/HowItWorks.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HowItWorks.jsx`
- 2-file cycle: `frontend/src/pages/home/components/Hero.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/Hero.jsx`
- 2-file cycle: `frontend/src/pages/home/components/FeatureGrid.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/FeatureGrid.jsx`
- 2-file cycle: `frontend/src/pages/home/components/CtaBanner.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/CtaBanner.jsx`
- 2-file cycle: `frontend/src/pages/home/components/HeroVisual.jsx -> frontend/src/pages/home/components/index.js -> frontend/src/pages/home/components/HeroVisual.jsx`
- 2-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/Footer.jsx`
- 2-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ScanningView.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/NoActiveFarmNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ChickenCard.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/AccuracyNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/CameraCaptureModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/FarmRequiredModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/TotalsFooter.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 4-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx`
- 5-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 5-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 5-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`

## Communities (56 total, 13 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.12
Nodes (22): useAuth(), CtaBanner(), FeatureCard(), FeatureGrid(), features, checks, Hero(), HeroVisual() (+14 more)

### Community 1 - "ScanSessionController"
Cohesion: 0.07
Nodes (26): NotificationController, ScanSessionController, Notification, ScanSession, create_notification(), delete_notification(), get_all_notifications(), get_notification_by_id() (+18 more)

### Community 2 - "ScanSummaryController"
Cohesion: 0.10
Nodes (20): ScanSummaryController, ScanSummary, create_scan_summary(), delete_scan_summary(), generate_scan_summary(), get_all_scan_summaries(), get_my_dashboard_stats(), get_my_scan_history() (+12 more)

### Community 3 - "src/components/index.js"
Cohesion: 0.18
Nodes (10): NotificationAPI, NotificationsMenu(), timeAgo(), PoultryScanLoader(), useNotifications(), formatDate(), formatScanType(), RecentScansTable() (+2 more)

### Community 4 - "apiRequest"
Cohesion: 0.12
Nodes (26): apiRequest(), BASE_URL, formatErrorDetail(), FeedbackAPI, AuthContext, AuthProvider(), checkServerHealth(), forgotPassword() (+18 more)

### Community 5 - "database.py"
Cohesion: 0.08
Nodes (21): FeedbackController, JournalEntryController, _build_alembic_config(), ensure_migrated(), health_check(), lifespan(), unhandled_exception_handler(), JournalEntry (+13 more)

### Community 6 - "FarmController"
Cohesion: 0.12
Nodes (13): FarmController, Farm, create_farm(), delete_farm(), get_all_farms(), get_farm_by_id(), get_my_farms(), update_farm() (+5 more)

### Community 7 - "os"
Cohesion: 0.10
Nodes (7): save_farm_image(), compress_image(), convert_to_jpeg(), preprocess_image(), save_compressed_image(), should_tile(), split_into_tiles()

### Community 8 - "sqlalchemy"
Cohesion: 0.09
Nodes (10): upgrade(), downgrade(), upgrade(), downgrade(), upgrade(), upgrade(), upgrade(), upgrade() (+2 more)

### Community 9 - "AuthController"
Cohesion: 0.18
Nodes (17): AuthController, forgot_password(), get_current_user(), google_login(), login(), logout(), register(), reset_password() (+9 more)

### Community 10 - "frontend/package.json"
Cohesion: 0.08
Nodes (33): dependencies, lucide-react@^1.23.0, react@^19.2.7, react-dom@^19.2.7, react-icons@^5.7.0, react-router-dom@^7.18.1, tailwindcss@^4.3.2, @tailwindcss/vite@^4.3.2 (+25 more)

### Community 11 - "Surface"
Cohesion: 0.10
Nodes (29): SectionHeading(), paddings, radii, Surface(), tones, ChickenCard(), ChickenList(), ChickenTable() (+21 more)

### Community 12 - "Button"
Cohesion: 0.13
Nodes (23): Badge(), sizes, tones, FarmCard(), FarmInfoCard(), getPredictionsBySession(), ChickenPredictionCard(), ConfirmDeleteModal() (+15 more)

### Community 13 - "test_abstract_email_service.py"
Cohesion: 0.16
Nodes (19): AbstractEmailService, FakeResponse, test_check_disabled_in_development_without_api_call(), fake_get(), test_check_disabled_when_app_env_is_development(), fake_get(), test_check_skipped_when_api_key_missing_in_production(), fake_get() (+11 more)

### Community 14 - "activity_log_route.py"
Cohesion: 0.16
Nodes (10): ActivityLogController, ActivityLog, create_activity_log(), delete_activity_log(), get_activity_log_by_id(), get_activity_logs_by_user(), get_all_activity_logs(), ActivityLogResponseSchema (+2 more)

### Community 15 - "chicken_image_route.py"
Cohesion: 0.15
Nodes (10): ChickenImageController, create_chicken_image(), delete_chicken_image(), get_all_chicken_images(), get_chicken_image_by_id(), get_images_by_detected_chicken(), ChickenImageResponseSchema, CreateChickenImageSchema (+2 more)

### Community 16 - "src/components/index.js"
Cohesion: 0.15
Nodes (14): AppLayout(), tones, TextField(), BottomNav(), ContactSupportContent(), FeedbackModal(), Footer(), navigateLinks (+6 more)

### Community 17 - "UserService"
Cohesion: 0.17
Nodes (8): User, UserService, FakeDB, test_register_allows_valid_email(), test_register_rejects_risky_email(), blocked(), test_update_email_change_checks_new_email(), hash_password()

### Community 18 - "react-icons"
Cohesion: 0.12
Nodes (13): sizes, QuickScanModal(), SettingsMenu(), navLinks, navLinksRight, SEVERITY_STYLES, AccuracyNotice(), CameraCaptureModal() (+5 more)

### Community 19 - "project.yml"
Cohesion: 0.08
Nodes (25): activation_command, activation_command_timeout, added_modes, agent_interface, default_modes, encoding, excluded_apis, excluded_tools (+17 more)

### Community 20 - "gemini_disease_classifier.py"
Cohesion: 0.16
Nodes (11): _apply_healthy_confidence_floor(), _cannot_assess_result(), classify_disease_with_gemini(), classify_diseases_batch_with_gemini(), _hash_image(), _load_cache(), _parse_framing(), _sanitize_confidence() (+3 more)

### Community 21 - "Notice"
Cohesion: 0.17
Nodes (22): EmptyState(), Notice(), PageHeader(), ActiveFarmContext, useActiveFarm(), buildFarmFormData(), createFarm(), deleteFarm() (+14 more)

### Community 22 - "UserController"
Cohesion: 0.19
Nodes (7): UserController, delete_user(), get_all_users(), get_user(), update_user(), upload_avatar(), UpdateUserSchema

### Community 23 - "json"
Cohesion: 0.33
Nodes (5): get_disease_recommendation(), _hygiene_only(), _load_cache(), RecommendationError, _save_cache()

### Community 25 - "gemini_client.py"
Cohesion: 0.14
Nodes (13): _build_prompt(), _compute_oil_ml(), _detect_mime_type(), GeminiInsightsError, get_disease_insights(), get_disease_insights_batch(), _sanitize_weight(), _sanitize_weight_confidence() (+5 more)

### Community 26 - "gemini_image_counter.py"
Cohesion: 0.13
Nodes (9): _build_model_chain(), _convert_box_2d_to_pixel_box(), count_chickens_with_gemini(), _detect_mime_type(), GeminiCountingError, _get_image_dimensions(), ImageQualityError, _sanitize_confidence() (+1 more)

### Community 27 - "env.py"
Cohesion: 0.19
Nodes (8): Base, AIPrediction, ChickenImage, ImageType, DetectedChicken, ScanPhoto, UserRole, DetectionService

### Community 28 - "FarmLocationSelect"
Cohesion: 0.33
Nodes (4): emptyPlaceholder(), FarmLocationSelect(), handleSearchKey(), handleSelect()

### Community 29 - "avatarIcons.jsx"
Cohesion: 0.22
Nodes (8): MiniAvatar(), Avatar(), AVATAR_ICON_KEYS, AVATAR_ICONS, getIconKey(), isIconAvatar(), resolveAvatarSrc(), getInitials()

### Community 30 - "Button"
Cohesion: 0.11
Nodes (20): Button(), buttonStyles(), sizes, variants, ModalShell(), AppModal(), sizeMap, variantConfig (+12 more)

### Community 32 - "user_service.py"
Cohesion: 0.16
Nodes (4): get_current_user_id(), create_access_token(), decode_token(), verify_password()

### Community 33 - "psgcApi.js"
Cohesion: 0.27
Nodes (14): cache, fetchBarangays(), fetchProvinceCitiesMunicipalities(), fetchProvinces(), fetchPsgc(), fetchRegionCitiesMunicipalities(), fetchRegions(), inFlight (+6 more)

### Community 35 - "Register.jsx"
Cohesion: 0.19
Nodes (20): LoadingScreen(), HomeRedirect(), ProtectedRoute(), AuthAlert(), TONES, AuthCard(), AuthField(), AuthLayout() (+12 more)

### Community 37 - "AiScan.jsx"
Cohesion: 0.14
Nodes (15): SEVERITY_RANK, summarize(), useQuickScan(), predictDisease(), countChickens(), createScanSession(), useAiPrediction(), useDetection() (+7 more)

### Community 38 - "test_scan_integrity.py"
Cohesion: 0.23
Nodes (9): ScanStatus, ScanType, photo(), test_crop_cap_preserves_aspect_ratio(), test_invalid_box_never_substitutes_whole_flock(), test_out_of_order_response_stays_attached_to_correct_image(), test_partial_or_malformed_batch_is_rejected(), test_source_storage_preserves_detection_coordinates() (+1 more)

### Community 41 - "detection_route.py"
Cohesion: 0.16
Nodes (4): get_db(), count_chickens(), test_capacity_rejects_parallel_request_and_releases_after_failure(), scan_capacity()

### Community 42 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 43 - "roboflow_client.py"
Cohesion: 0.21
Nodes (3): RoboflowAPIError, RoboflowTimeoutError, run_chicken_detection()

### Community 44 - "test_quota_retry_replaces_previous_rows"
Cohesion: 0.27
Nodes (8): test_quota_retry_replaces_previous_rows(), fail_gemini(), fail_router(), test_unavailable_classification_is_unknown_not_healthy(), fail_gemini(), fail_router(), DiseaseClassificationError, OpenRouterVisionError

### Community 46 - "ai_prediction_route.py"
Cohesion: 0.40
Nodes (4): AIPredictionController, BatchPredictionResponseSchema, ChickenPredictionSchema, ImageTypeSchema

### Community 49 - "main.jsx"
Cohesion: 0.24
Nodes (4): @react-oauth/google@^0.13.5, App(), ActiveFarmProvider(), @react-oauth/google

### Community 50 - "database.py"
Cohesion: 0.28
Nodes (3): _detect_ssl_mode(), _ensure_database_exists(), _resolve_ssl_ca_path()

### Community 51 - "detection_schema.py"
Cohesion: 0.47
Nodes (3): BoundingBox, ChickenDetection, DetectionResponse

## Knowledge Gaps
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-icons` connect `react-icons` to `useAuth`, `src/components/index.js`, `Register.jsx`, `AiScan.jsx`, `frontend/package.json`, `Surface`, `Button`, `src/components/index.js`, `Notice`, `avatarIcons.jsx`, `Button`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.12233285917496443 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react-icons` to `useAuth`, `psgcApi.js`, `src/components/index.js`, `apiRequest`, `AiScan.jsx`, `Register.jsx`, `frontend/package.json`, `Surface`, `Button`, `src/components/index.js`, `main.jsx`, `Notice`, `Button`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `ScanSessionController` be split into smaller, more focused modules?**
  _Cohesion score 0.07367737747484583 - nodes in this community are weakly interconnected._
- **Why does `ChickenWeightEstimator` connect `ChickenWeightEstimator` to `os`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `ScanSummaryController` be split into smaller, more focused modules?**
  _Cohesion score 0.10062893081761007 - nodes in this community are weakly interconnected._
- **Should `apiRequest` be split into smaller, more focused modules?**
  _Cohesion score 0.12436974789915967 - nodes in this community are weakly interconnected._