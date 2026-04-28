# PANTIKU CTO DECK (MVP)
## Digital Ecosystem for Orphanage Care & Empowerment

**Presented by:** Eko Kristino Butar-Butar, Founder  
**Date:** 2026  
**Status:** MVP Concept & Technical Design

---

## SLIDE 1: THE PROBLEM

### Status Quo: The Donation Paradox

- **Challenge:** Orphanages in Indonesia depend entirely on one-way donations
- **Impact:** 
  - Children grow with low self-esteem and limited life skills
  - Orphanages remain perpetually dependent and unsustainable
  - Donor participation is sporadic and geographically biased
  
### The Gap

Distribution of aid is inconsistent:
- **Peak periods** (religious holidays): Excessive donations exceed capacity
- **Off-season:** Little to no support despite constant needs
- **Geographical bias:** Remote orphanages receive minimal assistance
- **Misalignment:** Donations don't match actual needs

### Affected Stakeholders

1. **Children** - Lack emotional support, skills development, future readiness
2. **Orphanage Managers** - Limited resources, unsustainable models
3. **Donors** - Frustrated by lack of transparency and long-term impact
4. **Society** - Lost talent development opportunities

---

## SLIDE 2: THE VISION

### Transform, Don't Just Donate

**From:** One-way charitable giving → **To:** Sustainable ecosystem collaboration

### What We're Building

A comprehensive digital platform that:
- Provides **emotional care & mentoring** for children
- Develops **marketable skills** through structured programs
- Enables **economic self-sufficiency** for orphanages
- Creates **transparent, inclusive** donor participation

### Core Promise

> Pantiku is not building a platform. Pantiku is building people.

Children and orphanages don't need pity. They need a **system that believes in their future**.

---

## SLIDE 3: THE SOLUTION - ARCHITECTURE

### Pantiku Ecosystem (Three Layers)

#### Layer 1: Care & Empowerment
- Emotional support & psychological services
- Structured life skills training
- Educational mentorship programs
- Group-based skill development (efficiency via clustering)

#### Layer 2: Economic Enablement
- Campaign-based fundraising for productive equipment
- Microfinance & grant management
- Production & supply chain support
- Business model coaching for orphanages

#### Layer 3: Digital Marketplace
- B2B product sales from orphanages
- Donation-based purchase mechanism
- Transparent impact tracking
- Community engagement & forums

---

## SLIDE 4: HOW IT WORKS

### The Flow

```
Donor registers → Discovers campaigns → Supports equipment/training
         ↓
Orphanage receives support → Begins productive activities
         ↓
Children participate → Build skills & confidence
         ↓
Products created → Sold on Pantiku marketplace
         ↓
Revenue generated → Economic sustainability achieved
         ↓
Cycle repeats with improved capacity
```

### Key Mechanisms

**Needs Mapping**
- Assess child & orphanage profiles
- Identify specific skill gaps
- Determine productive opportunities

**Campaign-Based Support**
- "Buy a sewing machine for the children"
- "Fund a baking oven + 3-month training"
- Donors see direct impact of their contribution

**Marketplace Model**
- Products made by children/orphanages
- Sold with "story tags" about makers
- Purchase = continued support (not one-time donation)

**Clustered Efficiency**
- Group 5-10 children from nearby orphanages
- Shared trainers reduce costs 60-70%
- Quality mentoring at scale

---

## SLIDE 5: TECHNICAL STACK (MVP)

### Architecture Overview

```
┌─────────────────────────────────────────┐
│     PRESENTATION LAYER                  │
│  ┌──────────────┬──────────────┐        │
│  │ Mobile App   │  Web Portal  │        │
│  │ (iOS/Android)│ (Dashboard)  │        │
│  └──────────────┴──────────────┘        │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│     BUSINESS LOGIC LAYER                │
│  ┌──────────────────────────────┐       │
│  │ • Needs Matching Engine      │       │
│  │ • Campaign Management        │       │
│  │ • Impact Tracking            │       │
│  │ • Community Forum            │       │
│  └──────────────────────────────┘       │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│     DATA & INTEGRATION LAYER            │
│  ┌──────────────────────────────┐       │
│  │ • PostgreSQL Database        │       │
│  │ • Payment Gateway (Stripe)   │       │
│  │ • Cloud Storage (AWS S3)     │       │
│  │ • Analytics Engine           │       │
│  └──────────────────────────────┘       │
└─────────────────────────────────────────┘
```

### Tech Choices

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | React/React Native | Cross-platform, large community, quick iteration |
| **Backend** | Node.js + Express | JavaScript ecosystem, rapid development, scalable |
| **Database** | PostgreSQL | Relational integrity, complex queries, stability |
| **Marketplace** | Custom (built-in) | Tailored for donation-based model |
| **Payments** | Stripe API | Global reach, Indonesia support, reliable |
| **Cloud** | AWS | Scalability, regional availability (Singapore) |
| **Authentication** | JWT + OAuth2 | Secure, industry standard |

---

## SLIDE 6: ALGORITHM & MATCHING ENGINE

### Rule-Based Matching (MVP)

```
INPUT: Child Profile
├─ Age: 15
├─ Interests: Cooking, Design
├─ Education Level: Junior High
└─ Skills Gap: Need job readiness

MATCHING ENGINE
├─ Filter campaigns matching interests
├─ Check location clustering opportunity
├─ Assess available trainers in region
└─ Score donor preferences

OUTPUT: Recommendations
├─ "Culinary Skills for Employment"
├─ "Batch with 3 other children, 2km away"
├─ "Local mentor available Tue/Thu"
└─ Confidence score: 87%
```

### Future Enhancement (Phase 2)

- **ML-based recommendations** - Predict best program per child
- **Predictive matching** - Match future donor interests with emerging needs
- **Impact scoring** - Optimize for long-term outcomes

---

## SLIDE 7: DATA SECURITY & PRIVACY

### Security Principles

#### Data Classification
- **Public:** Campaign descriptions, general statistics
- **Confidential:** Child profiles, donor information
- **Restricted:** Financial data, family circumstances

#### Access Control
- **Role-based access (RBAC)**
  - Admin: Full system access
  - Orphanage Manager: Own facility + children data
  - Donor: Campaign & impact data only
  - Volunteer: Program & child progress only

#### Protection Measures
- End-to-end encryption for sensitive data
- PCI compliance for payments
- GDPR/Indonesia GDPR equivalent compliance
- Regular security audits
- Activity logging for accountability

### Privacy Policy Highlights

- Children's full names never exposed publicly
- Family circumstances anonymized
- Donor information protected
- No data sharing with third parties
- User consent required for all data processing

---

## SLIDE 8: SCALABILITY & INFRASTRUCTURE

### Horizontal Scaling Strategy

#### Phase 1: Pilot (MVP)
- 5-10 orphanages (capacity: 50-100 children)
- Single region (Jakarta)
- Monthly user growth: 10-15%

#### Phase 2: Regional Expansion
- 50+ orphanages (capacity: 500+ children)
- 3-4 major cities
- Infrastructure: Load balancing, CDN
- Database: Read replicas for reporting

#### Phase 3: National Scale
- 200+ orphanages (capacity: 2000+ children)
- All major cities + secondary markets
- Infrastructure: Multi-region deployment
- Database: Sharding by region

### Infrastructure Design

```
LOAD BALANCING
├─ AWS ELB (Elastic Load Balancer)
│
COMPUTE LAYER
├─ Auto-scaling groups (2-20 servers based on demand)
│
CACHING LAYER
├─ Redis for session management
├─ CloudFront CDN for static assets
│
DATABASE LAYER
├─ Primary: PostgreSQL (master)
├─ Read replicas (3x) for analytics
├─ Daily automated backups
│
STORAGE
├─ AWS S3 for documents/images
├─ Versioning & lifecycle policies
```

### Cost Optimization

- **MVP (50 children):** ~$2,000/month infrastructure
- **Scale (500 children):** ~$8,000/month (marginal cost per child)
- **Maturity (2000 children):** ~$20,000/month (~$10 per child/month)

---

## SLIDE 9: PHASED DEVELOPMENT ROADMAP

### Phase 1: MVP (Months 1-3)
**Goal:** Validate core concept with 1-2 pilot orphanages

**Deliverables:**
- ✓ Core platform architecture
- ✓ Needs mapping form & dashboard
- ✓ Simple marketplace (5-10 products)
- ✓ Payment integration (basic)
- ✓ Impact tracking dashboard
- ✓ Admin panel

**Team:** 2-3 engineers + 1 product manager

**Budget:** $15,000-20,000

### Phase 2: Private Beta (Months 4-6)
**Goal:** Expand to 10 orphanages, refine based on feedback

**Deliverables:**
- ✓ Mobile app (iOS/Android)
- ✓ Advanced matching engine
- ✓ Community forum
- ✓ Foster parent program
- ✓ Training module library
- ✓ Analytics dashboard v2

**Team:** 5-6 engineers + 2 product/design

**Budget:** $40,000-50,000

### Phase 3: Public Launch (Months 7-12)
**Goal:** Launch nationally, reach 50+ orphanages

**Deliverables:**
- ✓ Production-grade platform
- ✓ Marketing & outreach
- ✓ CSR partnership program
- ✓ Mentor network expansion
- ✓ ML-based recommendations
- ✓ Internship matching

**Team:** 8-10 engineers + 3-4 business/operations

**Budget:** $80,000-100,000

---

## SLIDE 10: REVENUE MODEL

### Diversified Revenue Streams

#### 1. **Marketplace Transaction Fees (40%)**
- 5% commission on product sales
- Example: Orphanage sells 100k product → 5k to Pantiku
- Annual projection (Year 2): $50,000

#### 2. **CSR Partnerships (35%)**
- Corporate donation coordination platform
- "Adopt an orphanage" programs
- Annual partnership fees: $5,000-20,000 per company
- Target: 5-10 corporate partners by Year 2
- Annual projection: $50,000-100,000

#### 3. **Premium Features (15%)**
- Orphanage managers: Advanced analytics ($50/month)
- Donors: Verified donor badge, priority campaigns ($10/month)
- Volunteers: Matching algorithm, scheduling tools ($15/month)
- Annual projection (Year 2): $30,000

#### 4. **Training & Consulting (10%)**
- Facilitator training modules ($1,000 per session)
- Business development consulting for orphanages
- Government/NGO partnerships
- Annual projection (Year 2): $20,000

### Financial Projections (5-Year Outlook)

| Metric | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|--------|--------|--------|--------|--------|--------|
| **Orphanages** | 5 | 25 | 100 | 250 | 500 |
| **Children** | 50 | 300 | 1,200 | 3,000 | 6,000 |
| **Revenue** | $15K | $150K | $600K | $1.5M | $3M |
| **Burn Rate** | $25K/mo | $15K/mo | $10K/mo | Break-even | Profitable |

---

## SLIDE 11: TEAM & CTO REQUIREMENTS

### Current Team

**Eko Kristino Butar-Butar - Founder & CEO**
- Background: Community development + social entrepreneurship
- Role: Strategy, partnerships, program design
- Seeking: Co-founder (CTO) to lead technical development

### Ideal CTO Profile

**Technical Requirements:**
- 5+ years full-stack development (backend-heavy)
- Experience with Node.js/Python + React
- Database design (PostgreSQL/NoSQL)
- API architecture & scalability
- Cloud infrastructure (AWS or equivalent)

**Soft Skills:**
- Passion for social impact
- Ability to lead & mentor engineers
- Product-minded (not just "code"
- Entrepreneurial mindset
- Collaborative with non-tech stakeholders

**Expectations:**
- Equity: 15-25% co-founder stake
- Salary: Flexible (can start lean/bootstrap phase)
- Timeline: 3-5 year commitment
- Location: Jakarta-based or remote-capable

### Supporting Roles (Future Hires)

| Role | Timeline | Seniority |
|------|----------|-----------|
| **Senior Backend Engineer** | Month 2 | Mid-level |
| **Frontend Engineer** | Month 3 | Mid-level |
| **Product Manager** | Month 4 | Junior-Mid |
| **DevOps Engineer** | Month 6 | Mid-level |
| **Community Manager** | Month 6 | Junior |

---

## SLIDE 12: GO-TO-MARKET STRATEGY

### Target Acquisition Channels

#### Phase 1: Direct Outreach
- **Orphanage networks** (religious organizations, NGOs)
- **Social media campaigns** (Instagram, TikTok for donors)
- **Press & media** (heartwarming human-interest stories)
- **Government partnerships** (BKKBN, Kementerian Sosial)

#### Phase 2: Ecosystem Partnerships
- **Corporate CSR programs** (30-50 companies)
- **University volunteer programs** (mentorship)
- **NGO coalitions** (joint campaigns)
- **Financial institutions** (embedded giving)

#### Phase 3: Viral/Community-Driven
- **Influencer advocacy** (ambassadors)
- **Success stories** (video testimonials)
- **Community referrals** (donor networks)
- **B2B marketplace integration** (e-commerce platforms)

### Marketing Metrics

| Metric | Target Year 1 | Target Year 2 |
|--------|---------------|---------------|
| **Monthly active users** | 500 | 5,000 |
| **Donor conversion rate** | 15% | 20% |
| **Campaign completion rate** | 70% | 85% |
| **Net Promoter Score (NPS)** | 50+ | 60+ |
| **Cost per acquisition** | $20 | $10 |

---

## SLIDE 13: IMPACT METRICS & SUCCESS

### Measuring Impact

#### Child Level
- ✓ **Skill Development:** Pre/post assessment scores
- ✓ **Confidence:** Psychometric testing
- ✓ **Readiness:** Employability indicators
- ✓ **Graduation:** Placement rates

#### Orphanage Level
- ✓ **Revenue Generated:** IDR/month from activities
- ✓ **Sustainability:** Months of operation self-funded
- ✓ **Capacity:** Children enrolled in programs
- ✓ **Network:** Partnerships & resources

#### System Level
- ✓ **Reach:** Total children & orphanages served
- ✓ **Cost Efficiency:** Cost per child per month
- ✓ **Donor Engagement:** Repeat donation rate
- ✓ **Scale:** Geographic expansion speed

### Long-Term Vision (5-10 Years)

**By 2030, Pantiku aspires to:**
- Serve **10,000+ children** across Indonesia
- Operate **500+ sustainable orphanage programs**
- Generate **$100M+ in productive economic activity**
- Establish **panti asuhan as talent development hubs** (not just shelters)
- Demonstrate **replicable model** for other emerging markets

---

## SLIDE 14: CALL TO ACTION

### What We Need Now

**To Build the MVP:**
- ✓ **Visionary CTO** - Lead technical architecture & team
- ✓ **Initial funding** - $50,000-75,000 for 6-month runway
- ✓ **Orphanage partners** - 2-3 willing pilots
- ✓ **Advisor network** - Tech, social, business expertise

### Why Now?

1. **Digital readiness in Indonesia** - Mobile penetration 80%+
2. **Donor fatigue** - People want impact, not just giving
3. **Orphanage challenges** - Post-pandemic, needs are acute
4. **Tech capability** - Tools available, costs low
5. **Team ready** - Founder committed, market validated

### Investment Thesis

**This is not charity software. This is:**
- A **sustainable business model** (profitable by Year 3)
- A **scalable social tech** (1000x impact potential)
- A **cultural shift** (reimagining orphanages)
- A **market opportunity** (similar models in Southeast Asia)

---

## SLIDE 15: Q&A

### Contact Information

**Eko Kristino Butar-Butar**
- Email: butarbutarkristino@gmail.com
- Phone: 0811 6121 146
- Location: Jakarta, Indonesia

### Resources

- **Detailed proposal:** https://drive.google.com/drive/folders/1TDguPTji01dileyTbUijyYXKJcB5PbXW?usp=sharing
- **Demo mockups:** [Coming soon with CTO]
- **Pilot orphanages:** Ready for engagement

### Next Steps

1. **Week 1:** CTO interviews & alignment
2. **Week 2:** Funding discussions
3. **Week 3:** Orphanage partnership agreements
4. **Week 4:** Development kickoff

---

## APPENDIX: Technical Deep Dives

### A1: Database Schema (MVP)

```sql
-- Core tables for MVP
CREATE TABLE orphanages (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  location POINT,
  manager_name VARCHAR(255),
  contact_phone VARCHAR(20),
  children_count INT,
  capabilities TEXT[],
  created_at TIMESTAMP
);

CREATE TABLE children (
  id UUID PRIMARY KEY,
  orphanage_id UUID REFERENCES orphanages(id),
  name_hash VARCHAR(255),  -- Anonymized
  age INT,
  interests TEXT[],
  skills TEXT[],
  education_level VARCHAR(50),
  enrollment_status VARCHAR(50),
  updated_at TIMESTAMP
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  orphanage_id UUID REFERENCES orphanages(id),
  title VARCHAR(255),
  description TEXT,
  goal_amount INT (IDR),
  current_amount INT,
  deadline DATE,
  status VARCHAR(50),
  items_needed TEXT[],
  created_at TIMESTAMP
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  orphanage_id UUID REFERENCES orphanages(id),
  name VARCHAR(255),
  description TEXT,
  price INT (IDR),
  category VARCHAR(100),
  story TEXT,
  inventory INT,
  created_at TIMESTAMP
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  donor_id UUID REFERENCES users(id),
  amount INT (IDR),
  transaction_date TIMESTAMP,
  platform_fee_pct DECIMAL,
  platform_fee_amt INT,
  created_at TIMESTAMP
);
```

### A2: API Endpoints (MVP)

```
=== AUTHENTICATION ===
POST   /auth/register          - Register (orphanage/donor/volunteer)
POST   /auth/login             - Login with email/password
POST   /auth/logout            - Logout
POST   /auth/refresh           - Refresh JWT token

=== ORPHANAGE MANAGEMENT ===
GET    /orphanages/:id         - Get orphanage profile
PUT    /orphanages/:id         - Update profile
GET    /orphanages/:id/children - List children (anonymized)
POST   /orphanages/:id/children - Add child profile
GET    /orphanages/:id/campaigns - List campaigns
POST   /orphanages/:id/campaigns - Create campaign

=== CAMPAIGNS & FUNDRAISING ===
GET    /campaigns              - List active campaigns
GET    /campaigns/:id          - Get campaign details
POST   /campaigns/:id/donate   - Make donation
GET    /campaigns/:id/donors   - List donors (anonymized)

=== MARKETPLACE ===
GET    /products              - List products
GET    /products/:id          - Get product details
POST   /orders                - Create order
GET    /orders/:id            - Get order details
GET    /orders/:id/receipt    - Get receipt/invoice

=== IMPACT TRACKING ===
GET    /impact/dashboard      - System-wide metrics
GET    /orphanages/:id/impact - Orphanage-specific metrics
GET    /children/:id/progress - Child development progress

=== ADMIN ===
GET    /admin/users           - List all users
GET    /admin/transactions    - All transaction history
GET    /admin/reports         - Financial & impact reports
```

### A3: Security Checklist

- [ ] JWT tokens with 15-minute expiration
- [ ] HTTPS only, HSTS headers enabled
- [ ] CORS configured for trusted domains
- [ ] Rate limiting (100 req/min per IP)
- [ ] Input validation & sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (content security headers)
- [ ] CSRF tokens for state-changing operations
- [ ] Password hashing (bcrypt, cost=12)
- [ ] PII encryption at rest
- [ ] Audit logging for sensitive operations
- [ ] Regular security testing (monthly)
- [ ] Incident response plan

---

## SLIDE 16: Timeline & Milestones

### 90-Day MVP Sprint

```
WEEK 1-2:  Architecture, database design, API scaffolding
WEEK 3-4:  Backend core (auth, campaigns, products)
WEEK 5-6:  Frontend (web dashboard, responsive design)
WEEK 7-8:  Marketplace MVP, payment integration
WEEK 9-10: Testing, bug fixes, deployment
WEEK 11-12: Pilot with 1 orphanage, gather feedback
WEEK 13:   Document, handoff, plan Phase 2
```

### Key Decisions Needed (Week 1)

1. **Frontend Framework** - React (web) + React Native (mobile) or Flutter?
2. **Backend Language** - Node.js or Python/Django?
3. **Database** - PostgreSQL only or PostgreSQL + Redis?
4. **Hosting** - AWS, GCP, or Digital Ocean?
5. **Payment Gateway** - Stripe, Xendit, or Doku?

---

**END OF DECK**

**Questions? Email: butarbutarkristino@gmail.com**
