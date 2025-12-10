# MultiCore CRM - System Overview

## Architecture

### Multi-Tenant System
- **One Platform → Many Businesses (Tenants)**
- Strict data isolation using `business_id` (tenantId) discriminator field
- Super Admin manages platform but cannot access company data
- Each business operates in its own isolated data space

## User Roles & Access Levels (9 Roles)

### Platform Level
1. **Super Admin**
   - Full platform control
   - Manages tenants, subscriptions, platform settings
   - Cannot access individual company data
   - Registered manually in database

### Business Level
2. **Owner (Business Admin)**
   - Full control within a single business
   - Registered by Super Admin
   - Manages staff, business settings, pipelines
   - Only login (no self-registration)

3. **Sales Manager**
   - Manages sales team
   - Access to leads, deals, customers
   - Team management capabilities
   - Only login (registered by Owner)

4. **Sales Agent**
   - Assigned leads and tasks
   - Customer interactions
   - Deal management
   - Only login (registered by Owner)

5. **Support Manager**
   - Manages support team
   - Ticket oversight and SLA management
   - Team administration
   - Only login (registered by Owner)

6. **Support Agent**
   - Handles customer issues
   - Ticket management
   - Customer communication
   - Only login (registered by Owner)

7. **Finance**
   - Billing and invoices
   - Financial reports
   - Read-only for most features
   - Only login (registered by Owner)

8. **Viewer (Read-Only)**
   - Can only view data
   - No editing capabilities
   - Dashboard and reports access
   - Only login (registered by Owner)

9. **Customer**
   - Front-facing portal access
   - Can both register AND login
   - Ticket submission and tracking
   - Appointment viewing

## Core Features

### A. Platform-Level Features (Super Admin Only)
- Multi-tenant architecture management
- Tenant onboarding and management
- Subscription plan management
- Global system settings
- Platform monitoring and analytics
- System health & uptime tracking

### B. Company-Level Features

#### 1. User & Role Management
- Add/edit/delete staff
- Assign predefined RBAC roles
- Role-based permissions
- Notification preferences
- User suspension/reactivation

#### 2. Customer Management (23 Entities)
- Customer profiles with full details
- Contact info, preferences, tags
- Customer segmentation
- Timeline view (tickets, leads, appointments, notes)
- Soft-delete + restore
- Customer-business relationships (prospect/client/vendor/partner)

#### 3. Lead Management
- Lead creation and assignment
- Status tracking: New, Contacted, Qualified, Lost
- Lead scoring (0-100)
- Lead filtering & segmentation
- Notes and file attachments
- Timeline of interactions
- Convert lead → customer (transactional)
- Product/service linking

#### 4. Deal Management
- Sales opportunity tracking
- Deal stages: Prospecting, Qualification, Proposal, Negotiation, Won, Lost
- Amount and probability tracking
- Product linking
- Deal activities and history
- Expected close dates

#### 5. Follow-Up Task Management
- Task assignment to staff
- Reminders & due dates
- Task dashboard per user
- Task statuses (pending/in_progress/completed/cancelled)
- Overdue task notifications
- Related to customers, leads, or deals

#### 6. Appointment Scheduling
- Schedule appointments with customers
- Staff assignment
- Status tracking (scheduled, completed, cancelled, no_show)
- Full calendar view
- Customer appointment history
- Location and notes

#### 7. Product & Services Catalog
- Products and services management
- Price, description, tags, categories
- Active/inactive status
- Link items to leads, deals, tickets

#### 8. Interaction Logging
- Log calls, emails, meetings, chats
- Auto-generated summaries
- Sentiment analysis (positive, neutral, negative)
- Timeline view
- Notes and attachments
- Keywords tracking

#### 9. Support Ticketing System
- Customer ticket creation
- Support agent responses
- Ticket categories & priorities (low, medium, high, urgent)
- SLA tracking (response & resolution time)
- Ticket history and status changes
- Attachments + internal notes
- Escalation rules
- Ticket analytics

#### 10. AI-Powered Features
##### a) Lead Matching Engine
- Matches customers with best-suited business/services
- Generates "Match Score"
- Provides explanation and reasoning

##### b) Recommendation Engine
- Shows AI recommendations to sales agents
- Types: lead_match, customer_suggestion, deal_insight, upsell_opportunity, churn_risk
- Tracks history for analytics
- Accept/reject recommendations

#### 11. Analytics & Dashboards
- Lead analytics and conversion rates
- Sales pipeline analytics
- Ticket analytics and SLA performance
- Customer growth metrics
- Staff productivity tracking
- AI performance metrics
- Appointment activity reports
- Interaction sentiment analysis

#### 12. Notifications
- In-app alerts
- Email alerts (if enabled)
- Alerts for: Lead assignment, Ticket updates, Task reminders, Appointment updates
- Mark as read/unread

#### 13. Audit Logging
- Log every action
- Store: user ID, action, timestamp, entity, entity ID
- Compliance and debugging support
- IP address tracking

#### 14. Business Settings
- Business profile
- Branding (logo, color theme)
- Role permissions configuration
- Lead pipeline stages
- Support categories & priorities

### C. Customer Portal Features
For external customers of a business:
- View profile
- Submit & track tickets
- View appointments
- Access documents / invoices
- View deals or service progress

## Entity Model (23 Entities)

1. **User** - Authentication & authorization
2. **Role** - Permission levels
3. **Permission** - Granular permissions
4. **Business** - Tenant/company
5. **UserBusiness** - Maps users to businesses
6. **Customer** - Customer profiles
7. **CustomerBusinessMatch** - Customer-business relationships
8. **Lead** - Potential customers
9. **LeadActivity** - Lead timeline
10. **Deal** - Sales opportunities
11. **DealActivity** - Deal history
12. **FollowUpTask** - Task management
13. **Ticket** - Support issues
14. **TicketComment** - Ticket conversations
15. **TicketHistory** - Ticket state changes
16. **SLA** - Service-level agreements
17. **Product** - Items/products
18. **BusinessService** - Services offered
19. **SubscriptionPlan** - Platform plans
20. **BusinessSubscription** - Business subscriptions
21. **Notification** - System alerts
22. **AuditLog** - System operations log
23. **Appointment** - Scheduling system

## Authentication Flow

### Super Admin
- Login only (manually registered)
- No self-registration
- Platform-wide access

### Owner (Business Admin)
- Login only
- Registered by Super Admin
- Business-specific access

### Staff (Sales + Support + Finance + Viewer)
- Login only (no self-registration)
- Created by Owner
- Assigned to specific business
- Permissions depend on role

### Customer
- Can REGISTER + LOGIN
- Access limited customer portal
- Tickets, appointments, profile, documents

## Data Isolation

- All domain data filtered by `tenantId` (business_id)
- Sales Agent from Business A cannot see Business B's data
- Owners manage only their own company
- Super Admin has platform view but not company data access

## Key Technologies

- **Frontend**: React + TypeScript
- **State Management**: React Context API
- **UI Components**: Custom component library with Tailwind CSS
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **Routing**: View-based switching

## Navigation Structure

### Super Admin Navigation
- Dashboard
- Tenants
- Subscriptions
- Platform Settings

### Business User Navigation

#### SALES Section
- Customers
- Leads
- Deals
- Tasks
- Appointments
- Products

#### ENGAGEMENT Section
- Interactions
- Support Tickets

#### AI & INSIGHTS Section (Sales roles only)
- AI Matching
- Analytics

#### SYSTEM Section
- Notifications
- Audit Logs (Managers only)

#### ADMIN Section (Managers only)
- Team Management
- Settings

## Current Implementation Status

✅ All 23 entities defined and integrated
✅ All 9 user roles implemented with proper access control
✅ Multi-tenant architecture with data isolation
✅ Complete CRUD operations for all entities
✅ Role-based navigation and permissions
✅ Authentication flow (login/register)
✅ Analytics dashboard with charts
✅ AI recommendation system structure
✅ Customer portal
✅ Audit logging framework
✅ Notification system
✅ SLA tracking for tickets

## Demo Users

1. **admin@platform.com** - Super Admin (Platform)
2. **john@acme.com** - Owner (Acme Corporation)
3. **sarah@acme.com** - Sales Manager (Acme)
4. **mike@acme.com** - Sales Agent (Acme)
5. **lisa@acme.com** - Support Manager (Acme)
6. **emma@acme.com** - Support Agent (Acme)
7. **david@acme.com** - Finance (Acme)
8. **rachel@acme.com** - Viewer (Acme)
9. **customer@example.com** - Customer (Portal Access)

## Next Steps for Backend Integration

When connecting to your Spring Boot backend:

1. Replace mock data with API calls
2. Implement JWT authentication
3. Add API interceptors for tenant ID injection
4. Implement real-time notifications (WebSockets)
5. Add file upload functionality
6. Implement actual AI/ML endpoints
7. Add email notification service integration
8. Implement proper audit logging to database
9. Add role-based API endpoint restrictions
10. Implement SLA breach monitoring
