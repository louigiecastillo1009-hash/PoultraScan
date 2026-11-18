# Graph Report - Poultry Scanner  (2026-11-18)

## Corpus Check
- 258 files · ~68,713 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 1263 nodes · 3763 edges · 44 communities (37 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 209 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0885e33b`
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
- ai_prediction_service.py
- AuthController
- frontend/package.json
- Surface
- Button
- test_abstract_email_service.py
- activity_log_route.py
- chicken_image_route.py
- routes.jsx
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
- Profile.jsx
- FarmLocationSelect
- avatarIcons.jsx
- Button
- user_service.py
- psgcApi.js
- EmailService
- Register.jsx
- DetectionController
- RegisterUserSchema
- test_scan_integrity.py
- ChickenWeightEstimator
- .oxlintrc.json
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `react-icons` - 73 edges
2. `react` - 59 edges
3. `Button()` - 50 edges
4. `apiRequest()` - 40 edges
5. `react-router-dom` - 34 edges
6. `Surface()` - 29 edges
7. `Notice()` - 29 edges
8. `AuthController` - 28 edges
9. `UserService` - 27 edges
10. `Base` - 26 edges

## Surprising Connections (you probably didn't know these)
- `test_quota_retry_replaces_previous_rows()` --uses--> `AIPredictionService`  [INFERRED]
  backend/tests/test_scan_integrity.py → backend/services/ai_prediction_service.py
- `test_out_of_order_response_stays_attached_to_correct_image()` --calls--> `ordered_image_results()`  [EXTRACTED]
  backend/tests/test_scan_integrity.py → backend/utils/scan_result_validation.py
- `ScanSummaryService` --uses--> `ScanSession`  [INFERRED]
  backend/services/scan_summary_service.py → backend/models/scan_session.py
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
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ChickenCard.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/NoActiveFarmNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/CameraCaptureModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/FarmRequiredModal.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/AccuracyNotice.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/ScanningView.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/pages/ai-scan/components/index.js -> frontend/src/pages/ai-scan/components/TotalsFooter.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`
- 4-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 4-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 4-file cycle: `frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx`
- 5-file cycle: `frontend/src/components/BottomNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/BottomNav.jsx`
- 5-file cycle: `frontend/src/components/Footer.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/Footer.jsx`
- 5-file cycle: `frontend/src/components/QuickScanModal.jsx -> frontend/src/components/app/index.js -> frontend/src/components/app/AppLayout.jsx -> frontend/src/components/TopNav.jsx -> frontend/src/components/index.js -> frontend/src/components/QuickScanModal.jsx`

## Communities (44 total, 7 thin omitted)

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
Cohesion: 0.16
Nodes (13): Badge(), sizes, tones, NotificationsMenu(), timeAgo(), PoultryScanLoader(), useNotifications(), formatDate() (+5 more)

### Community 4 - "apiRequest"
Cohesion: 0.07
Nodes (45): apiRequest(), BASE_URL, formatErrorDetail(), FeedbackAPI, NotificationAPI, SEVERITY_RANK, summarize(), useQuickScan() (+37 more)

### Community 5 - "database.py"
Cohesion: 0.09
Nodes (18): JournalEntryController, _build_alembic_config(), ensure_migrated(), health_check(), lifespan(), unhandled_exception_handler(), JournalEntry, create_journal_entry() (+10 more)

### Community 6 - "FarmController"
Cohesion: 0.12
Nodes (13): FarmController, Farm, create_farm(), delete_farm(), get_all_farms(), get_farm_by_id(), get_my_farms(), update_farm() (+5 more)

### Community 7 - "os"
Cohesion: 0.11
Nodes (7): save_farm_image(), compress_image(), convert_to_jpeg(), preprocess_image(), save_compressed_image(), should_tile(), split_into_tiles()

### Community 8 - "ai_prediction_service.py"
Cohesion: 0.06
Nodes (23): Base, run_migrations_offline(), run_migrations_online(), upgrade(), downgrade(), upgrade(), downgrade(), upgrade() (+15 more)

### Community 9 - "AuthController"
Cohesion: 0.16
Nodes (17): AuthController, forgot_password(), get_current_user(), google_login(), login(), logout(), register(), reset_password() (+9 more)

### Community 10 - "frontend/package.json"
Cohesion: 0.07
Nodes (35): dependencies, lucide-react@^1.23.0, react@^19.2.7, react-dom@^19.2.7, react-icons@^5.7.0, @react-oauth/google@^0.13.5, react-router-dom@^7.18.1, tailwindcss@^4.3.2 (+27 more)

### Community 11 - "Surface"
Cohesion: 0.12
Nodes (26): EmptyState(), paddings, radii, Surface(), tones, AlertFeed(), timeAgo(), typeStyles (+18 more)

### Community 12 - "Button"
Cohesion: 0.19
Nodes (15): getPredictionsBySession(), ChickenPredictionCard(), ConfirmDeleteModal(), DetailStat(), TONES, HealthBreakdown(), MarketReadyBar(), ScanCard() (+7 more)

### Community 13 - "test_abstract_email_service.py"
Cohesion: 0.16
Nodes (19): AbstractEmailService, FakeResponse, test_check_disabled_in_development_without_api_call(), fake_get(), test_check_disabled_when_app_env_is_development(), fake_get(), test_check_skipped_when_api_key_missing_in_production(), fake_get() (+11 more)

### Community 14 - "activity_log_route.py"
Cohesion: 0.16
Nodes (10): ActivityLogController, ActivityLog, create_activity_log(), delete_activity_log(), get_activity_log_by_id(), get_activity_logs_by_user(), get_all_activity_logs(), ActivityLogResponseSchema (+2 more)

### Community 15 - "chicken_image_route.py"
Cohesion: 0.15
Nodes (10): ChickenImageController, create_chicken_image(), delete_chicken_image(), get_all_chicken_images(), get_chicken_image_by_id(), get_images_by_detected_chicken(), ChickenImageResponseSchema, CreateChickenImageSchema (+2 more)

### Community 16 - "routes.jsx"
Cohesion: 0.17
Nodes (15): App(), AppLayout(), BottomNav(), LoadingScreen(), ProfileMenu(), getActiveFromPath(), navLinks, TopNav() (+7 more)

### Community 18 - "react-icons"
Cohesion: 0.11
Nodes (18): sizes, SectionHeading(), SettingsMenu(), navLinks, navLinksRight, SEVERITY_STYLES, ChickenCard(), ChickenList() (+10 more)

### Community 19 - "project.yml"
Cohesion: 0.08
Nodes (25): activation_command, activation_command_timeout, added_modes, agent_interface, default_modes, encoding, excluded_apis, excluded_tools (+17 more)

### Community 20 - "gemini_disease_classifier.py"
Cohesion: 0.16
Nodes (13): _apply_healthy_confidence_floor(), _cannot_assess_result(), classify_disease_with_gemini(), classify_diseases_batch_with_gemini(), _hash_image(), _load_cache(), _parse_framing(), _sanitize_confidence() (+5 more)

### Community 21 - "Notice"
Cohesion: 0.18
Nodes (16): Notice(), PageHeader(), TextField(), useActiveFarm(), AccuracyNotice(), ScanningView(), DeleteFarmModal(), EditFarmModal() (+8 more)

### Community 22 - "UserController"
Cohesion: 0.19
Nodes (7): UserController, delete_user(), get_all_users(), get_user(), update_user(), upload_avatar(), UpdateUserSchema

### Community 23 - "json"
Cohesion: 0.22
Nodes (5): get_disease_recommendation(), _hygiene_only(), _load_cache(), RecommendationError, _save_cache()

### Community 24 - "AIPredictionService"
Cohesion: 0.05
Nodes (19): AIPredictionController, _detect_ssl_mode(), _ensure_database_exists(), get_db(), _resolve_ssl_ca_path(), get_predictions_by_session(), predict_disease(), count_chickens() (+11 more)

### Community 25 - "gemini_client.py"
Cohesion: 0.16
Nodes (9): _build_prompt(), _compute_oil_ml(), _detect_mime_type(), GeminiInsightsError, get_disease_insights(), get_disease_insights_batch(), _sanitize_weight(), _sanitize_weight_confidence() (+1 more)

### Community 26 - "gemini_image_counter.py"
Cohesion: 0.14
Nodes (11): _build_model_chain(), _convert_box_2d_to_pixel_box(), count_chickens_with_gemini(), _detect_mime_type(), GeminiCountingError, _get_image_dimensions(), ImageQualityError, _sanitize_confidence() (+3 more)

### Community 27 - "Profile.jsx"
Cohesion: 0.35
Nodes (5): ProfileAPI, AvatarModal(), InfoRow(), useProfile(), Profile()

### Community 28 - "FarmLocationSelect"
Cohesion: 0.33
Nodes (4): emptyPlaceholder(), FarmLocationSelect(), handleSearchKey(), handleSelect()

### Community 29 - "avatarIcons.jsx"
Cohesion: 0.22
Nodes (8): MiniAvatar(), Avatar(), AVATAR_ICON_KEYS, AVATAR_ICONS, getIconKey(), isIconAvatar(), resolveAvatarSrc(), getInitials()

### Community 30 - "Button"
Cohesion: 0.16
Nodes (12): Button(), buttonStyles(), sizes, variants, ModalShell(), tones, AppModal(), sizeMap (+4 more)

### Community 32 - "user_service.py"
Cohesion: 0.18
Nodes (5): get_current_user_id(), create_access_token(), decode_token(), hash_password(), verify_password()

### Community 33 - "psgcApi.js"
Cohesion: 0.27
Nodes (14): cache, fetchBarangays(), fetchProvinceCitiesMunicipalities(), fetchProvinces(), fetchPsgc(), fetchRegionCitiesMunicipalities(), fetchRegions(), inFlight (+6 more)

### Community 34 - "EmailService"
Cohesion: 0.10
Nodes (7): RoboflowAPIError, RoboflowTimeoutError, run_chicken_detection(), FeedbackController, submit_feedback(), FeedbackSchema, EmailService

### Community 35 - "Register.jsx"
Cohesion: 0.13
Nodes (28): ContactSupportContent(), FeedbackModal(), Footer(), navigateLinks, InfoModal(), PrivacyPolicyContent(), TermsOfServiceContent(), checkServerHealth() (+20 more)

### Community 37 - "RegisterUserSchema"
Cohesion: 0.22
Nodes (6): RegisterUserSchema, FakeDB, test_register_allows_valid_email(), test_register_rejects_risky_email(), blocked(), test_update_email_change_checks_new_email()

### Community 38 - "test_scan_integrity.py"
Cohesion: 0.13
Nodes (15): ScanType, photo(), test_crop_cap_preserves_aspect_ratio(), test_invalid_box_never_substitutes_whole_flock(), test_out_of_order_response_stays_attached_to_correct_image(), test_partial_or_malformed_batch_is_rejected(), test_quota_retry_replaces_previous_rows(), fail_gemini() (+7 more)

### Community 42 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-icons` connect `react-icons` to `useAuth`, `src/components/index.js`, `Register.jsx`, `apiRequest`, `frontend/package.json`, `Surface`, `Button`, `routes.jsx`, `Notice`, `Profile.jsx`, `avatarIcons.jsx`, `Button`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.12233285917496443 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react-icons` to `useAuth`, `psgcApi.js`, `Register.jsx`, `src/components/index.js`, `apiRequest`, `frontend/package.json`, `Surface`, `Button`, `routes.jsx`, `Notice`, `Profile.jsx`, `Button`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `ScanSessionController` be split into smaller, more focused modules?**
  _Cohesion score 0.07376543209876543 - nodes in this community are weakly interconnected._
- **Why does `User` connect `UserService` to `user_service.py`, `RegisterUserSchema`, `test_scan_integrity.py`, `ai_prediction_service.py`, `test_abstract_email_service.py`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `ScanSummaryController` be split into smaller, more focused modules?**
  _Cohesion score 0.10062893081761007 - nodes in this community are weakly interconnected._
- **Should `apiRequest` be split into smaller, more focused modules?**
  _Cohesion score 0.06582952815829528 - nodes in this community are weakly interconnected._