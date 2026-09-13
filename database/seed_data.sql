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
(12, 'farhana.yasmin@gmail.com',   '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Farhana Yasmin',     '+8801800000006', 'Dhaka'),
-- Community donors 13-31 — realistic small-gift donors (avg ৳1,264, max ৳7,500)
(13, 'nafis.rahman@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Nafis Rahman', '+8801810000013', 'Dhaka'),
(14, 'priya.das@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Priya Das', '+8801810000014', 'Dhaka'),
(15, 'shakib.al.hasan@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Shakib Al Hasan', '+8801810000015', 'Dhaka'),
(16, 'nusrat.ema@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Nusrat Ema', '+8801810000016', 'Dhaka'),
(17, 'imran.hossain@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Imran Hossain', '+8801810000017', 'Dhaka'),
(18, 'tahsin.khan@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Tahsin Khan', '+8801810000018', 'Dhaka'),
(19, 'rumana.malik@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Rumana Malik', '+8801810000019', 'Dhaka'),
(20, 'arif.chowdhury@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Arif Chowdhury', '+8801810000020', 'Dhaka'),
(21, 'sumaiya.haque@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Sumaiya Haque', '+8801810000021', 'Dhaka'),
(22, 'kabir.andalib@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Kabir Andalib', '+8801810000022', 'Dhaka'),
(23, 'lubna.mariam@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Lubna Mariam', '+8801810000023', 'Dhaka'),
(24, 'zubair.rahman@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Zubair Rahman', '+8801810000024', 'Dhaka'),
(25, 'anika.tabassum@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Anika Tabassum', '+8801810000025', 'Dhaka'),
(26, 'sajid.bappi@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Sajid Bappi', '+8801810000026', 'Dhaka'),
(27, 'mehjabin.karim@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Mehjabin Karim', '+8801810000027', 'Dhaka'),
(28, 'chowdhury.family@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Chowdhury family', '+8801810000028', 'Dhaka'),
(29, 'pawmart.dhanmondi@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'PawMart Dhanmondi', '+8801810000029', 'Dhaka'),
(30, 'uiu.rotaract.club@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'UIU Rotaract Club', '+8801810000030', 'Dhaka'),
(31, 'gulshan.book.club@gmail.com', '$2y$10$ChangeMeViaAppRegistration', 'adopter', 'Gulshan Book Club', '+8801810000031', 'Dhaka');

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
(3,  1, 'Tommy',  'dog', 'Deshi mix',           36, 'large',  'male',   TRUE,  TRUE,  TRUE,  TRUE,  FALSE, 'high',   'Healthy. Mild seasonal skin allergy — managed with diet.', 'Surrendered by a family moving abroad. Tommy knows sit, paw and heartbreak. Best friend material for an active family.', 'available', '2026-03-01'),
(4,  1, 'Sheru',  'dog', 'Deshi mix',           48, 'large',  'male',   TRUE,  TRUE,  TRUE,  FALSE, FALSE, 'high',   'Healthy. Hip x-rays clear.', 'Ex-guard dog who decided guarding is overrated. Loyal, smart, needs a confident human. One application under review!', 'pending',   '2026-01-20'),
(5,  1, 'Minnie', 'cat', 'Domestic Short Hair',  6, 'small',  'female', TRUE,  FALSE, TRUE,  TRUE,  TRUE,  'medium', 'Healthy. Spay scheduled this month.', 'Pocket-sized chaos gremlin. Will steal your hair ties and your heart.', 'available', '2026-07-10'),
(6,  2, 'Rani',   'dog', 'Deshi',               18, 'medium', 'female', TRUE,  TRUE,  TRUE,  TRUE,  FALSE, 'medium', 'Treated for tick fever (Jun 2026), fully recovered.', 'Street-smart and people-soft. Rani was fed daily by a tea stall owner until she followed him to work one day too many. Currently on a foster trial!', 'available', '2026-06-15'),
(7,  2, 'Bagha',  'cat', 'Tabby',               30, 'medium', 'male',   TRUE,  TRUE,  FALSE, FALSE, TRUE,  'low',    'Healthy senior-ish gentleman. Dental cleaned Feb 2026.', 'The philosopher of Shelter 2 rooftop. Not a lap cat — a companion cat. Sponsored virtually by his fan club.', 'available', '2025-12-05'),
(8,  1, 'Pihu',   'cat', 'Deshi mix',            9, 'small',  'female', TRUE,  FALSE, TRUE,  TRUE,  TRUE,  'medium', 'Recovered from panleukopenia (Feb 2026) — strong immunity now. On medical hold until final weight check.', 'Fought panleukopenia like a tiger and won. Chatty, opinionated, worth the wait.', 'medical_hold', '2026-02-01'),
(9,  2, 'Kalu',   'dog', 'Deshi',               60, 'medium', 'male',   TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  'low',    'Mild arthritis — managed with supplements. Senior health panels all green.', 'Five years old and still waiting. Kalu is the shelter grandfather: calm, gentle, house-trained, endlessly kind with puppies and humans alike.', 'available', '2025-09-30'),
(10, 2, 'Snowy',  'dog', 'Deshi mix',           15, 'medium', 'female', TRUE,  FALSE, TRUE,  TRUE,  TRUE,  'high',   'Healthy. Spay appointment pending in Chattogram.', 'Born at the shelter, adopted-in-spirit by a family in Chattogram. Now she just needs the ride — transport relay legs are open!', 'available', '2025-08-12');

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
(1, 11, 50.00, 'Max deserves the best', FALSE, 'nagad'), -- #1 2025-11-06 · Rashed Karim
(1, 10, 100.00, 'For Max''s surgery — go buddy!', FALSE, 'bkash'), -- #2 2025-11-08 · Jenny Fernandes
(1, 8, 600.00, 'In memory of my late Tommy', FALSE, 'card'), -- #3 2025-11-10 · Tanvir Ahmed
(1, 9, 150.00, 'For Max''s surgery — go buddy!', FALSE, 'bank'), -- #4 2025-11-11 · Mitu Akter
(1, 12, 7500.00, NULL, FALSE, 'nagad'), -- #5 2025-11-12 · Farhana Yasmin
(1, 28, 1500.00, NULL, FALSE, 'nagad'), -- #6 2025-11-15 · Chowdhury family
(1, NULL, 3000.00, 'Get well soon, Max!', TRUE, 'bkash'), -- #7 2025-11-18 anon
(1, NULL, 3000.00, 'Every little bit counts', TRUE, 'bkash'), -- #8 2025-11-21 anon
(1, 23, 1250.00, NULL, FALSE, 'nagad'), -- #9 2025-12-03 · Lubna Mariam
(1, 15, 300.00, 'Max deserves the best', FALSE, 'bkash'), -- #10 2025-12-05 · Shakib Al Hasan
(1, 8, 600.00, 'For Max''s surgery — go buddy!', FALSE, 'nagad'), -- #11 2025-12-07 · Tanvir Ahmed
(1, 9, 3000.00, 'In memory of my late Tommy', FALSE, 'nagad'), -- #12 2025-12-12 · Mitu Akter
(1, 12, 800.00, 'Salute to the volunteers', FALSE, 'bank'), -- #13 2025-12-23 · Farhana Yasmin
(1, 29, 500.00, NULL, FALSE, 'card'), -- #14 2025-12-24 · PawMart Dhanmondi
(1, 8, 100.00, NULL, FALSE, 'nagad'), -- #15 2026-01-09 · Tanvir Ahmed
(1, 9, 900.00, NULL, FALSE, 'nagad'), -- #16 2026-01-09 · Mitu Akter
(1, 16, 3000.00, 'Go team PetCare!', FALSE, 'bank'), -- #17 2026-01-12 · Nusrat Ema
(1, 13, 850.00, 'Keep up the amazing work', FALSE, 'bank'), -- #18 2026-01-14 · Nafis Rahman
(1, 27, 1900.00, 'Get well soon, Max!', FALSE, 'cash'), -- #19 2026-01-14 · Mehjabin Karim
(1, 11, 2500.00, 'This platform is a blessing', FALSE, 'bank'), -- #20 2026-01-18 · Rashed Karim
(1, 10, 5000.00, 'Every little bit counts', FALSE, 'bkash'), -- #21 2026-01-23 · Jenny Fernandes
(1, 15, 250.00, 'In memory of my late Tommy', FALSE, 'bkash'), -- #22 2026-02-01 · Shakib Al Hasan
(1, 31, 300.00, 'Max deserves the best', FALSE, 'nagad'), -- #23 2026-02-01 · Gulshan Book Club
(1, 8, 600.00, 'Shared with my office group chat', FALSE, 'bkash'), -- #24 2026-02-02 · Tanvir Ahmed
(1, 12, 400.00, 'Keep up the amazing work', FALSE, 'bkash'), -- #25 2026-02-03 · Farhana Yasmin
(2, 12, 2400.00, 'ICU bills are brutal — hang in there', FALSE, 'cash'), -- #26 2026-02-04 · Farhana Yasmin
(2, 9, 400.00, 'Prayers and taka, both sent', FALSE, 'bkash'), -- #27 2026-02-05 · Mitu Akter
(2, 10, 500.00, NULL, FALSE, 'bkash'), -- #28 2026-02-05 · Jenny Fernandes
(2, 8, 400.00, 'Save the little fighter!', FALSE, 'bank'), -- #29 2026-02-07 · Tanvir Ahmed
(2, 20, 3000.00, 'ICU bills are brutal — hang in there', FALSE, 'bkash'), -- #30 2026-02-07 · Arif Chowdhury
(2, 15, 100.00, 'For Pihu''s ICU bill', FALSE, 'card'), -- #31 2026-02-08 · Shakib Al Hasan
(2, 22, 300.00, NULL, FALSE, 'card'), -- #32 2026-02-09 · Kabir Andalib
(2, 11, 3000.00, 'Healing vibes', FALSE, 'nagad'), -- #33 2026-02-09 · Rashed Karim
(1, 13, 5000.00, NULL, FALSE, 'card'), -- #34 2026-02-09 · Nafis Rahman
(2, 29, 100.00, 'Pihu, you owe me nine lives', FALSE, 'bkash'), -- #35 2026-02-10 · PawMart Dhanmondi
(2, NULL, 400.00, 'Please post more updates', TRUE, 'card'), -- #36 2026-02-10 anon
(2, 22, 3000.00, 'Pihu, you owe me nine lives', FALSE, 'cash'), -- #37 2026-02-12 · Kabir Andalib
(2, 31, 300.00, NULL, FALSE, 'bkash'), -- #38 2026-02-13 · Gulshan Book Club
(2, 14, 150.00, 'From me and my cat Milo', FALSE, 'bkash'), -- #39 2026-02-13 · Priya Das
(1, 9, 1150.00, 'Get well soon, Max!', FALSE, 'nagad'), -- #40 2026-02-14 · Mitu Akter
(2, 20, 1500.00, 'ICU bills are brutal — hang in there', FALSE, 'bkash'), -- #41 2026-02-15 · Arif Chowdhury
(2, 19, 3000.00, NULL, FALSE, 'bkash'), -- #42 2026-02-16 · Rumana Malik
(1, 13, 350.00, NULL, FALSE, 'cash'), -- #43 2026-02-18 · Nafis Rahman
(1, 18, 50.00, 'Get well soon, Max!', FALSE, 'bkash'), -- #44 2026-02-19 · Tahsin Khan
(2, 22, 3000.00, 'ICU bills are brutal — hang in there', FALSE, 'bkash'), -- #45 2026-02-20 · Kabir Andalib
(2, 21, 2350.00, 'Shared with my office group chat', FALSE, 'bkash'), -- #46 2026-02-21 · Sumaiya Haque
(1, 24, 3000.00, 'My family''s monthly pledge', FALSE, 'bkash'), -- #47 2026-02-21 · Zubair Rahman
(2, 19, 600.00, 'Found you through the Insta page', FALSE, 'bkash'), -- #48 2026-02-22 · Rumana Malik
(2, 22, 1500.00, 'Donated on behalf of my students', FALSE, 'nagad'), -- #49 2026-02-23 · Kabir Andalib
(2, 28, 250.00, 'Save the little fighter!', FALSE, 'bank'), -- #50 2026-02-23 · Chowdhury family
(2, 14, 3000.00, 'ICU bills are brutal — hang in there', FALSE, 'bkash'), -- #51 2026-02-24 · Priya Das
(2, 19, 700.00, 'Small help from a student', FALSE, 'card'), -- #52 2026-02-24 · Rumana Malik
(1, 8, 200.00, 'Get well soon, Max!', FALSE, 'nagad'), -- #53 2026-02-26 · Tanvir Ahmed
(2, 21, 7500.00, 'This platform is a blessing', FALSE, 'cash'), -- #54 2026-02-26 · Sumaiya Haque
(2, NULL, 1500.00, 'This platform is a blessing', TRUE, 'bkash'), -- #55 2026-02-27 anon
(2, 23, 300.00, NULL, FALSE, 'cash'), -- #56 2026-02-28 · Lubna Mariam
(2, 19, 3000.00, 'For Pihu''s ICU bill', FALSE, 'bkash'), -- #57 2026-03-03 · Rumana Malik
(2, 8, 2250.00, NULL, FALSE, 'bkash'), -- #58 2026-03-04 · Tanvir Ahmed
(2, 18, 250.00, 'Small help from a student', FALSE, 'bkash'), -- #59 2026-03-04 · Tahsin Khan
(2, 16, 250.00, 'Every little bit counts', FALSE, 'bank'), -- #60 2026-03-04 · Nusrat Ema
(2, 13, 3000.00, 'Found you through the Insta page', FALSE, 'card'), -- #61 2026-03-05 · Nafis Rahman
(2, NULL, 450.00, 'Shared with my office group chat', TRUE, 'cash'), -- #62 2026-03-06 anon
(2, 27, 3000.00, 'Donated on behalf of my students', FALSE, 'bkash'), -- #63 2026-03-07 · Mehjabin Karim
(2, 26, 750.00, 'ICU bills are brutal — hang in there', FALSE, 'bank'), -- #64 2026-03-07 · Sajid Bappi
(2, 24, 1200.00, NULL, FALSE, 'bkash'), -- #65 2026-03-09 · Zubair Rahman
(2, 9, 600.00, NULL, FALSE, 'bank'), -- #66 2026-03-09 · Mitu Akter
(2, NULL, 200.00, 'Sorry I can''t give more this month', TRUE, 'bkash'), -- #67 2026-03-10 anon
(2, 25, 200.00, 'Prayers and taka, both sent', FALSE, 'card'), -- #68 2026-03-11 · Anika Tabassum
(2, NULL, 1050.00, 'Found you through the Insta page', TRUE, 'bkash'), -- #69 2026-03-12 anon
(2, 27, 3000.00, 'ICU bills are brutal — hang in there', FALSE, 'bkash'), -- #70 2026-03-13 · Mehjabin Karim
(2, 17, 750.00, NULL, FALSE, 'card'), -- #71 2026-03-14 · Imran Hossain
(2, 27, 300.00, NULL, FALSE, 'bkash'), -- #72 2026-03-14 · Mehjabin Karim
(2, NULL, 1550.00, 'Save the little fighter!', TRUE, 'bkash'), -- #73 2026-03-15 anon
(1, 12, 4000.00, NULL, FALSE, 'bank'), -- #74 2026-03-17 · Farhana Yasmin
(1, 9, 200.00, 'Max deserves the best', FALSE, 'cash'), -- #75 2026-03-19 · Mitu Akter
(1, 8, 600.00, 'Sorry I can''t give more this month', FALSE, 'bkash'), -- #76 2026-04-01 · Tanvir Ahmed
(1, 11, 2500.00, 'In memory of my late Tommy', FALSE, 'nagad'), -- #77 2026-04-03 · Rashed Karim
(1, 10, 750.00, 'For Max''s surgery — go buddy!', FALSE, 'bkash'), -- #78 2026-04-07 · Jenny Fernandes
(1, 26, 800.00, 'Found you through the Insta page', FALSE, 'bkash'), -- #79 2026-04-08 · Sajid Bappi
(1, 14, 500.00, 'In memory of my late Tommy', FALSE, 'bkash'), -- #80 2026-04-11 · Priya Das
(1, 16, 2800.00, 'Sorry I can''t give more this month', FALSE, 'card'), -- #81 2026-04-12 · Nusrat Ema
(1, 21, 100.00, NULL, FALSE, 'card'), -- #82 2026-04-16 · Sumaiya Haque
(1, 14, 3000.00, NULL, FALSE, 'nagad'), -- #83 2026-04-17 · Priya Das
(1, 20, 1500.00, 'Get well soon, Max!', FALSE, 'bank'), -- #84 2026-04-18 · Arif Chowdhury
(1, 19, 3000.00, 'Every little bit counts', FALSE, 'card'), -- #85 2026-04-21 · Rumana Malik
(1, 12, 150.00, 'Max deserves the best', FALSE, 'bkash'), -- #86 2026-04-21 · Farhana Yasmin
(1, 9, 250.00, NULL, FALSE, 'bkash'), -- #87 2026-04-22 · Mitu Akter
(1, NULL, 200.00, 'Every little bit counts', TRUE, 'card'), -- #88 2026-04-29 anon
(1, NULL, 500.00, 'For Max''s surgery — go buddy!', TRUE, 'card'), -- #89 2026-04-30 anon
(1, 8, 400.00, 'Max deserves the best', FALSE, 'nagad'), -- #90 2026-05-02 · Tanvir Ahmed
(1, 21, 3000.00, NULL, FALSE, 'card'), -- #91 2026-05-02 · Sumaiya Haque
(1, NULL, 3000.00, 'In memory of my late Tommy', TRUE, 'card'), -- #92 2026-05-03 anon
(1, 22, 200.00, 'For Max''s surgery — go buddy!', FALSE, 'nagad'), -- #93 2026-05-08 · Kabir Andalib
(1, 15, 3000.00, NULL, FALSE, 'nagad'), -- #94 2026-05-15 · Shakib Al Hasan
(1, 9, 300.00, 'Get well soon, Max!', FALSE, 'nagad'), -- #95 2026-05-18 · Mitu Akter
(1, 12, 3200.00, 'In memory of my late Tommy', FALSE, 'bank'), -- #96 2026-06-01 · Farhana Yasmin
(1, 8, 1150.00, 'Max deserves the best', FALSE, 'bkash'), -- #97 2026-06-04 · Tanvir Ahmed
(1, 23, 50.00, 'For Max''s surgery — go buddy!', FALSE, 'bkash'), -- #98 2026-06-11 · Lubna Mariam
(1, 30, 750.00, 'For Max''s surgery — go buddy!', FALSE, 'card'), -- #99 2026-06-16 · UIU Rotaract Club
(1, 9, 900.00, 'This platform is a blessing', FALSE, 'bank'), -- #100 2026-06-19 · Mitu Akter
(1, 10, 600.00, 'Small help from a student', FALSE, 'nagad'), -- #101 2026-06-19 · Jenny Fernandes
(1, 11, 150.00, 'This platform is a blessing', FALSE, 'nagad'), -- #102 2026-06-21 · Rashed Karim
(1, 8, 550.00, 'Donated on behalf of my students', FALSE, 'card'), -- #103 2026-06-28 · Tanvir Ahmed
(1, NULL, 3000.00, 'Get well soon, Max!', TRUE, 'cash'), -- #104 2026-07-01 anon
(1, NULL, 3000.00, 'Every little bit counts', TRUE, 'bkash'), -- #105 2026-07-01 anon
(1, 19, 750.00, 'Get well soon, Max!', FALSE, 'bkash'), -- #106 2026-07-03 · Rumana Malik
(1, NULL, 3000.00, NULL, TRUE, 'card'), -- #107 2026-07-10 anon
(1, 12, 800.00, 'Small help from a student', FALSE, 'nagad'), -- #108 2026-07-11 · Farhana Yasmin
(1, 9, 150.00, NULL, FALSE, 'nagad'), -- #109 2026-07-17 · Mitu Akter
(1, NULL, 3000.00, 'Donated on behalf of my students', TRUE, 'bkash'), -- #110 2026-07-26 anon
(1, 8, 2250.00, 'Max deserves the best', FALSE, 'bkash'), -- #111 2026-07-27 · Tanvir Ahmed
(1, 27, 800.00, 'Shared with my office group chat', FALSE, 'nagad'), -- #112 2026-08-02 · Mehjabin Karim
(1, NULL, 300.00, 'Keep up the amazing work', TRUE, 'bkash'), -- #113 2026-08-03 anon
(1, 23, 3000.00, 'In memory of my late Tommy', FALSE, 'bank'), -- #114 2026-08-06 · Lubna Mariam
(1, 25, 300.00, 'Go team PetCare!', FALSE, 'nagad'), -- #115 2026-08-10 · Anika Tabassum
(1, 9, 400.00, 'In memory of my late Tommy', FALSE, 'bkash'), -- #116 2026-08-12 · Mitu Akter
(1, 23, 3000.00, 'From me and my cat Milo', FALSE, 'nagad'), -- #117 2026-08-12 · Lubna Mariam
(1, 19, 3000.00, 'Sorry I can''t give more this month', FALSE, 'bkash'), -- #118 2026-08-13 · Rumana Malik
(1, 12, 800.00, NULL, FALSE, 'nagad'), -- #119 2026-08-15 · Farhana Yasmin
(1, 8, 750.00, NULL, FALSE, 'bkash'), -- #120 2026-08-26 · Tanvir Ahmed
(1, 24, 1500.00, 'Healing vibes', FALSE, 'bkash'), -- #121 2026-08-26 · Zubair Rahman
(1, 10, 200.00, 'In memory of my late Tommy', FALSE, 'bkash'), -- #122 2026-08-30 · Jenny Fernandes
(3, NULL, 50.00, NULL, TRUE, 'nagad'), -- #123 2026-09-01 anon
(3, 18, 1500.00, NULL, FALSE, 'bkash'), -- #124 2026-09-02 · Tahsin Khan
(3, 17, 600.00, NULL, FALSE, 'nagad'), -- #125 2026-09-02 · Imran Hossain
(3, 12, 100.00, 'Long-time lurker, first-time donor', FALSE, 'cash'), -- #126 2026-09-02 · Farhana Yasmin
(3, 10, 2000.00, 'Salute to the volunteers', FALSE, 'bkash'), -- #127 2026-09-03 · Jenny Fernandes
(3, 9, 50.00, 'For the streeties this winter', FALSE, 'bkash'), -- #128 2026-09-04 · Mitu Akter
(3, 26, 300.00, NULL, FALSE, 'bkash'), -- #129 2026-09-04 · Sajid Bappi
(3, 15, 2000.00, NULL, FALSE, 'bkash'), -- #130 2026-09-05 · Shakib Al Hasan
(3, 27, 2000.00, 'The blanket drive is such a good idea', FALSE, 'nagad'), -- #131 2026-09-06 · Mehjabin Karim
(3, 22, 200.00, 'This platform is a blessing', FALSE, 'card'), -- #132 2026-09-06 · Kabir Andalib
(3, 11, 300.00, 'Stay warm, streeties', FALSE, 'nagad'), -- #133 2026-09-07 · Rashed Karim
(3, 16, 750.00, 'Sorry I can''t give more this month', FALSE, 'nagad'), -- #134 2026-09-07 · Nusrat Ema
(3, 14, 100.00, NULL, FALSE, 'bkash'), -- #135 2026-09-07 · Priya Das
(3, 29, 1500.00, 'Salute to the volunteers', FALSE, 'cash'), -- #136 2026-09-08 · PawMart Dhanmondi
(1, 11, 1000.00, 'In memory of my late Tommy', FALSE, 'bkash'), -- #137 2026-09-08 · Rashed Karim
(3, 8, 50.00, 'The blanket drive is such a good idea', FALSE, 'bkash'), -- #138 2026-09-08 · Tanvir Ahmed
(3, 31, 200.00, 'For the streeties this winter', FALSE, 'bkash'), -- #139 2026-09-08 · Gulshan Book Club
(3, 28, 800.00, 'For the streeties this winter', FALSE, 'bkash'), -- #140 2026-09-08 · Chowdhury family
(3, NULL, 50.00, 'From me and my cat Milo', TRUE, 'bkash'), -- #141 2026-09-09 anon
(3, NULL, 1200.00, 'Wish I could adopt right now — here''s something instead', TRUE, 'bkash'), -- #142 2026-09-09 anon
(3, 30, 250.00, 'Stay warm, streeties', FALSE, 'cash'), -- #143 2026-09-09 · UIU Rotaract Club
(1, NULL, 550.00, 'Sorry I can''t give more this month', TRUE, 'cash'), -- #144 2026-09-10 anon
(4, 18, 500.00, NULL, FALSE, 'bank'), -- #145 2026-09-10 · Tahsin Khan
(4, 14, 500.00, 'Salute to the volunteers', FALSE, 'nagad'), -- #146 2026-09-10 · Priya Das
(3, 25, 500.00, 'Long-time lurker, first-time donor', FALSE, 'bkash'), -- #147 2026-09-10 · Anika Tabassum
(4, 16, 100.00, 'Happy birthday Rani!', FALSE, 'bkash'), -- #148 2026-09-10 · Nusrat Ema
(4, 15, 400.00, 'Five dogs vaccinated with this!', FALSE, 'cash'), -- #149 2026-09-11 · Shakib Al Hasan
(4, 13, 1100.00, NULL, FALSE, 'cash'), -- #150 2026-09-11 · Nafis Rahman
(4, 12, 1600.00, NULL, FALSE, 'nagad'), -- #151 2026-09-11 · Farhana Yasmin
(4, 27, 150.00, 'Shared with my office group chat', FALSE, 'bkash'), -- #152 2026-09-11 · Mehjabin Karim
(3, 21, 1500.00, NULL, FALSE, 'bkash'), -- #153 2026-09-11 · Sumaiya Haque
(3, 13, 200.00, 'The blanket drive is such a good idea', FALSE, 'bkash'), -- #154 2026-09-11 · Nafis Rahman
(3, 24, 100.00, 'Ten blankets from me', FALSE, 'nagad'), -- #155 2026-09-11 · Zubair Rahman
(4, 17, 1000.00, 'Five dogs vaccinated with this!', FALSE, 'nagad'), -- #156 2026-09-11 · Imran Hossain
(4, 22, 200.00, 'Prayers and taka, both sent', FALSE, 'bank'), -- #157 2026-09-12 · Kabir Andalib
(4, 28, 1000.00, 'Donated on behalf of my students', FALSE, 'cash'), -- #158 2026-09-12 · Chowdhury family
(4, 10, 1200.00, NULL, FALSE, 'card'), -- #159 2026-09-12 · Jenny Fernandes
(4, 11, 500.00, 'This platform is a blessing', FALSE, 'card'), -- #160 2026-09-12 · Rashed Karim
(4, NULL, 100.00, 'For the vaccine drive — protect them all', TRUE, 'cash'), -- #161 2026-09-12 anon
(4, 26, 1500.00, 'Happy birthday Rani!', FALSE, 'bank'); -- #162 2026-09-12 · Sajid Bappi


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
(11, 'Shiro', 'dog', 'Husky mix',  'DEA 1.1-', 30.00, '2026-06-20', TRUE, 1, TRUE),
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
(11, 'donation', 'donations', NULL, 1, 'Max''s surgery fund'), -- Rashed Karim 2025-11-06
(10, 'donation', 'donations', NULL, 1, 'Max''s surgery fund'), -- Jenny Fernandes 2025-11-08
(8, 'donation', 'donations', NULL, 6, 'Max''s surgery fund'), -- Tanvir Ahmed 2025-11-10
(9, 'donation', 'donations', NULL, 2, 'Max''s surgery fund'), -- Mitu Akter 2025-11-11
(12, 'donation', 'donations', NULL, 75, 'Max''s surgery fund'), -- Farhana Yasmin 2025-11-12
(28, 'donation', 'donations', NULL, 15, 'Max''s surgery fund'), -- Chowdhury family 2025-11-15
(23, 'donation', 'donations', NULL, 13, 'Max''s surgery fund'), -- Lubna Mariam 2025-12-03
(15, 'donation', 'donations', NULL, 3, 'Max''s surgery fund'), -- Shakib Al Hasan 2025-12-05
(8, 'donation', 'donations', NULL, 6, 'Max''s surgery fund'), -- Tanvir Ahmed 2025-12-07
(9, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Mitu Akter 2025-12-12
(12, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- Farhana Yasmin 2025-12-23
(29, 'donation', 'donations', NULL, 5, 'Max''s surgery fund'), -- PawMart Dhanmondi 2025-12-24
(8, 'donation', 'donations', NULL, 1, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-01-09
(9, 'donation', 'donations', NULL, 9, 'Max''s surgery fund'), -- Mitu Akter 2026-01-09
(16, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Nusrat Ema 2026-01-12
(13, 'donation', 'donations', NULL, 9, 'Max''s surgery fund'), -- Nafis Rahman 2026-01-14
(27, 'donation', 'donations', NULL, 19, 'Max''s surgery fund'), -- Mehjabin Karim 2026-01-14
(11, 'donation', 'donations', NULL, 25, 'Max''s surgery fund'), -- Rashed Karim 2026-01-18
(10, 'donation', 'donations', NULL, 50, 'Max''s surgery fund'), -- Jenny Fernandes 2026-01-23
(15, 'donation', 'donations', NULL, 3, 'Max''s surgery fund'), -- Shakib Al Hasan 2026-02-01
(31, 'donation', 'donations', NULL, 3, 'Max''s surgery fund'), -- Gulshan Book Club 2026-02-01
(8, 'donation', 'donations', NULL, 6, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-02-02
(12, 'donation', 'donations', NULL, 4, 'Max''s surgery fund'), -- Farhana Yasmin 2026-02-03
(12, 'donation', 'donations', NULL, 24, 'Pihu ICU fund'), -- Farhana Yasmin 2026-02-04
(9, 'donation', 'donations', NULL, 4, 'Pihu ICU fund'), -- Mitu Akter 2026-02-05
(10, 'donation', 'donations', NULL, 5, 'Pihu ICU fund'), -- Jenny Fernandes 2026-02-05
(8, 'donation', 'donations', NULL, 4, 'Pihu ICU fund'), -- Tanvir Ahmed 2026-02-07
(20, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Arif Chowdhury 2026-02-07
(15, 'donation', 'donations', NULL, 1, 'Pihu ICU fund'), -- Shakib Al Hasan 2026-02-08
(22, 'donation', 'donations', NULL, 3, 'Pihu ICU fund'), -- Kabir Andalib 2026-02-09
(11, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Rashed Karim 2026-02-09
(13, 'donation', 'donations', NULL, 50, 'Max''s surgery fund'), -- Nafis Rahman 2026-02-09
(29, 'donation', 'donations', NULL, 1, 'Pihu ICU fund'), -- PawMart Dhanmondi 2026-02-10
(22, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Kabir Andalib 2026-02-12
(31, 'donation', 'donations', NULL, 3, 'Pihu ICU fund'), -- Gulshan Book Club 2026-02-13
(14, 'donation', 'donations', NULL, 2, 'Pihu ICU fund'), -- Priya Das 2026-02-13
(9, 'donation', 'donations', NULL, 12, 'Max''s surgery fund'), -- Mitu Akter 2026-02-14
(20, 'donation', 'donations', NULL, 15, 'Pihu ICU fund'), -- Arif Chowdhury 2026-02-15
(19, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Rumana Malik 2026-02-16
(13, 'donation', 'donations', NULL, 4, 'Max''s surgery fund'), -- Nafis Rahman 2026-02-18
(18, 'donation', 'donations', NULL, 1, 'Max''s surgery fund'), -- Tahsin Khan 2026-02-19
(22, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Kabir Andalib 2026-02-20
(21, 'donation', 'donations', NULL, 24, 'Pihu ICU fund'), -- Sumaiya Haque 2026-02-21
(24, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Zubair Rahman 2026-02-21
(19, 'donation', 'donations', NULL, 6, 'Pihu ICU fund'), -- Rumana Malik 2026-02-22
(22, 'donation', 'donations', NULL, 15, 'Pihu ICU fund'), -- Kabir Andalib 2026-02-23
(28, 'donation', 'donations', NULL, 3, 'Pihu ICU fund'), -- Chowdhury family 2026-02-23
(14, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Priya Das 2026-02-24
(19, 'donation', 'donations', NULL, 7, 'Pihu ICU fund'), -- Rumana Malik 2026-02-24
(8, 'donation', 'donations', NULL, 2, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-02-26
(21, 'donation', 'donations', NULL, 75, 'Pihu ICU fund'), -- Sumaiya Haque 2026-02-26
(23, 'donation', 'donations', NULL, 3, 'Pihu ICU fund'), -- Lubna Mariam 2026-02-28
(19, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Rumana Malik 2026-03-03
(8, 'donation', 'donations', NULL, 23, 'Pihu ICU fund'), -- Tanvir Ahmed 2026-03-04
(18, 'donation', 'donations', NULL, 3, 'Pihu ICU fund'), -- Tahsin Khan 2026-03-04
(16, 'donation', 'donations', NULL, 3, 'Pihu ICU fund'), -- Nusrat Ema 2026-03-04
(13, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Nafis Rahman 2026-03-05
(27, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Mehjabin Karim 2026-03-07
(26, 'donation', 'donations', NULL, 8, 'Pihu ICU fund'), -- Sajid Bappi 2026-03-07
(24, 'donation', 'donations', NULL, 12, 'Pihu ICU fund'), -- Zubair Rahman 2026-03-09
(9, 'donation', 'donations', NULL, 6, 'Pihu ICU fund'), -- Mitu Akter 2026-03-09
(25, 'donation', 'donations', NULL, 2, 'Pihu ICU fund'), -- Anika Tabassum 2026-03-11
(27, 'donation', 'donations', NULL, 30, 'Pihu ICU fund'), -- Mehjabin Karim 2026-03-13
(17, 'donation', 'donations', NULL, 8, 'Pihu ICU fund'), -- Imran Hossain 2026-03-14
(27, 'donation', 'donations', NULL, 3, 'Pihu ICU fund'), -- Mehjabin Karim 2026-03-14
(12, 'donation', 'donations', NULL, 40, 'Max''s surgery fund'), -- Farhana Yasmin 2026-03-17
(9, 'donation', 'donations', NULL, 2, 'Max''s surgery fund'), -- Mitu Akter 2026-03-19
(8, 'donation', 'donations', NULL, 6, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-04-01
(11, 'donation', 'donations', NULL, 25, 'Max''s surgery fund'), -- Rashed Karim 2026-04-03
(10, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- Jenny Fernandes 2026-04-07
(26, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- Sajid Bappi 2026-04-08
(14, 'donation', 'donations', NULL, 5, 'Max''s surgery fund'), -- Priya Das 2026-04-11
(16, 'donation', 'donations', NULL, 28, 'Max''s surgery fund'), -- Nusrat Ema 2026-04-12
(21, 'donation', 'donations', NULL, 1, 'Max''s surgery fund'), -- Sumaiya Haque 2026-04-16
(14, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Priya Das 2026-04-17
(20, 'donation', 'donations', NULL, 15, 'Max''s surgery fund'), -- Arif Chowdhury 2026-04-18
(19, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Rumana Malik 2026-04-21
(12, 'donation', 'donations', NULL, 2, 'Max''s surgery fund'), -- Farhana Yasmin 2026-04-21
(9, 'donation', 'donations', NULL, 3, 'Max''s surgery fund'), -- Mitu Akter 2026-04-22
(8, 'donation', 'donations', NULL, 4, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-05-02
(21, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Sumaiya Haque 2026-05-02
(22, 'donation', 'donations', NULL, 2, 'Max''s surgery fund'), -- Kabir Andalib 2026-05-08
(15, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Shakib Al Hasan 2026-05-15
(9, 'donation', 'donations', NULL, 3, 'Max''s surgery fund'), -- Mitu Akter 2026-05-18
(12, 'donation', 'donations', NULL, 32, 'Max''s surgery fund'), -- Farhana Yasmin 2026-06-01
(8, 'donation', 'donations', NULL, 12, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-06-04
(23, 'donation', 'donations', NULL, 1, 'Max''s surgery fund'), -- Lubna Mariam 2026-06-11
(30, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- UIU Rotaract Club 2026-06-16
(9, 'donation', 'donations', NULL, 9, 'Max''s surgery fund'), -- Mitu Akter 2026-06-19
(10, 'donation', 'donations', NULL, 6, 'Max''s surgery fund'), -- Jenny Fernandes 2026-06-19
(11, 'donation', 'donations', NULL, 2, 'Max''s surgery fund'), -- Rashed Karim 2026-06-21
(8, 'donation', 'donations', NULL, 6, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-06-28
(19, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- Rumana Malik 2026-07-03
(12, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- Farhana Yasmin 2026-07-11
(9, 'donation', 'donations', NULL, 2, 'Max''s surgery fund'), -- Mitu Akter 2026-07-17
(8, 'donation', 'donations', NULL, 23, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-07-27
(27, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- Mehjabin Karim 2026-08-02
(23, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Lubna Mariam 2026-08-06
(25, 'donation', 'donations', NULL, 3, 'Max''s surgery fund'), -- Anika Tabassum 2026-08-10
(9, 'donation', 'donations', NULL, 4, 'Max''s surgery fund'), -- Mitu Akter 2026-08-12
(23, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Lubna Mariam 2026-08-12
(19, 'donation', 'donations', NULL, 30, 'Max''s surgery fund'), -- Rumana Malik 2026-08-13
(12, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- Farhana Yasmin 2026-08-15
(8, 'donation', 'donations', NULL, 8, 'Max''s surgery fund'), -- Tanvir Ahmed 2026-08-26
(24, 'donation', 'donations', NULL, 15, 'Max''s surgery fund'), -- Zubair Rahman 2026-08-26
(10, 'donation', 'donations', NULL, 2, 'Max''s surgery fund'), -- Jenny Fernandes 2026-08-30
(18, 'donation', 'donations', NULL, 15, 'Winter blanket drive'), -- Tahsin Khan 2026-09-02
(17, 'donation', 'donations', NULL, 6, 'Winter blanket drive'), -- Imran Hossain 2026-09-02
(12, 'donation', 'donations', NULL, 1, 'Winter blanket drive'), -- Farhana Yasmin 2026-09-02
(10, 'donation', 'donations', NULL, 20, 'Winter blanket drive'), -- Jenny Fernandes 2026-09-03
(9, 'donation', 'donations', NULL, 1, 'Winter blanket drive'), -- Mitu Akter 2026-09-04
(26, 'donation', 'donations', NULL, 3, 'Winter blanket drive'), -- Sajid Bappi 2026-09-04
(15, 'donation', 'donations', NULL, 20, 'Winter blanket drive'), -- Shakib Al Hasan 2026-09-05
(27, 'donation', 'donations', NULL, 20, 'Winter blanket drive'), -- Mehjabin Karim 2026-09-06
(22, 'donation', 'donations', NULL, 2, 'Winter blanket drive'), -- Kabir Andalib 2026-09-06
(11, 'donation', 'donations', NULL, 3, 'Winter blanket drive'), -- Rashed Karim 2026-09-07
(16, 'donation', 'donations', NULL, 8, 'Winter blanket drive'), -- Nusrat Ema 2026-09-07
(14, 'donation', 'donations', NULL, 1, 'Winter blanket drive'), -- Priya Das 2026-09-07
(29, 'donation', 'donations', NULL, 15, 'Winter blanket drive'), -- PawMart Dhanmondi 2026-09-08
(11, 'donation', 'donations', NULL, 10, 'Max''s surgery fund'), -- Rashed Karim 2026-09-08
(8, 'donation', 'donations', NULL, 1, 'Winter blanket drive'), -- Tanvir Ahmed 2026-09-08
(31, 'donation', 'donations', NULL, 2, 'Winter blanket drive'), -- Gulshan Book Club 2026-09-08
(28, 'donation', 'donations', NULL, 8, 'Winter blanket drive'), -- Chowdhury family 2026-09-08
(30, 'donation', 'donations', NULL, 3, 'Winter blanket drive'), -- UIU Rotaract Club 2026-09-09
(18, 'donation', 'donations', NULL, 5, 'Ramna vaccine drive'), -- Tahsin Khan 2026-09-10
(14, 'donation', 'donations', NULL, 5, 'Ramna vaccine drive'), -- Priya Das 2026-09-10
(25, 'donation', 'donations', NULL, 5, 'Winter blanket drive'), -- Anika Tabassum 2026-09-10
(16, 'donation', 'donations', NULL, 1, 'Ramna vaccine drive'), -- Nusrat Ema 2026-09-10
(15, 'donation', 'donations', NULL, 4, 'Ramna vaccine drive'), -- Shakib Al Hasan 2026-09-11
(13, 'donation', 'donations', NULL, 11, 'Ramna vaccine drive'), -- Nafis Rahman 2026-09-11
(12, 'donation', 'donations', NULL, 16, 'Ramna vaccine drive'), -- Farhana Yasmin 2026-09-11
(27, 'donation', 'donations', NULL, 2, 'Ramna vaccine drive'), -- Mehjabin Karim 2026-09-11
(21, 'donation', 'donations', NULL, 15, 'Winter blanket drive'), -- Sumaiya Haque 2026-09-11
(13, 'donation', 'donations', NULL, 2, 'Winter blanket drive'), -- Nafis Rahman 2026-09-11
(24, 'donation', 'donations', NULL, 1, 'Winter blanket drive'), -- Zubair Rahman 2026-09-11
(17, 'donation', 'donations', NULL, 10, 'Ramna vaccine drive'), -- Imran Hossain 2026-09-11
(22, 'donation', 'donations', NULL, 2, 'Ramna vaccine drive'), -- Kabir Andalib 2026-09-12
(28, 'donation', 'donations', NULL, 10, 'Ramna vaccine drive'), -- Chowdhury family 2026-09-12
(10, 'donation', 'donations', NULL, 12, 'Ramna vaccine drive'), -- Jenny Fernandes 2026-09-12
(11, 'donation', 'donations', NULL, 5, 'Ramna vaccine drive'), -- Rashed Karim 2026-09-12
(26, 'donation', 'donations', NULL, 15, 'Ramna vaccine drive'), -- Sajid Bappi 2026-09-12
(8, 'review', NULL, NULL, 10, 'Vet clinic review'), -- 2026-08-01
(9, 'blood_donation', NULL, NULL, 50, 'Registered Milky as blood donor'), -- 2026-06-01
(10, 'blood_donation', NULL, NULL, 50, 'Registered Rex as blood donor'), -- 2026-05-15
(10, 'adoption', NULL, NULL, 100, 'Found & reported orange tabby'), -- 2026-08-30
(7, 'adoption', NULL, NULL, 200, 'Adopted Mishti'), -- 2026-08-20
(7, 'review', NULL, NULL, 10, 'Vet clinic review'); -- 2026-08-25


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

-- ------------------------------------------------------------
-- U9 — Community Rescue Network
-- ------------------------------------------------------------
INSERT INTO rescue_reports (id, reporter_id, species, situation, urgency, area, description, status, resolution, reported_at) VALUES
(1, 9,  'cat', 'stuck_trapped', 'critical', 'Dhanmondi 27, near Lake Gate',
 'Kitten fell into an open storm drain beside the footpath. Crying loudly, water level rising. We can hear it but cannot reach — the grate is too heavy for us.',
 'responding', NULL, '2026-09-12 09:42:00'),
(2, NULL, 'cat', 'stuck_trapped', 'urgent', 'Mirpur 10, Ambala complex roof',
 'A cat has been sitting on the AC cornice of the 6th floor for two days. Meows when callers come. Possibly stuck, cannot climb down the smooth wall.',
 'reported', NULL, '2026-09-11 18:20:00'),
(3, 10, 'dog', 'road_accident', 'critical', 'Airport Road, opposite HTD',
 'Deshi dog hit by a CNG, limping badly with a bleeding hind leg. Traffic is heavy — he has crawled to the roadside median. Wrapped in a blanket, needs urgent vet pickup.',
 'rescued', NULL, '2026-09-10 14:05:00'),
(4, 24, 'cat', 'abandoned', 'standard', 'Banani, Kakoli park corner',
 'Box of 4 newborn kittens left near the park bench. Mother nowhere in sight. Eyes still closed — they need bottle feeding every 2 hours.',
 'closed', 'All 4 kittens hand-fed by volunteers and moved to Pawfect Haven''s neonatal unit. One already has an adopter lined up!', '2026-09-08 08:15:00');

INSERT INTO rescue_responders (rescue_id, responder_id, claimed_at) VALUES
(1, 11, '2026-09-12 09:58:00'),  -- Rashed Karim
(1, 22, '2026-09-12 10:04:00'),  -- Nafis Rahman
(3, 8,  '2026-09-10 14:19:00'),  -- Tanvir Ahmed
(3, 2,  '2026-09-10 14:22:00'),  -- Nusrat Jahan (shelter side)
(3, 27, '2026-09-10 14:26:00'),  -- Sajid Bappi
(4, 9,  '2026-09-08 08:40:00'),  -- Mitu Akter
(4, 25, '2026-09-08 08:52:00');  -- Lubna Mariam

INSERT INTO karma_ledger (user_id, action_type, reference_type, reference_id, points, note) VALUES
(9,  'rescue_reported', 'rescue_reports', 1, 50, 'Posted critical storm-drain alert'),
(10, 'rescue_reported', 'rescue_reports', 3, 50, 'Posted road-accident alert'),
(24, 'rescue_reported', 'rescue_reports', 4, 50, 'Posted abandoned-litter alert'),
(11, 'rescue_responded', 'rescue_reports', 1, 40, 'Responding to storm-drain kitten'),
(22, 'rescue_responded', 'rescue_reports', 1, 40, 'Responding to storm-drain kitten'),
(8,  'rescue_responded', 'rescue_reports', 3, 40, 'Responding to Airport Road dog'),
(2,  'rescue_responded', 'rescue_reports', 3, 40, 'Shelter team responding'),
(27, 'rescue_responded', 'rescue_reports', 3, 40, 'Responding to Airport Road dog'),
(9,  'rescue_responded', 'rescue_reports', 4, 40, 'Responding to Banani litter'),
(25, 'rescue_responded', 'rescue_reports', 4, 40, 'Responding to Banani litter'),
(8,  'rescue_rescued',   'rescue_reports', 3, 80, 'Dog secured and transported to clinic'),
(9,  'rescue_rescued',   'rescue_reports', 4, 80, 'Litter secured into neonatal care'),
(9,  'rescue_closed',    'rescue_reports', 4, 40, 'Case closed — all kittens safe');

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Sanity check — watch the trigger-maintained totals
-- ------------------------------------------------------------
SELECT c.title, c.goal_amount, c.raised_amount,
       ROUND(c.raised_amount / c.goal_amount * 100, 1) AS pct
  FROM donation_campaigns c;
