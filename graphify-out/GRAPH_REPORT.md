# Graph Report - Poultry Scanner  (2026-11-19)

## Corpus Check
- 265 files · ~70,296 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 1312 nodes · 3857 edges · 45 communities (35 shown, 10 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 215 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a18bdf21`
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
- RegisterUserSchema
- Notice
- UserController
- AIPredictionService
- gemini_disease_classifier.py
- gemini_image_counter.py
- avatarIcons.jsx
- Notice
- FastAPI
- psgcApi.js
- EmailService
- ScanDetailModal.jsx
- env.py
- ChickenWeightEstimator
- database.py
- .oxlintrc.json
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `react-icons` - 73 edges
2. `react` - 61 edges
3. `apiRequest()` - 44 edges
4. `Button()` - 42 edges
5. `react-router-dom` - 34 edges
6. `AIPredictionService` - 30 edges
7. `Base` - 28 edges
8. `AuthController` - 28 edges
9. `UserService` - 27 edges
10. `Surface()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `ResultsView()` --indirect_call--> `presentChicken()`  [INFERRED]
  frontend/src/pages/ai-scan/components/ResultsView.jsx → frontend/src/pages/ai-scan/components/resultPresentation.js
- `ScanSessionService` --uses--> `ScanSession`  [INFERRED]
  backend/services/scan_session_service.py → backend/models/scan_session.py
- `ScanSummaryService` --uses--> `ScanSession`  [INFERRED]
  backend/services/scan_summary_service.py → backend/models/scan_session.py
- `ScanSessionService` --uses--> `ScanStatus`  [INFERRED]
  backend/services/scan_session_service.py → backend/models/scan_session.py
- `AuthController` --uses--> `CreateNotificationSchema`  [INFERRED]
  backend/controllers/auth_controller.py → backend/schemas/notification_schema.py

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
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/NoActiveFarmNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/FarmRequiredModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/AccuracyNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/CameraCaptureModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ScanningView.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 4-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx`
- 5-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 5-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 5-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`

## Communities (45 total, 10 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.11
Nodes (25): LoadingScreen(), useAuth(), HomeRedirect(), ProtectedRoute(), CtaBanner(), FeatureCard(), FeatureGrid(), features (+17 more)

### Community 1 - "ScanSessionController"
Cohesion: 0.07
Nodes (25): NotificationController, ScanSessionController, Notification, create_notification(), delete_notification(), get_all_notifications(), get_notification_by_id(), get_notifications_by_user() (+17 more)

### Community 2 - "ScanSummaryController"
Cohesion: 0.10
Nodes (20): ScanSummaryController, ScanSummary, create_scan_summary(), delete_scan_summary(), generate_scan_summary(), get_all_scan_summaries(), get_my_dashboard_stats(), get_my_scan_history() (+12 more)

### Community 3 - "src/components/index.js"
Cohesion: 0.14
Nodes (15): Badge(), sizes, tones, NotificationsMenu(), timeAgo(), PoultryScanLoader(), useNotifications(), formatDate() (+7 more)

### Community 4 - "apiRequest"
Cohesion: 0.05
Nodes (55): apiRequest(), BASE_URL, formatErrorDetail(), FeedbackAPI, NotificationAPI, SEVERITY_RANK, summarize(), useQuickScan() (+47 more)

### Community 5 - "database.py"
Cohesion: 0.15
Nodes (13): JournalEntryController, JournalEntry, create_journal_entry(), delete_journal_entry(), get_journal_entries_by_farm(), get_journal_entry_by_id(), get_my_journal_entries(), update_journal_entry() (+5 more)

### Community 6 - "FarmController"
Cohesion: 0.12
Nodes (13): FarmController, Farm, create_farm(), delete_farm(), get_all_farms(), get_farm_by_id(), get_my_farms(), update_farm() (+5 more)

### Community 7 - "os"
Cohesion: 0.09
Nodes (14): ScanStatus, photo(), test_crop_cap_preserves_aspect_ratio(), test_invalid_box_never_substitutes_whole_flock(), test_multi_angle_persistence_history_and_duplicate_submission(), test_source_storage_preserves_detection_coordinates(), save_farm_image(), compress_image() (+6 more)

### Community 8 - "sqlalchemy"
Cohesion: 0.07
Nodes (13): upgrade(), downgrade(), upgrade(), downgrade(), upgrade(), upgrade(), upgrade(), downgrade() (+5 more)

### Community 9 - "AuthController"
Cohesion: 0.20
Nodes (16): AuthController, forgot_password(), get_current_user(), google_login(), login(), logout(), register(), reset_password() (+8 more)

### Community 10 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): dependencies, lucide-react@^1.23.0, react@^19.2.7, react-dom@^19.2.7, react-icons@^5.7.0, @react-oauth/google@^0.13.5, react-router-dom@^7.18.1, tailwindcss@^4.3.2 (+32 more)

### Community 11 - "Surface"
Cohesion: 0.13
Nodes (23): EmptyState(), paddings, radii, Surface(), tones, NoActiveFarmNotice(), AlertFeed(), timeAgo() (+15 more)

### Community 12 - "Button"
Cohesion: 0.25
Nodes (11): PageHeader(), ConfirmDeleteModal(), FilterBar(), HealthBreakdown(), MarketReadyBar(), Pagination(), ScanCard(), ScanRow() (+3 more)

### Community 13 - "test_abstract_email_service.py"
Cohesion: 0.16
Nodes (19): AbstractEmailService, FakeResponse, test_check_disabled_in_development_without_api_call(), fake_get(), test_check_disabled_when_app_env_is_development(), fake_get(), test_check_skipped_when_api_key_missing_in_production(), fake_get() (+11 more)

### Community 14 - "activity_log_route.py"
Cohesion: 0.09
Nodes (16): ActivityLogController, _build_alembic_config(), ensure_migrated(), health_check(), lifespan(), unhandled_exception_handler(), ActivityLog, create_activity_log() (+8 more)

### Community 15 - "chicken_image_route.py"
Cohesion: 0.15
Nodes (10): ChickenImageController, create_chicken_image(), delete_chicken_image(), get_all_chicken_images(), get_chicken_image_by_id(), get_images_by_detected_chicken(), ChickenImageResponseSchema, CreateChickenImageSchema (+2 more)

### Community 16 - "src/components/index.js"
Cohesion: 0.12
Nodes (25): App(), AppLayout(), BottomNav(), ContactSupportContent(), FeedbackModal(), Footer(), navigateLinks, InfoModal() (+17 more)

### Community 17 - "UserService"
Cohesion: 0.24
Nodes (3): User, UserService, test_update_email_change_checks_new_email()

### Community 18 - "react-icons"
Cohesion: 0.09
Nodes (19): Button(), buttonStyles(), sizes, variants, ModalShell(), sizes, tones, AppModal() (+11 more)

### Community 19 - "project.yml"
Cohesion: 0.08
Nodes (25): activation_command, activation_command_timeout, added_modes, agent_interface, default_modes, encoding, excluded_apis, excluded_tools (+17 more)

### Community 20 - "RegisterUserSchema"
Cohesion: 0.24
Nodes (5): RegisterUserSchema, FakeDB, test_register_allows_valid_email(), test_register_rejects_risky_email(), blocked()

### Community 21 - "Notice"
Cohesion: 0.15
Nodes (22): TextField(), ActiveFarmContext, useActiveFarm(), buildFarmFormData(), createFarm(), deleteFarm(), getFarmById(), getMyFarms() (+14 more)

### Community 22 - "UserController"
Cohesion: 0.19
Nodes (7): UserController, delete_user(), get_all_users(), get_user(), update_user(), upload_avatar(), UpdateUserSchema

### Community 24 - "AIPredictionService"
Cohesion: 0.05
Nodes (25): AIPredictionController, get_measurements(), get_predictions_by_session(), predict_disease(), save_measurements(), count_chickens(), BatchPredictionResponseSchema, ChickenPredictionSchema (+17 more)

### Community 25 - "gemini_disease_classifier.py"
Cohesion: 0.06
Nodes (35): test_out_of_order_response_stays_attached_to_correct_image(), test_partial_or_malformed_batch_is_rejected(), test_no_fabricated_weight_or_oil_when_provider_cannot_estimate(), test_scan_estimates_keep_image_mapping_and_calculate_oil(), _build_prompt(), _compute_oil_ml(), _detect_mime_type(), GeminiInsightsError (+27 more)

### Community 26 - "gemini_image_counter.py"
Cohesion: 0.11
Nodes (10): DetectionController, DetectionService, _build_model_chain(), _convert_box_2d_to_pixel_box(), count_chickens_with_gemini(), _detect_mime_type(), GeminiCountingError, _get_image_dimensions() (+2 more)

### Community 29 - "avatarIcons.jsx"
Cohesion: 0.19
Nodes (8): MiniAvatar(), Avatar(), AVATAR_ICON_KEYS, AVATAR_ICONS, getIconKey(), isIconAvatar(), resolveAvatarSrc(), getInitials()

### Community 30 - "Notice"
Cohesion: 0.36
Nodes (7): Notice(), AccuracyNotice(), ProfileAPI, AvatarModal(), InfoRow(), useProfile(), Profile()

### Community 32 - "FastAPI"
Cohesion: 0.15
Nodes (6): get_current_user_id(), get_google_user_info(), create_access_token(), decode_token(), hash_password(), verify_password()

### Community 33 - "psgcApi.js"
Cohesion: 0.27
Nodes (14): cache, fetchBarangays(), fetchProvinceCitiesMunicipalities(), fetchProvinces(), fetchPsgc(), fetchRegionCitiesMunicipalities(), fetchRegions(), inFlight (+6 more)

### Community 34 - "EmailService"
Cohesion: 0.10
Nodes (7): RoboflowAPIError, RoboflowTimeoutError, run_chicken_detection(), FeedbackController, submit_feedback(), FeedbackSchema, EmailService

### Community 37 - "ScanDetailModal.jsx"
Cohesion: 0.10
Nodes (9): presentChicken(), ResultsView(), ScanningView(), getPredictionsBySession(), ChickenPredictionCard(), DetailStat(), TONES, ManualScanLog() (+1 more)

### Community 38 - "env.py"
Cohesion: 0.16
Nodes (13): Base, run_migrations_offline(), run_migrations_online(), AIPrediction, ChickenImage, ImageType, DetectedChicken, ScanPhoto (+5 more)

### Community 41 - "database.py"
Cohesion: 0.24
Nodes (4): _detect_ssl_mode(), _ensure_database_exists(), get_db(), _resolve_ssl_ca_path()

### Community 42 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-icons` connect `react-icons` to `useAuth`, `src/components/index.js`, `apiRequest`, `ScanDetailModal.jsx`, `frontend/package.json`, `Surface`, `Button`, `src/components/index.js`, `Notice`, `avatarIcons.jsx`, `Notice`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.10631229235880399 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react-icons` to `useAuth`, `psgcApi.js`, `src/components/index.js`, `apiRequest`, `ScanDetailModal.jsx`, `frontend/package.json`, `Surface`, `Button`, `src/components/index.js`, `Notice`, `avatarIcons.jsx`, `Notice`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `ScanSessionController` be split into smaller, more focused modules?**
  _Cohesion score 0.07056962025316456 - nodes in this community are weakly interconnected._
- **Why does `User` connect `UserService` to `FastAPI`, `env.py`, `os`, `test_abstract_email_service.py`, `RegisterUserSchema`, `gemini_disease_classifier.py`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `ScanSummaryController` be split into smaller, more focused modules?**
  _Cohesion score 0.10062893081761007 - nodes in this community are weakly interconnected._
- **Should `src/components/index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13666666666666666 - nodes in this community are weakly interconnected._