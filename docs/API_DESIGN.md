# PetCare — REST API Design

Conventions: JSON in/out · JWT Bearer auth · base path `/api/v1` · errors as `{ "error": { "code", "message" } }`.
Roles in the last column gate access: `pub` = public, `auth` = any logged-in user.

## Auth & Profile

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/auth/register` | Register (role picked at signup; shelter/vet submit org name + license) | pub |
| POST | `/auth/login` | Login → JWT | pub |
| GET | `/me` | My profile + karma balance | auth |
| PUT | `/me` | Update profile | auth |
| POST | `/me/compatibility-quiz` | Submit lifestyle quiz (U4) | adopter |

## Pets & Adoption (M1)

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/pets` | Search/list — filters: species, breed, age_max, size, energy, good_with_kids, city, status; sort=waiting | pub |
| GET | `/pets/:id` | Pet detail incl. photos, tags, shelter | pub |
| POST | `/pets` | Create pet listing | shelter, admin |
| PUT | `/pets/:id` | Update pet | shelter (owner), admin |
| POST | `/pets/:id/photos` | Upload photos (multipart) | shelter (owner) |
| POST | `/pets/:id/application` | Submit adoption application | adopter, vet |
| GET | `/me/applications` | My applications + statuses | adopter |
| GET | `/shelter/applications` | Inbox for my pets (filter: status) | shelter |
| PATCH | `/applications/:id` | Approve / reject / request-review (+decision_note) | shelter (owner) |

## Campaigns & Donations (M2)

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/campaigns` | Active campaigns + progress (from `v_campaign_progress`) | pub |
| GET | `/campaigns/:id` | Detail + donor wall + updates | pub |
| POST | `/campaigns` | Create campaign (goal, pet?, dates) | shelter |
| POST | `/campaigns/:id/donations` | Record donation (demo payment) — returns updated progress | pub (guest ok), auth |
| GET | `/me/donations` | My donation history | auth |
| GET | `/shelters/:id/wishes` | Wish list | pub |
| POST | `/wishes/:id/pledge` | Pledge N units of a wish item | auth |

## Vet Care (M3)

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/clinics` | Search — filters: area, emergency, low_cost, min_rating | pub |
| GET | `/clinics/:id` | Detail + reviews summary (Q9) | pub |
| POST | `/clinics/:id/reviews` | Rate 1–5 (one per user, upsert) | auth |
| GET | `/me/reminders` | My medical reminders | auth |
| POST | `/me/reminders` | Add reminder (type, due_date) | auth |

## Blood Bank (U1)

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/blood-donors` | Register my pet as donor (species, blood_type, weight) | auth |
| GET | `/blood-donors/match/:requestId` | Eligible donors for a request (Q8 logic) | vet, shelter, admin |
| POST | `/blood-requests` | Post urgent request | vet, shelter |
| GET | `/blood-requests/open` | Public urgent board | pub |
| PATCH | `/blood-requests/:id` | Mark fulfilled / cancelled | vet (owner) |

## Lost & Found (U2)

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/lost-reports` | File lost pet report | auth |
| POST | `/found-reports` | File found pet report | auth |
| GET | `/lost-found/board` | Both boards + suggested matches | pub |
| PATCH | `/matches/:id` | Confirm / dismiss match → both reports marked | admin |

## Karma (U3)

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/karma/leaderboard` | Top 10 from `v_karma_leaderboard` | pub |
| GET | `/karma/me` | My ledger + balance | auth |
| GET | `/rewards` | Rewards catalog | pub |
| POST | `/rewards/:id/redeem` | Redeem points (validates balance, creates redemption) | auth |

## Unique Modules (U4–U7)

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/foster-trials` | Request trial for pet (U4) | adopter |
| PATCH | `/foster-trials/:id` | Complete/return + feedback | shelter |
| GET | `/missions` | Transport missions + leg fill status (U5) | pub |
| POST | `/missions` | Create mission | shelter |
| POST | `/missions/:id/legs/:legId/claim` | Claim a transport leg | auth |
| POST | `/virtual-fostering` | Sponsor a pet monthly (U6) | auth |
| GET | `/pets/:id/updates` | Pet updates feed (virtual foster content) | pub |
| POST | `/safe-haven/requests` | Anonymous crisis request — returns `requester_code` (U7) | pub |
| GET | `/safe-haven/requests/:code` | Status check by code only | pub (code holder) |
| PATCH | `/safe-haven/requests/:id/assign` | Assign crisis foster | admin |

## Dashboards

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/dashboards/shelter` | Stats: residents, capacity % (Q10), pending apps, funds this month | shelter |
| GET | `/dashboards/admin` | Verifications queue, haven caseload, platform totals | admin |
| GET | `/me/dashboard` | Applications, donations, karma, reminders combined | auth |

## Notes

- **Demo payments:** `POST /campaigns/:id/donations` accepts a `simulate: true` flag — no gateway in v1; wrap the insert + trigger in one transaction.
- **Karma hook:** donation, review, transport-claim and blood-donor endpoints each insert a `karma_ledger` row in the same transaction (points table in PROJECT_SPEC §4.2).
- **Pagination:** all list endpoints take `?page=&limit=` and return `{ data, page, total }`.
- **RBAC middleware** checks `users.role` + ownership (shelter can only mutate own pets/campaigns).
