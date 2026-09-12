-- ============================================================
--  PetCare — Showcase Queries
--  Ten queries that demonstrate the database doing real work.
--  Perfect for viva/demo: each shows joins, aggregates, CASE,
--  subqueries, window-style logic and date math.
-- ============================================================

USE petcare_db;

-- ------------------------------------------------------------
-- Q1 · The home page: adoptable pets with shelter + primary photo
--     (3-table join + correlated subquery for the cover photo)
-- ------------------------------------------------------------
SELECT p.name, p.species, p.breed,
       TIMESTAMPDIFF(MONTH, p.admission_date, CURRENT_DATE) AS months_in_care,
       s.name AS shelter_name,
       (SELECT ph.url FROM pet_photos ph
         WHERE ph.pet_id = p.id AND ph.is_primary = TRUE LIMIT 1) AS photo
  FROM pets p
  JOIN shelters s ON s.id = p.shelter_id
 WHERE p.status = 'available'
 ORDER BY p.admission_date ASC;          -- longest waiters first (fairness by design)

-- ------------------------------------------------------------
-- Q2 · Live campaign progress (what every donation page shows)
-- ------------------------------------------------------------
SELECT title, goal_amount, raised_amount,
       ROUND(raised_amount / goal_amount * 100, 1)              AS pct,
       (SELECT COUNT(*) FROM donations d WHERE d.campaign_id = c.id) AS donors
  FROM donation_campaigns c
 WHERE status = 'active'
 ORDER BY pct DESC;

-- ------------------------------------------------------------
-- Q3 · Top 5 donors of all time (anonymous donors stay hidden)
-- ------------------------------------------------------------
SELECT u.full_name,
       SUM(d.amount)          AS total_given,
       COUNT(d.id)            AS gifts,
       ROUND(AVG(d.amount))   AS avg_gift
  FROM donations d
  JOIN users u ON u.id = d.donor_id
 WHERE d.anonymous = FALSE AND d.donor_id IS NOT NULL
 GROUP BY u.id, u.full_name
 ORDER BY total_given DESC
 LIMIT 5;

-- ------------------------------------------------------------
-- Q4 · Overlooked pets: longest waits, seniors flagged
--     (date math + CASE expression)
-- ------------------------------------------------------------
SELECT p.name, p.species, p.age_months,
       DATEDIFF(CURRENT_DATE, p.admission_date) AS days_waiting,
       CASE WHEN p.age_months >= 60 THEN 'SENIOR — urgent marketing'
            WHEN DATEDIFF(CURRENT_DATE, p.admission_date) > 180 THEN 'LONG-STAY'
            ELSE 'ok' END AS attention_needed
  FROM pets p
 WHERE p.status = 'available'
 ORDER BY days_waiting DESC;

-- ------------------------------------------------------------
-- Q5 · Adoption funnel by species (conditional aggregation)
-- ------------------------------------------------------------
SELECT species,
       COUNT(*)                                                        AS total_pets,
       SUM(status = 'adopted')                                         AS adopted,
       SUM(status = 'available')                                       AS waiting,
       SUM(status IN ('pending','medical_hold','fostered'))            AS in_process,
       ROUND(100 * SUM(status = 'adopted') / COUNT(*), 1)              AS success_rate_pct
  FROM pets
 GROUP BY species;

-- ------------------------------------------------------------
-- Q6 · Monthly donation trend (date formatting + grouping)
-- ------------------------------------------------------------
SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
       COUNT(*)                         AS donation_count,
       SUM(amount)                      AS total_bdt,
       SUM(DISTINCT donor_id IS NOT NULL) AS identified_donors
  FROM donations
 GROUP BY month
 ORDER BY month;

-- ------------------------------------------------------------
-- Q7 · Karma leaderboard (the U3 gamification engine)
-- ------------------------------------------------------------
SELECT u.full_name,
       SUM(k.points) AS total_karma,
       COUNT(k.id)   AS good_deeds,
       GROUP_CONCAT(DISTINCT k.action_type ORDER BY k.action_type) AS deed_types
  FROM karma_ledger k
  JOIN users u ON u.id = k.user_id
 GROUP BY u.id, u.full_name
 ORDER BY total_karma DESC
 LIMIT 10;

-- ------------------------------------------------------------
-- Q8 · Blood bank: match open urgent requests to eligible donors
--     (dogs eligible 8 weeks after donating, cats 4 weeks)
-- ------------------------------------------------------------
SELECT br.id AS request_id, br.species, br.blood_type, br.urgency,
       cl.name AS clinic_name,
       bd.pet_name, bd.blood_type AS donor_type, u.phone AS owner_phone,
       bd.last_donation_date,
       CASE WHEN bd.last_donation_date IS NULL
              OR bd.last_donation_date <= CURRENT_DATE
                   - INTERVAL (CASE bd.species WHEN 'dog' THEN 56 ELSE 28 END) DAY
            THEN 'ELIGIBLE NOW' ELSE 'recently donated' END AS eligibility
  FROM blood_requests br
  JOIN vet_clinics cl       ON cl.id = br.clinic_id
  JOIN pet_blood_donors bd  ON bd.species = br.species
                           AND bd.blood_type = br.blood_type
                           AND bd.is_active = TRUE
  JOIN users u              ON u.id = bd.user_id
 WHERE br.status = 'open'
   AND br.urgency IN ('critical','urgent')
 ORDER BY FIELD(br.urgency, 'critical','urgent','scheduled'), bd.last_donation_date;

-- ------------------------------------------------------------
-- Q9 · Vet directory: rating summary with quality filter
--     (HAVING + LEFT JOIN keeps unrated clinics visible)
-- ------------------------------------------------------------
SELECT cl.name, cl.area, cl.emergency_service, cl.low_cost,
       ROUND(AVG(r.rating), 2) AS avg_rating,
       COUNT(r.id)             AS review_count
  FROM vet_clinics cl
  LEFT JOIN vet_reviews r ON r.clinic_id = cl.id
 GROUP BY cl.id, cl.name, cl.area, cl.emergency_service, cl.low_cost
 ORDER BY avg_rating DESC, review_count DESC;

-- ------------------------------------------------------------
-- Q10 · Shelter capacity radar (admin dashboard)
--      Current residents vs capacity — utilization + headroom
-- ------------------------------------------------------------
SELECT s.name,
       s.capacity,
       COUNT(p.id) AS current_residents,
       ROUND(100 * COUNT(p.id) / s.capacity, 1) AS utilization_pct,
       s.capacity - COUNT(p.id) AS beds_free,
       CASE WHEN COUNT(p.id) / s.capacity > 0.85
            THEN '⚠ ALERT: near capacity'
            ELSE 'healthy' END AS status
  FROM shelters s
  LEFT JOIN pets p ON p.shelter_id = s.id AND p.status <> 'adopted'
 GROUP BY s.id, s.name, s.capacity
 ORDER BY utilization_pct DESC;
