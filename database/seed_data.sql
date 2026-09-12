-- ============================================================
--  PetCare — Seed Data (demo dataset, Dhaka-flavored 🇧🇩)
--
--  NOTE: donation_campaigns.raised_amount is intentionally NOT
--  set here — trg_donation_after_insert computes it live from
--  the donation inserts below. Watch the totals appear by magic.
--
--  All demo account passwords: "ChangeMe#2026" (bcrypt placeholder —
--  replace hashes via the app's registration flow in production).
-- ============================================================

USE petcare_db;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Users (12)
-- ------------------------------------------------------------
INSERT INTO users (id, email, password_hash, role, full_name, phone, city) VALUES
(1,  'admin@petcarebd.org',        '$2y$10$ChangeMeViaAppRegistration', 'admin',   'PetCare Admin',      '+8801700000001', 'Dhaka'),
(2,  'nusrat@pawfecthaven.org',    '$2y$10$ChangeMeViaAppRegistration', 'shelter', 'Nusrat Jahan',       '+8801700000002', 'Dhaka'),
(3,  'rafiq@streetpaws.org',       '$2y$10$ChangeMeViaAppRegistration', 'shelter', 'Rafiq Islam',        '+8801700000003', 'Dhaka'),
(4,  'dr.fahim@careandcure.com',   '$2y$10$ChangeMeViaAppRegistration', 'vet',     'Dr. Fahim Rahman',   '+8801700000004', 'Dhaka'),
(5,  'dr.shila@bdanimalhosp.com',  '$2y$10$ChangeMeViaAppRegistration', 'vet',     'Dr. Shila Begum',    '+8801700000005', 'Dhaka'),
(6,  'dr.imran@petcareplus.com',   '$2y$10$ChangeMeViaAppRegistration', 'vet',     'Dr. Imran Kabir',    '+8801700000006', 'Dhaka'),
(7,  'sara.chowdhury@gmail.com',   '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Sara Chowdhury',     '+8801800000001', 'Dhaka'),
(8,  'tanvir.ahmed@gmail.com',     '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Tanvir Ahmed',       '+8801800000002', 'Dhaka'),
(9,  'mitu.akter@gmail.com',       '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Mitu Akter',         '+8801800000003', 'Dhaka'),
(10, 'jenny.fernandes@gmail.com',  '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Jenny Fernandes',    '+8801800000004', 'Dhaka'),
(11, 'rashed.karim@gmail.com',     '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Rashed Karim',       '+8801800000005', 'Dhaka'),
(12, 'farhana.yasmin@gmail.com',   '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Farhana Yasmin',     '+8801800000006', 'Dhaka');

-- ------------------------------------------------------------
-- Shelters & Vet Clinics
-- ------------------------------------------------------------
INSERT INTO shelters (id, user_id, name, description, license_number, address, city, latitude, longitude, capacity, verified) VALUES
(1, 2, 'Pawfect Haven Rescue', 'A volunteer-run rescue shelter rehoming street dogs and cats since 2019. We believe every deshi dog deserves a sofa.', 'DAWSH-2019-0142', 'House 42, Road 12, Dhanmondi', 'Dhaka', 23.7508542, 90.3774821, 120, TRUE),
(2, 3, 'Dhaka Street Paws Foundation', 'Large no-kill shelter focusing on community animal welfare, vaccination drives and adoptions across Uttara.', 'DAWSH-2021-0311', 'Block C, Sector 7, Uttara', 'Dhaka', 23.8681000, 90.3998000, 200, TRUE);

INSERT INTO vet_clinics (id, user_id, name, address, city, area, phone, latitude, longitude, opening_hours, services, emergency_service, low_cost, verified) VALUES
(1, 4, 'Care & Cure Veterinary Clinic', 'Road 41, Gulshan 2', 'Dhaka', 'Gulshan', '+880290000001', 23.7925000, 90.4148000, 'Sat-Thu 9:00-21:00, Fri 15:00-20:00', 'surgery,vaccination,blood bank,dental,diagnostics', TRUE,  FALSE, TRUE),
(2, 5, 'Bangladesh Animal Hospital', 'House 11, Road 55, Banani', 'Dhaka', 'Banani', '+880290000002', 23.7936000, 90.4043000, 'Daily 8:00-22:00 (24h emergency)', 'emergency care,surgery,x-ray,vaccination,microchipping', TRUE,  FALSE, TRUE),
(3, 6, 'PetCare Plus Vet Clinic', 'Ring Road, Mirpur 10', 'Dhaka', 'Mirpur', '+880290000003', 23.8069000, 90.3686000, 'Sat-Thu 10:00-19:00', 'vaccination,neutering subsidies,general checkup,low-cost spay/neuter', FALSE, TRUE, FALSE);

-- ------------------------------------------------------------
-- Pets (10) — the stars of the show
-- ------------------------------------------------------------
INSERT INTO pets (id, shelter_id, name, species, breed, age_months, size, gender, vaccinated, neutered, good_with_kids, good_with_dogs, good_with_cats, energy_level, medical_history, story, status, admission_date) VALUES
(1,  1, 'Max',    'dog', 'Deshi mix',           24, 'medium', 'male',   TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  'high',   'Left hind leg fractured in a road accident (Nov 2025). Surgery completed Jan 2026 — fully healed, vet cleared.', 'Rescued from the Airport Road median with a broken leg and a wagging tail. Max never stopped trusting people. He will zoom, then nap on your feet.', 'available', '2025-11-02'),
(2,  1, 'Mishti', 'cat', 'Persian mix',         12, 'small',  'female', TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  'low',    'Healthy. Full vaccination course complete.', 'Found as a kitten behind a Dhanmondi sweet shop, she decided humans exist to serve her. Gentle, quiet, occasionally dramatic.', 'available', '2026-02-14'),
(3,  1, 'Tommy',  'dog', 'Golden Retriever mix', 36, 'large',  'male',   TRUE,  TRUE,  TRUE,  TRUE,  FALSE, 'high',   'Healthy. Mild seasonal skin allergy — managed with diet.', 'Surrendered by a family moving abroad. Tommy knows sit, paw and heartbreak. Best friend material for an active family.', 'available', '2026-03-01'),
(4,  1, 'Sheru',  'dog', 'German Shepherd',     48, 'large',  'male',   TRUE,  TRUE,  TRUE,  FALSE, FALSE, 'high',   'Healthy. Hip x-rays clear.', 'Ex-guard dog who decided guarding is overrated. Loyal, smart, needs a confident human. One application under review!', 'pending',   '2026-01-20'),
(5,  1, 'Minnie', 'cat', 'Domestic Short Hair',  6, 'small',  'female', TRUE,  FALSE, TRUE,  TRUE,  TRUE,  'medium', 'Healthy. Spay scheduled this month.', 'Pocket-sized chaos gremlin. Will steal your hair ties and your heart.', 'available', '2026-07-10'),
(6,  2, 'Rani',   'dog', 'Deshi',               18, 'medium', 'female', TRUE,  TRUE,  TRUE,  TRUE,  FALSE, 'medium', 'Treated for tick fever (Jun 2026), fully recovered.', 'Street-smart and people-soft. Rani was fed daily by a tea stall owner until she followed him to work one day too many. Currently on a foster trial!', 'available', '2026-06-15'),
(7,  2, 'Bagha',  'cat', 'Tabby',               30, 'medium', 'male',   TRUE,  TRUE,  FALSE, FALSE, TRUE,  'low',    'Healthy senior-ish gentleman. Dental cleaned Feb 2026.', 'The philosopher of Shelter 2 rooftop. Not a lap cat — a companion cat. Sponsored virtually by his fan club.', 'available', '2025-12-05'),
(8,  1, 'Pihu',   'cat', 'Siamese mix',          9, 'small',  'female', TRUE,  FALSE, TRUE,  TRUE,  TRUE,  'medium', 'Recovered from panleukopenia (Feb 2026) — strong immunity now. On medical hold until final weight check.', 'Fought panleukopenia like a tiger and won. Chatty, opinionated, worth the wait.', 'medical_hold', '2026-02-01'),
(9,  2, 'Kalu',   'dog', 'Deshi',               60, 'medium', 'male',   TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  'low',    'Mild arthritis — managed with supplements. Senior health panels all green.', 'Five years old and still waiting. Kalu is the shelter grandfather: calm, gentle, house-trained, endlessly kind with puppies and humans alike.', 'available', '2025-09-30'),
(10, 2, 'Snowy',  'dog', 'Samoyed mix',         15, 'medium', 'female', TRUE,  FALSE, TRUE,  TRUE,  TRUE,  'high',   'Healthy. Spay appointment pending in Chattogram.', 'Born at the shelter, adopted-in-spirit by a family in Chattogram. Now she just needs the ride — transport relay legs are open!', 'available', '2025-08-12');

INSERT INTO pet_photos (pet_id, url, caption, is_primary) VALUES
(1,  'https://images.petcarebd.demo/pets/max-1.jpg',    'Max smiling post-recovery', TRUE),
(1,  'https://images.petcarebd.demo/pets/max-2.jpg',    'Zoomies at the shelter yard', FALSE),
(2,  'https://images.petcarebd.demo/pets/mishti-1.jpg',  'Mishti judging everyone', TRUE),
(3,  'https://images.petcarebd.demo/pets/tommy-1.jpg',  'Tommy with his favorite ball', TRUE),
(4,  'https://images.petcarebd.demo/pets/sheru-1.jpg',   'Sheru on duty (retired)', TRUE),
(5,  'https://images.petcarebd.demo/pets/minnie-1.jpg',  'Minnie in a teacup', TRUE),
(6,  'https://images.petcarebd.demo/pets/rani-1.jpg',    'Rani at the tea stall', TRUE),
(7,  'https://images.petcarebd.demo/pets/bagha-1.jpg',   'Bagha contemplating existence', TRUE),
(8,  'https://images.petcarebd.demo/pets/pihu-1.jpg',    'Pihu telling her story loudly', TRUE),
(9,  'https://images.petcarebd.demo/pets/kalu-1.jpg',    'Kalu supervising puppies', TRUE),
(10, 'https://images.petcarebd.demo/pets/snowy-1.jpg',   'Snowy ready for the road trip', TRUE);

INSERT INTO pet_tags (pet_id, tag) VALUES
(1,'playful'),(1,'affectionate'),(1,'loyal'),
(2,'shy'),(2,'gentle'),(2,'quiet'),
(3,'energetic'),(3,'playful'),(3,'trained'),
(4,'protective'),(4,'smart'),(4,'loyal'),
(5,'playful'),(5,'curious'),
(6,'gentle'),(6,'street-smart'),(6,'affectionate'),
(7,'independent'),(7,'calm'),(7,'philosophical'),
(8,'chatty'),(8,'resilient'),(8,'affectionate'),
(9,'calm'),(9,'gentle'),(9,'senior-friendly'),(9,'house-trained'),
(10,'playful'),(10,'travel-ready');

-- ------------------------------------------------------------
-- Adoption applications (M1)
-- ------------------------------------------------------------
INSERT INTO adoption_applications (pet_id, applicant_id, status, message, home_type, has_pet_experience, decision_note, decided_at) VALUES
(2, 7,  'approved',     'I have wanted a calm companion cat for two years. My apartment is fully cat-proofed and I work from home.', 'apartment', TRUE, 'Wonderful match — home visit scheduled Saturday. Welcome, Mishti!', '2026-08-20 14:30:00'),
(4, 11, 'under_review', 'I grew up with German Shepherds and currently have a house with a large yard in Bashundhara.', 'house_with_yard', TRUE, NULL, NULL);

-- ------------------------------------------------------------
-- Campaigns & donations (M2)
-- raised_amount updates itself via trigger as donations insert!
-- ------------------------------------------------------------
INSERT INTO donation_campaigns (id, shelter_id, pet_id, title, description, goal_amount, currency, status, starts_at, ends_at) VALUES
(1, 1, 1,    "Max's Fracture Surgery Fund", 'Max was hit by a car on Airport Road. Surgery, implants and physiotherapy cost 1,50,000 BDT. Every taka goes to the clinic directly.', 150000.00, 'BDT', 'active',    '2025-11-05', '2026-10-31'),
(2, 1, 8,    'Emergency Treatment for Pihu', 'Pihu contracted panleukopenia at 7 months old. ICU, IV fluids and round-the-clock care saved her life.', 60000.00, 'BDT', 'completed', '2026-02-01', '2026-03-15'),
(3, 2, NULL, 'Winter Blanket Drive for 200 Streeties', 'Dhaka winters are brutal for community animals. Help us buy 200 thermal blankets before December.', 50000.00, 'BDT', 'active',    '2026-09-01', '2026-11-30'),
(4, 2, NULL, 'Vaccination Drive — Ramna Park Strays', 'Rabies vaccination + deworming for 150 community dogs around Ramna Park. 500 BDT protects one life.', 80000.00, 'BDT', 'active',    '2026-09-10', '2026-12-15');

INSERT INTO donations (campaign_id, donor_id, amount, message, anonymous, payment_method) VALUES
(1, 8,    25000.00, 'For Max — get well soon buddy! 🐕', FALSE, 'bkash'),
(1, 9,    10000.00, 'Healing vibes from Mitu & Milky',  FALSE, 'nagad'),
(1, NULL,  5000.00, '',                                  TRUE,  'card'),
(1, 12,   42500.00, 'Saw Max story on the feed. Finish this, team!', FALSE, 'bank'),
(2, 8,    35000.00, 'Save the little fighter!',          FALSE, 'bkash'),
(2, 9,    25000.00, 'Pihu you owe me nine lives.',       FALSE, 'bkash'),
(3, 9,     3000.00, 'Ten blankets from me. Stay warm, streeties.', FALSE, 'bkash'),
(3, 8,     2000.00, NULL,                                FALSE, 'cash'),
(4, 12,   15000.00, 'Protecting 30 dogs in my father''s memory.', FALSE, 'bkash'),
(4, 8,     2500.00, 'Five lives vaccinated 🎉',          FALSE, 'bkash');

INSERT INTO shelter_wish_items (shelter_id, item_name, category, quantity_needed, quantity_fulfilled, unit_cost, priority) VALUES
(1, 'Dog food 30kg sacks',        'food',      20,  12,  4500.00, 'high'),
(1, 'Deworming tablets (strip)',  'medical',   100, 60,    25.00, 'medium'),
(1, 'Large cleaning disinfectant','cleaning',  30,  10,   320.00, 'low'),
(2, 'Thermal blankets',           'other',     200, 145,  NULL,    'high'),
(2, 'Puppy milk replacer tins',   'food',      40,  22,   850.00, 'high');

-- ------------------------------------------------------------
-- Vet care (M3)
-- ------------------------------------------------------------
INSERT INTO vet_reviews (clinic_id, user_id, rating, comment) VALUES
(1, 7,  5, 'Dr. Fahim operated on Max — gave us updates at every step. Facility is spotless.'),
(1, 8,  4, 'Excellent care, slightly long wait on Fridays. Blood bank on site is a lifesaver.'),
(2, 9,  5, '24h emergency actually means 24h. They saved Pihu at 3 AM.'),
(3, 10, 4, 'Low-cost neutering for streeties — they even do community animal discounts.');

INSERT INTO pet_medical_reminders (user_id, pet_name, reminder_type, notes, due_date) VALUES
(7,  'Mishti', 'vaccine',   'Rabies booster — Care & Cure, ask for Dr. Fahim',  '2026-10-05'),
(8,  'Rocky',  'deworming', 'Quarterly deworming dose (10kg tab)',               '2026-09-30'),
(12, 'Piya',   'vet_visit', 'Annual checkup + dental look',                      '2026-09-20');

-- ------------------------------------------------------------
-- U1 — Pet Blood Bank
-- ------------------------------------------------------------
INSERT INTO pet_blood_donors (user_id, pet_name, species, breed, blood_type, weight_kg, last_donation_date, vaccination_current, preferred_clinic_id, is_active) VALUES
(8,  'Bruno', 'dog', 'Deshi mix',  'DEA 1.1-', 28.50, '2026-07-14', TRUE, 1, TRUE),
(9,  'Milky', 'cat', 'Persian',    'A',         4.50, '2026-08-02', TRUE, 1, TRUE),
(10, 'Rex',   'dog', 'Labrador',   'DEA 1.1+', 32.00, '2026-09-01', TRUE, 2, TRUE),
(7,  'Coco',  'dog', 'Cocker mix', 'DEA 1.1-', 26.00, '2026-05-20', TRUE, 1, FALSE);  -- moved to Chattogram

INSERT INTO blood_requests (clinic_id, species, blood_type, urgency, units_needed, patient_note, status, deadline) VALUES
(1, 'dog', 'DEA 1.1-', 'critical', 2, '3-year-old deshi dog, post-op transfusion needed tonight. Patient stable but bleeding continues.', 'open', '2026-09-12 23:59:00');

-- ------------------------------------------------------------
-- U2 — Lost & Found
-- ------------------------------------------------------------
INSERT INTO lost_pet_reports (reporter_id, pet_name, species, breed, color, description, last_seen_area, last_seen_lat, last_seen_lng, photo_url, microchip_number, lost_on, status) VALUES
(7, 'Simba', 'cat', 'Orange tabby', 'orange', 'Very friendly orange tabby with a notch on left ear. Answers to Simba, loves chipped rice.', 'Dhanmondi Lake area, Road 27', 23.7551, 90.3762, 'https://images.petcarebd.demo/lost/simba-1.jpg', NULL, '2026-08-28', 'searching');

INSERT INTO found_pet_reports (finder_id, shelter_id, species, breed, color, description, found_area, found_lat, found_lng, photo_url, found_on, current_status) VALUES
(10, NULL, 'cat', 'Orange tabby', 'orange', 'Sweet orange tabby found limping slightly. Notched left ear? Not sure. Very hungry, very cuddly.', 'Dhanmondi 27 near lake gate', 23.7549, 90.3758, 'https://images.petcarebd.demo/found/orange-1.jpg', '2026-08-30', 'with_finder');

INSERT INTO lost_found_matches (lost_report_id, found_report_id, match_score, status) VALUES
(1, 1, 87.50, 'suggested');

-- ------------------------------------------------------------
-- U3 — Karma & Impact Ledger
-- ------------------------------------------------------------
INSERT INTO karma_ledger (user_id, action_type, reference_type, reference_id, points, note) VALUES
(8,  'donation',      'donations', 1, 250, 'Max surgery fund'),
(8,  'donation',      'donations', 5, 350, 'Pihu ICU fund'),
(8,  'donation',      'donations', 8,  20, 'Blanket drive'),
(8,  'donation',      'donations', 10, 25, 'Vaccination drive'),
(8,  'review',        'vet_reviews', 2, 10, 'Care & Cure review'),
(9,  'donation',      'donations', 2, 100, 'Max surgery fund'),
(9,  'donation',      'donations', 6, 250, 'Pihu ICU fund'),
(9,  'donation',      'donations', 7,  30, 'Blanket drive'),
(9,  'blood_donation','pet_blood_donors', 2, 50, 'Registered Milky as donor'),
(12, 'donation',      'donations', 4, 425, 'Max surgery fund'),
(12, 'donation',      'donations', 9, 150, 'Vaccination drive — memorial gift'),
(7,  'adoption',      'adoption_applications', 1, 200, 'Adopted Mishti'),
(7,  'review',        'vet_reviews', 1, 10, 'Care & Cure review'),
(10, 'blood_donation','pet_blood_donors', 3, 50, 'Registered Rex as donor'),
(10, 'lost_found_help','found_pet_reports', 1, 100, 'Reported found orange tabby');

INSERT INTO rewards_catalog (id, title, description, partner_name, category, cost_points, stock, is_active) VALUES
(1, 'Free vet checkup',                'One complete wellness checkup for any pet.',       'Care & Cure Veterinary Clinic', 'vet_discount',  300, 50,   TRUE),
(2, '15% off pet food',                'One-time discount on any pet food purchase.',      'PawMart Dhanmondi',             'pet_store',     150, NULL, TRUE),
(3, 'Donate 5 shelter meals',          'We deliver 5 meals to a shelter pet in your name.','PetCare Network',               'meal_donation', 100, NULL, TRUE),
(4, 'PetCare tote + sticker pack',     'Official merch to show your rescue pride.',        'PetCare Network',               'merchandise',   500, 20,   TRUE);

INSERT INTO karma_redemptions (user_id, reward_id, points_spent, status, voucher_code) VALUES
(8,  3, 100, 'delivered', 'PMC-X7Q2-9K'),
(12, 1, 300, 'requested', NULL);

-- ------------------------------------------------------------
-- U4 — Foster-to-Adopt Bridge
-- ------------------------------------------------------------
INSERT INTO compatibility_profiles (user_id, home_type, has_yard, work_hours_per_day, activity_level, has_children, has_dogs, has_cats, allergies, preferred_species, preferred_energy, monthly_budget, experience_level) VALUES
(7,  'apartment',       FALSE, 8, 'medium', FALSE, FALSE, FALSE, NULL,                  'cat', 'low',    5000.00, 'some'),
(11, 'house_with_yard', TRUE,  6, 'high',   FALSE, FALSE, FALSE, 'Mild — antihistamines ready', 'dog', 'high', 8000.00, 'experienced');

INSERT INTO foster_trials (pet_id, adopter_id, started_on, ends_on, status, feedback) VALUES
(6, 11, '2026-09-05', '2026-09-12', 'active', NULL);

-- ------------------------------------------------------------
-- U5 — Rescue Transport Relay
-- ------------------------------------------------------------
INSERT INTO transport_missions (id, shelter_id, pet_id, title, origin_city, destination_city, distance_km, needed_on, status, notes) VALUES
(1, 2, 10, 'Snowy''s ride home: Uttara → Chattogram', 'Uttara', 'Chattogram', 264, '2026-09-20', 'legs_open', 'Adopter family confirmed in Chattogram. Spay appointment arranged there. Needs air-conditioned legs.');

INSERT INTO transport_legs (mission_id, leg_number, from_city, to_city, distance_km, needed_on, driver_id, status) VALUES
(1, 1, 'Uttara',    'Gazipur',    40,  '2026-09-20', NULL,     'open'),
(1, 2, 'Gazipur',   'Comilla',    130, '2026-09-20', 10,       'claimed'),
(1, 3, 'Comilla',   'Chattogram', 95,  '2026-09-20', NULL,     'open');

-- ------------------------------------------------------------
-- U6 — Virtual Fostering
-- ------------------------------------------------------------
INSERT INTO virtual_fosterings (user_id, pet_id, monthly_amount, status, started_on) VALUES
(12, 9, 300.00, 'active', '2026-06-01'),
(9,  7, 200.00, 'active', '2026-07-15');

INSERT INTO pet_updates (pet_id, posted_by, update_type, title, content, media_url) VALUES
(9, 2, 'letter',   'Kalu wrote to Farhana',  'Dear Farhana (my hero)! Today I supervised the puppy yard for two hours, then took my favorite sunbeam nap. My joints feel great with the new supplements. Come visit anytime — I will save you the shady bench. Love, Kalu 🐾', NULL),
(9, 2, 'photo',    'Sunday bath day',        'Kalu post-bath, smelling of lavender and dignity.', 'https://images.petcarebd.demo/updates/kalu-bath.jpg'),
(9, 2, 'medical',  'September health panel', 'Arthritis stable. Weight 21.4kg. Bloodwork perfect for a 5-year-old gentleman.', NULL),
(7, 3, 'photo',    'Bagha''s rooftop office','Bagha reviewing the sunset from HQ. Sponsored by his fan club — thank you Mitu!', 'https://images.petcarebd.demo/updates/bagha-rooftop.jpg');

-- ------------------------------------------------------------
-- U7 — Emergency Safe Haven (privacy-first: NO user identity)
-- ------------------------------------------------------------
INSERT INTO safe_haven_requests (requester_code, pet_species, pet_name, pet_age_months, pet_notes, crisis_type, urgency, duration_days, status, case_manager_id) VALUES
('SH-2026-0042', 'cat', 'Jhumka', 18, 'Indoor cat, litter-trained, shy at first. Vet records available on request.', 'domestic_violence', 'critical', 30, 'in_care',   1),
('SH-2026-0044', 'dog', 'Laddu',  36, 'Friendly deshi dog, walks well on leash, needs daily medication (thyroid).', 'hospitalization', 'planned', 14, 'submitted', NULL);

INSERT INTO crisis_foster_assignments (request_id, foster_id, assigned_on, expected_return_on, status, welfare_notes) VALUES
(1, 10, '2026-09-08', '2026-10-08', 'in_care', 'Jhumka settled well by day 3. Eating fully, using litter box. Jenny reports she purrs at 6 AM sharp. Handled under case SH-2026-0042 — access restricted to case manager.');

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Sanity check — watch the trigger-maintained totals
-- ------------------------------------------------------------
SELECT c.title, c.goal_amount, c.raised_amount,
       ROUND(c.raised_amount / c.goal_amount * 100, 1) AS pct
  FROM donation_campaigns c;
