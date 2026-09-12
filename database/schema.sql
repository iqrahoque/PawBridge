-- ============================================================
--  PetCare — Database Schema (MySQL 8.0.16+)
--  Adopt. Donate. Heal.
--
--  29 tables · 3 triggers · 3 views
--  Charset: utf8mb4 (Bangla-safe) · Engine: InnoDB
--
--  Conventions:
--    * snake_case names, singular table names
--    * BIGINT UNSIGNED auto-increment surrogate PKs
--    * created_at / updated_at on hot tables
--    * ON DELETE chosen deliberately per relationship
-- ============================================================

CREATE DATABASE IF NOT EXISTS petcare_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE petcare_db;

-- ------------------------------------------------------------
-- 1. USERS & ORGANIZATIONS
-- ------------------------------------------------------------

CREATE TABLE users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,                -- bcrypt, never plain text
  role          ENUM('adopter','shelter','vet','admin') NOT NULL DEFAULT 'adopter',
  full_name     VARCHAR(120) NOT NULL,
  phone         VARCHAR(20),
  address       VARCHAR(255),
  city          VARCHAR(80) DEFAULT 'Dhaka',
  avatar_url    VARCHAR(500),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE shelters (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,            -- 1:1 account owner
  name           VARCHAR(150) NOT NULL,
  description    TEXT,
  license_number VARCHAR(50),
  address        VARCHAR(255),
  city           VARCHAR(80) DEFAULT 'Dhaka',
  latitude       DECIMAL(10,7),
  longitude      DECIMAL(10,7),
  capacity       INT NOT NULL DEFAULT 0,              -- max animals it can host
  verified       BOOLEAN NOT NULL DEFAULT FALSE,      -- admin-verified
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_shelters_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_shelters_user (user_id),
  KEY idx_shelters_city (city)
) ENGINE=InnoDB;

CREATE TABLE vet_clinics (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           BIGINT UNSIGNED NOT NULL,         -- 1:1 account owner
  name              VARCHAR(150) NOT NULL,
  address           VARCHAR(255) NOT NULL,
  city              VARCHAR(80) DEFAULT 'Dhaka',
  area              VARCHAR(80),                      -- e.g. Gulshan, Dhanmondi
  phone             VARCHAR(20),
  latitude          DECIMAL(10,7),
  longitude         DECIMAL(10,7),
  opening_hours     VARCHAR(255),                     -- e.g. "Sat-Thu 9:00-21:00"
  services          VARCHAR(500),                     -- comma-separated summary
  emergency_service BOOLEAN NOT NULL DEFAULT FALSE,
  low_cost          BOOLEAN NOT NULL DEFAULT FALSE,   -- subsidized / charity slots
  verified          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_clinics_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_clinics_user (user_id),
  KEY idx_clinics_city_area (city, area),
  KEY idx_clinics_emergency (emergency_service)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. PETS & ADOPTION (M1)
-- ------------------------------------------------------------

CREATE TABLE pets (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shelter_id       BIGINT UNSIGNED NOT NULL,
  name             VARCHAR(80) NOT NULL,
  species          ENUM('dog','cat') NOT NULL,
  breed            VARCHAR(80),
  age_months       INT NOT NULL CHECK (age_months >= 0),
  size             ENUM('small','medium','large') NOT NULL DEFAULT 'medium',
  gender           ENUM('male','female') NOT NULL,
  vaccinated       BOOLEAN NOT NULL DEFAULT FALSE,
  neutered         BOOLEAN NOT NULL DEFAULT FALSE,
  good_with_kids   BOOLEAN NOT NULL DEFAULT TRUE,
  good_with_dogs   BOOLEAN NOT NULL DEFAULT TRUE,
  good_with_cats   BOOLEAN NOT NULL DEFAULT TRUE,
  energy_level     ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  medical_history  TEXT,
  story            TEXT,                              -- the "about me" narrative
  status           ENUM('available','pending','adopted','medical_hold','fostered')
                     NOT NULL DEFAULT 'available',
  admission_date   DATE,
  adopted_at       DATETIME NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pets_shelter FOREIGN KEY (shelter_id)
    REFERENCES shelters(id) ON DELETE CASCADE,
  KEY idx_pets_search (species, status),
  KEY idx_pets_shelter_status (shelter_id, status),
  KEY idx_pets_age (age_months)
) ENGINE=InnoDB;

CREATE TABLE pet_photos (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pet_id       BIGINT UNSIGNED NOT NULL,
  url          VARCHAR(500) NOT NULL,
  caption      VARCHAR(200),
  is_primary   BOOLEAN NOT NULL DEFAULT FALSE,        -- shown on listing card
  uploaded_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_photos_pet FOREIGN KEY (pet_id)
    REFERENCES pets(id) ON DELETE CASCADE,
  KEY idx_photos_pet (pet_id, is_primary)
) ENGINE=InnoDB;

CREATE TABLE adoption_applications (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pet_id             BIGINT UNSIGNED NOT NULL,
  applicant_id       BIGINT UNSIGNED NOT NULL,
  status             ENUM('submitted','under_review','approved','rejected','withdrawn')
                       NOT NULL DEFAULT 'submitted',
  message            TEXT,                             -- "why I want to adopt"
  home_type          ENUM('apartment','house_with_yard','farm') NOT NULL,
  has_pet_experience BOOLEAN NOT NULL DEFAULT FALSE,
  decision_note      VARCHAR(500),                     -- shelter's reply note
  decided_at         DATETIME NULL,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_apps_pet FOREIGN KEY (pet_id)
    REFERENCES pets(id) ON DELETE CASCADE,
  CONSTRAINT fk_apps_user FOREIGN KEY (applicant_id)
    REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_apps_pet_user (pet_id, applicant_id),  -- one application per pet per user
  KEY idx_apps_status (status),
  KEY idx_apps_applicant (applicant_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. DONATIONS & WISH LISTS (M2)
-- ------------------------------------------------------------

CREATE TABLE donation_campaigns (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shelter_id    BIGINT UNSIGNED NOT NULL,
  pet_id        BIGINT UNSIGNED NULL,                  -- NULL = shelter-wide campaign
  title         VARCHAR(150) NOT NULL,
  description   TEXT,
  goal_amount   DECIMAL(12,2) NOT NULL CHECK (goal_amount > 0),
  raised_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,   -- maintained by triggers (see §7)
  currency      CHAR(3) NOT NULL DEFAULT 'BDT',
  status        ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
  starts_at     DATE,
  ends_at       DATE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_campaigns_shelter FOREIGN KEY (shelter_id)
    REFERENCES shelters(id) ON DELETE CASCADE,
  CONSTRAINT fk_campaigns_pet FOREIGN KEY (pet_id)
    REFERENCES pets(id) ON DELETE SET NULL,
  KEY idx_campaigns_status (status),
  KEY idx_campaigns_shelter (shelter_id)
) ENGINE=InnoDB;

CREATE TABLE donations (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  campaign_id    BIGINT UNSIGNED NOT NULL,
  donor_id       BIGINT UNSIGNED NULL,                 -- NULL = anonymous/guest donor
  amount         DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  message        VARCHAR(500),
  anonymous      BOOLEAN NOT NULL DEFAULT FALSE,
  payment_method ENUM('bkash','nagad','card','bank','cash') NOT NULL DEFAULT 'bkash',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_donations_campaign FOREIGN KEY (campaign_id)
    REFERENCES donation_campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_donations_donor FOREIGN KEY (donor_id)
    REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_donations_campaign (campaign_id),
  KEY idx_donations_donor (donor_id),
  KEY idx_donations_date (created_at)
) ENGINE=InnoDB;

CREATE TABLE shelter_wish_items (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shelter_id         BIGINT UNSIGNED NOT NULL,
  item_name          VARCHAR(120) NOT NULL,
  category           ENUM('food','medical','equipment','cleaning','other')
                       NOT NULL DEFAULT 'other',
  quantity_needed    INT NOT NULL CHECK (quantity_needed > 0),
  quantity_fulfilled INT NOT NULL DEFAULT 0,
  unit_cost          DECIMAL(10,2) NULL,               -- NULL = non-monetary pledge
  priority           ENUM('high','medium','low') NOT NULL DEFAULT 'medium',
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wishes_shelter FOREIGN KEY (shelter_id)
    REFERENCES shelters(id) ON DELETE CASCADE,
  CHECK (quantity_fulfilled <= quantity_needed),
  KEY idx_wishes_shelter (shelter_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. VET CARE (M3)
-- ------------------------------------------------------------

CREATE TABLE vet_reviews (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clinic_id  BIGINT UNSIGNED NOT NULL,
  user_id    BIGINT UNSIGNED NOT NULL,
  rating     TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    VARCHAR(1000),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_clinic FOREIGN KEY (clinic_id)
    REFERENCES vet_clinics(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_reviews_clinic_user (clinic_id, user_id)  -- one review per user; edit instead
) ENGINE=InnoDB;

CREATE TABLE pet_medical_reminders (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  pet_name      VARCHAR(80) NOT NULL,                  -- user's own pet (no FK by design)
  reminder_type ENUM('vaccine','deworming','vet_visit','medication','grooming')
                  NOT NULL DEFAULT 'vaccine',
  notes         VARCHAR(300),
  due_date      DATE NOT NULL,
  notified      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reminders_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_reminders_due (user_id, due_date)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. UNIQUE MODULE U1 — PET BLOOD BANK 🩸
-- ------------------------------------------------------------

CREATE TABLE pet_blood_donors (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id             BIGINT UNSIGNED NOT NULL,        -- owner account
  pet_name            VARCHAR(80) NOT NULL,
  species             ENUM('dog','cat') NOT NULL,
  breed               VARCHAR(80),
  blood_type          VARCHAR(10) NOT NULL,            -- dogs: DEA 1.1+/− · cats: A, B, AB
  weight_kg           DECIMAL(5,2) NOT NULL CHECK (weight_kg > 0),
  last_donation_date  DATE NULL,                       -- eligibility = 8+ weeks after (dogs)
  vaccination_current BOOLEAN NOT NULL DEFAULT TRUE,
  preferred_clinic_id BIGINT UNSIGNED NULL,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bdonors_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_bdonors_clinic FOREIGN KEY (preferred_clinic_id)
    REFERENCES vet_clinics(id) ON DELETE SET NULL,
  KEY idx_bdonors_match (species, blood_type, is_active)
) ENGINE=InnoDB;

CREATE TABLE blood_requests (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clinic_id     BIGINT UNSIGNED NOT NULL,
  species       ENUM('dog','cat') NOT NULL,
  blood_type    VARCHAR(10) NOT NULL,
  urgency       ENUM('critical','urgent','scheduled') NOT NULL DEFAULT 'urgent',
  units_needed  TINYINT NOT NULL DEFAULT 1 CHECK (units_needed BETWEEN 1 AND 10),
  patient_note  VARCHAR(300),                          -- no owner PII needed
  status        ENUM('open','fulfilled','expired','cancelled') NOT NULL DEFAULT 'open',
  deadline      DATETIME NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_breq_clinic FOREIGN KEY (clinic_id)
    REFERENCES vet_clinics(id) ON DELETE CASCADE,
  KEY idx_breq_match (species, blood_type, status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. UNIQUE MODULE U2 — LOST & FOUND 🐾
-- ------------------------------------------------------------

CREATE TABLE lost_pet_reports (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reporter_id      BIGINT UNSIGNED NULL,               -- NULL if deleted account
  pet_name         VARCHAR(80),
  species          ENUM('dog','cat') NOT NULL,
  breed            VARCHAR(80),
  color            VARCHAR(80),
  description      TEXT,
  last_seen_area   VARCHAR(150) NOT NULL,
  last_seen_lat    DECIMAL(10,7),
  last_seen_lng    DECIMAL(10,7),
  photo_url        VARCHAR(500),
  microchip_number VARCHAR(50) NULL,
  lost_on          DATE NOT NULL,
  status           ENUM('searching','sighted','reunited','closed')
                     NOT NULL DEFAULT 'searching',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lost_user FOREIGN KEY (reporter_id)
    REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_lost_status (status),
  KEY idx_lost_area (last_seen_area)
) ENGINE=InnoDB;

CREATE TABLE found_pet_reports (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  finder_id    BIGINT UNSIGNED NULL,
  shelter_id   BIGINT UNSIGNED NULL,                   -- set if taken to a shelter
  species      ENUM('dog','cat') NOT NULL,
  breed        VARCHAR(80),
  color        VARCHAR(80),
  description  TEXT,
  found_area   VARCHAR(150) NOT NULL,
  found_lat    DECIMAL(10,7),
  found_lng    DECIMAL(10,7),
  photo_url    VARCHAR(500),
  found_on     DATE NOT NULL,
  current_status ENUM('with_finder','at_shelter','at_vet','reunited')
                 NOT NULL DEFAULT 'with_finder',
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_found_finder FOREIGN KEY (finder_id)
    REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_found_shelter FOREIGN KEY (shelter_id)
    REFERENCES shelters(id) ON DELETE SET NULL,
  KEY idx_found_status (current_status),
  KEY idx_found_area (found_area)
) ENGINE=InnoDB;

CREATE TABLE lost_found_matches (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lost_report_id   BIGINT UNSIGNED NOT NULL,
  found_report_id  BIGINT UNSIGNED NOT NULL,
  match_score      DECIMAL(5,2) NOT NULL,              -- 0–100; AI scoring = future scope
  status           ENUM('suggested','confirmed','dismissed')
                     NOT NULL DEFAULT 'suggested',
  confirmed_by     BIGINT UNSIGNED NULL,               -- admin/moderator
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_match_lost FOREIGN KEY (lost_report_id)
    REFERENCES lost_pet_reports(id) ON DELETE CASCADE,
  CONSTRAINT fk_match_found FOREIGN KEY (found_report_id)
    REFERENCES found_pet_reports(id) ON DELETE CASCADE,
  CONSTRAINT fk_match_admin FOREIGN KEY (confirmed_by)
    REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_match_pair (lost_report_id, found_report_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 7. UNIQUE MODULE U3 — KARMA & IMPACT LEDGER 🌱
-- ------------------------------------------------------------

CREATE TABLE karma_ledger (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,
  action_type    ENUM('donation','adoption','foster','transport','blood_donation',
                      'review','lost_found_help','volunteer','safe_haven_foster',
                      'rescue_reported','rescue_responded','rescue_rescued','rescue_closed')
                    NOT NULL,
  reference_type VARCHAR(50) NULL,                     -- e.g. 'donations', 'transport_legs'
  reference_id   BIGINT UNSIGNED NULL,                 -- polymorphic pointer to the deed
  points         INT NOT NULL CHECK (points > 0),
  note           VARCHAR(300),
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_karma_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_karma_user (user_id),
  KEY idx_karma_action (action_type)
) ENGINE=InnoDB;

CREATE TABLE rewards_catalog (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(120) NOT NULL,
  description  VARCHAR(500),
  partner_name VARCHAR(120),                           -- e.g. "Care & Cure Vet Clinic"
  category     ENUM('vet_discount','pet_store','meal_donation','merchandise')
                 NOT NULL DEFAULT 'vet_discount',
  cost_points  INT NOT NULL CHECK (cost_points > 0),
  stock        INT NULL,                               -- NULL = unlimited
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE karma_redemptions (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  reward_id    BIGINT UNSIGNED NOT NULL,
  points_spent INT NOT NULL CHECK (points_spent > 0),
  status       ENUM('requested','approved','delivered','cancelled')
                 NOT NULL DEFAULT 'requested',
  voucher_code VARCHAR(20) NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_redemptions_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_redemptions_reward FOREIGN KEY (reward_id)
    REFERENCES rewards_catalog(id) ON DELETE RESTRICT,
  KEY idx_redemptions_user (user_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 8. UNIQUE MODULE U4 — FOSTER-TO-ADOPT BRIDGE 🏠
-- ------------------------------------------------------------

CREATE TABLE compatibility_profiles (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id            BIGINT UNSIGNED NOT NULL,
  home_type          ENUM('apartment','house_with_yard','farm') NOT NULL,
  has_yard           BOOLEAN NOT NULL DEFAULT FALSE,
  work_hours_per_day TINYINT NOT NULL DEFAULT 8 CHECK (work_hours_per_day BETWEEN 0 AND 16),
  activity_level     ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  has_children       BOOLEAN NOT NULL DEFAULT FALSE,
  has_dogs           BOOLEAN NOT NULL DEFAULT FALSE,
  has_cats           BOOLEAN NOT NULL DEFAULT FALSE,
  allergies          VARCHAR(200),
  preferred_species  ENUM('dog','cat','any') NOT NULL DEFAULT 'any',
  preferred_energy   ENUM('low','medium','high','any') NOT NULL DEFAULT 'any',
  monthly_budget     DECIMAL(10,2),
  experience_level   ENUM('first_time','some','experienced') NOT NULL DEFAULT 'first_time',
  completed_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quiz_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_quiz_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE pet_tags (                                -- 1NF-safe tagging (no CSV columns)
  pet_id BIGINT UNSIGNED NOT NULL,
  tag    VARCHAR(40) NOT NULL,                         -- playful, calm, shy, gentle…
  PRIMARY KEY (pet_id, tag),
  CONSTRAINT fk_tags_pet FOREIGN KEY (pet_id)
    REFERENCES pets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE foster_trials (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pet_id      BIGINT UNSIGNED NOT NULL,
  adopter_id  BIGINT UNSIGNED NOT NULL,
  started_on  DATE,
  ends_on     DATE,
  status      ENUM('requested','active','completed_adopted','returned','cancelled')
                NOT NULL DEFAULT 'requested',
  feedback    TEXT,                                    -- learns into recommendations
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trials_pet FOREIGN KEY (pet_id)
    REFERENCES pets(id) ON DELETE CASCADE,
  CONSTRAINT fk_trials_user FOREIGN KEY (adopter_id)
    REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_trials_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 9. UNIQUE MODULE U5 — RESCUE TRANSPORT RELAY 🚐
-- ------------------------------------------------------------

CREATE TABLE transport_missions (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shelter_id       BIGINT UNSIGNED NOT NULL,
  pet_id           BIGINT UNSIGNED NULL,
  title            VARCHAR(150) NOT NULL,
  origin_city      VARCHAR(80) NOT NULL,
  destination_city VARCHAR(80) NOT NULL,
  distance_km      INT,
  needed_on        DATE NOT NULL,
  status           ENUM('planning','legs_open','confirmed','in_transit','completed','cancelled')
                     NOT NULL DEFAULT 'planning',
  notes            VARCHAR(500),
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_missions_shelter FOREIGN KEY (shelter_id)
    REFERENCES shelters(id) ON DELETE CASCADE,
  CONSTRAINT fk_missions_pet FOREIGN KEY (pet_id)
    REFERENCES pets(id) ON DELETE SET NULL,
  KEY idx_missions_status (status)
) ENGINE=InnoDB;

CREATE TABLE transport_legs (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  mission_id   BIGINT UNSIGNED NOT NULL,
  leg_number   TINYINT NOT NULL CHECK (leg_number BETWEEN 1 AND 20),
  from_city    VARCHAR(80) NOT NULL,
  to_city      VARCHAR(80) NOT NULL,
  distance_km  INT,
  needed_on    DATE NOT NULL,
  driver_id    BIGINT UNSIGNED NULL,                   -- volunteer claims the leg
  status       ENUM('open','claimed','in_progress','done') NOT NULL DEFAULT 'open',
  CONSTRAINT fk_legs_mission FOREIGN KEY (mission_id)
    REFERENCES transport_missions(id) ON DELETE CASCADE,
  CONSTRAINT fk_legs_driver FOREIGN KEY (driver_id)
    REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_legs (mission_id, leg_number)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 10. UNIQUE MODULE U6 — VIRTUAL FOSTERING 💌
-- ------------------------------------------------------------

CREATE TABLE virtual_fosterings (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,             -- sponsor
  pet_id         BIGINT UNSIGNED NOT NULL,             -- long-stay / medical pet
  monthly_amount DECIMAL(10,2) NOT NULL CHECK (monthly_amount > 0),
  currency       CHAR(3) NOT NULL DEFAULT 'BDT',
  status         ENUM('active','paused','ended') NOT NULL DEFAULT 'active',
  started_on     DATE NOT NULL,
  ends_on        DATE NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vfoster_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_vfoster_pet FOREIGN KEY (pet_id)
    REFERENCES pets(id) ON DELETE CASCADE,
  UNIQUE KEY uq_vfoster (user_id, pet_id)
) ENGINE=InnoDB;

CREATE TABLE pet_updates (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pet_id      BIGINT UNSIGNED NOT NULL,
  posted_by   BIGINT UNSIGNED NULL,                    -- shelter staff user
  update_type ENUM('photo','letter','video','medical','milestone')
                NOT NULL DEFAULT 'photo',
  title       VARCHAR(150),
  content     TEXT,
  media_url   VARCHAR(500),
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_updates_pet FOREIGN KEY (pet_id)
    REFERENCES pets(id) ON DELETE CASCADE,
  CONSTRAINT fk_updates_user FOREIGN KEY (posted_by)
    REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_updates_pet (pet_id, created_at)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 11. UNIQUE MODULE U7 — EMERGENCY SAFE HAVEN 🆘
--     Privacy-first: NO user_id on requests — anonymous codes only.
-- ------------------------------------------------------------

CREATE TABLE safe_haven_requests (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requester_code   VARCHAR(20) NOT NULL,               -- e.g. 'SH-2026-0042' (no identity)
  pet_species      ENUM('dog','cat') NOT NULL,
  pet_name         VARCHAR(80),
  pet_age_months   INT,
  pet_notes        TEXT,
  crisis_type      ENUM('domestic_violence','hospitalization','eviction','disaster','other')
                     NOT NULL,
  urgency          ENUM('critical','urgent','planned') NOT NULL DEFAULT 'urgent',
  duration_days    INT NOT NULL DEFAULT 14 CHECK (duration_days BETWEEN 1 AND 90),
  status           ENUM('submitted','matched','in_care','reunited','closed')
                     NOT NULL DEFAULT 'submitted',
  case_manager_id  BIGINT UNSIGNED NULL,               -- admin user only
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_haven_admin FOREIGN KEY (case_manager_id)
    REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_haven_code (requester_code),
  KEY idx_haven_status (status)
) ENGINE=InnoDB;

CREATE TABLE crisis_foster_assignments (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  request_id          BIGINT UNSIGNED NOT NULL,
  foster_id           BIGINT UNSIGNED NOT NULL,        -- opted-in crisis foster (user)
  assigned_on         DATE NOT NULL,
  expected_return_on  DATE,
  status              ENUM('assigned','in_care','returned_to_owner','transferred')
                        NOT NULL DEFAULT 'assigned',
  welfare_notes       TEXT,                            -- restricted to case manager
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_havenassign_request FOREIGN KEY (request_id)
    REFERENCES safe_haven_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_havenassign_foster FOREIGN KEY (foster_id)
    REFERENCES users(id) ON DELETE RESTRICT,
  KEY idx_havenassign_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 11b. UNIQUE MODULE U9 — COMMUNITY RESCUE NETWORK 🚨
--      Anyone can report an animal in danger (stuck, injured,
--      abandoned...). Responders claim cases; karma is awarded
--      at each stage via trg_rescue_* logic / app layer.
-- ------------------------------------------------------------

CREATE TABLE rescue_reports (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reporter_id    BIGINT UNSIGNED NULL,                -- NULL = anonymous report
  species        ENUM('dog','cat','other') NOT NULL DEFAULT 'other',
  situation      ENUM('stuck_trapped','injured','road_accident',
                      'drowning_risk','abandoned','abuse_neglect','other')
                   NOT NULL DEFAULT 'other',
  urgency        ENUM('critical','urgent','standard') NOT NULL DEFAULT 'urgent',
  area           VARCHAR(200) NOT NULL,               -- landmark / street description
  description    TEXT NOT NULL,
  status         ENUM('reported','responding','rescued','closed')
                   NOT NULL DEFAULT 'reported',
  resolution     TEXT,                                -- outcome note when closed
  reported_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at      TIMESTAMP NULL,
  CONSTRAINT fk_rescue_reporter FOREIGN KEY (reporter_id)
    REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_rescue_status (status, urgency),
  KEY idx_rescue_reporter (reporter_id),
  KEY idx_rescue_date (reported_at)
) ENGINE=InnoDB;

CREATE TABLE rescue_responders (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rescue_id      BIGINT UNSIGNED NOT NULL,
  responder_id   BIGINT UNSIGNED NOT NULL,
  claimed_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rescueres_rescue FOREIGN KEY (rescue_id)
    REFERENCES rescue_reports(id) ON DELETE CASCADE,
  CONSTRAINT fk_rescueres_user FOREIGN KEY (responder_id)
    REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_responder_once (rescue_id, responder_id)  -- one claim per person
) ENGINE=InnoDB;

-- ============================================================
-- 12. TRIGGERS — keep derived values consistent
-- ============================================================

DELIMITER $$

-- Donation in → campaign total rises
CREATE TRIGGER trg_donation_after_insert
AFTER INSERT ON donations
FOR EACH ROW
BEGIN
  UPDATE donation_campaigns
     SET raised_amount = raised_amount + NEW.amount
   WHERE id = NEW.campaign_id;
END$$

-- Donation deleted (e.g. refund) → total falls, never below zero
CREATE TRIGGER trg_donation_after_delete
AFTER DELETE ON donations
FOR EACH ROW
BEGIN
  UPDATE donation_campaigns
     SET raised_amount = GREATEST(raised_amount - OLD.amount, 0)
   WHERE id = OLD.campaign_id;
END$$

-- First application on an available pet → pet becomes 'pending'
CREATE TRIGGER trg_application_after_insert
AFTER INSERT ON adoption_applications
FOR EACH ROW
BEGIN
  UPDATE pets
     SET status = 'pending'
   WHERE id = NEW.pet_id
     AND status = 'available';
END$$

DELIMITER ;

-- ============================================================
-- 13. VIEWS — ready-made queries for dashboards
-- ============================================================

-- Campaign progress for donation pages & shelter dashboard
CREATE VIEW v_campaign_progress AS
SELECT c.id,
       c.title,
       c.goal_amount,
       c.raised_amount,
       ROUND(IFNULL(c.raised_amount / c.goal_amount, 0) * 100, 1) AS progress_pct,
       COUNT(d.id) AS donor_count
  FROM donation_campaigns c
  LEFT JOIN donations d ON d.campaign_id = c.id
 GROUP BY c.id, c.title, c.goal_amount, c.raised_amount;

-- Public pet listing card data in one shot
CREATE VIEW v_available_pets AS
SELECT p.id,
       p.name,
       p.species,
       p.breed,
       p.age_months,
       p.size,
       p.gender,
       p.energy_level,
       p.good_with_kids,
       p.good_with_dogs,
       p.good_with_cats,
       s.name  AS shelter_name,
       s.city  AS shelter_city,
       (SELECT ph.url
          FROM pet_photos ph
         WHERE ph.pet_id = p.id AND ph.is_primary = TRUE
         LIMIT 1) AS primary_photo
  FROM pets p
  JOIN shelters s ON s.id = p.shelter_id
 WHERE p.status = 'available';

-- Karma leaderboard source
CREATE VIEW v_karma_leaderboard AS
SELECT u.id            AS user_id,
       u.full_name,
       u.avatar_url,
       SUM(k.points)   AS total_karma,
       COUNT(k.id)     AS good_deeds
  FROM users u
  JOIN karma_ledger k ON k.user_id = u.id
 GROUP BY u.id, u.full_name, u.avatar_url;
