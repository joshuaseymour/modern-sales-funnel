-- =====================================================
-- Modern Sales Funnel Database Schema for Supabase
-- Production-Ready PostgreSQL Schema with RLS
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

-- Order status types
CREATE TYPE order_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'cancelled',
  'refunded'
);

-- Payment status types
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

-- Product types for the funnel
CREATE TYPE product_type AS ENUM (
  'tripwire',
  'bump',
  'upsell',
  'downsell'
);

-- Funnel step tracking
CREATE TYPE funnel_step AS ENUM (
  'landing',
  'checkout',
  'thankyou'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Customers table - stores customer information
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- GDPR compliance fields
  consent_given BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMP WITH TIME ZONE,
  marketing_consent BOOLEAN DEFAULT false,
  -- Customer lifetime value tracking
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  order_count INTEGER DEFAULT 0,
  last_purchase_at TIMESTAMP WITH TIME ZONE,
  -- Customer status
  is_active BOOLEAN DEFAULT true,
  -- Additional metadata
  source VARCHAR(100), -- UTM source or referral source
  ip_address INET,
  user_agent TEXT
);

-- Products table - configurable product catalog
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type product_type NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  perceived_value DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Product configuration
  features JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  -- Display order in funnel
  display_order INTEGER DEFAULT 0
);

-- Orders table - main order tracking
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'ORD-' || EXTRACT(epoch FROM NOW())::TEXT || '-' || substr(uuid_generate_v4()::text, 1, 8),
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Order metadata
  notes TEXT,
  source VARCHAR(100), -- Where the order originated
  session_id VARCHAR(255), -- Browser session tracking
  -- Guarantee tracking
  guarantee_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  -- Payment tracking
  payment_method VARCHAR(50),
  last_four_digits VARCHAR(4), -- Last 4 digits of card for display
  -- Fulfillment
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  tracking_number VARCHAR(100),
  currency VARCHAR(3) DEFAULT 'USD'
);

-- Order items table - individual products in orders
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table - payment transaction tracking
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status payment_status DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  processor_transaction_id VARCHAR(255), -- Stripe/PayPal transaction ID
  processor_name VARCHAR(50), -- stripe, paypal, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  -- Payment processor response data
  processor_response JSONB,
  -- Refund tracking
  refunded_amount DECIMAL(10,2) DEFAULT 0.00,
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_reason TEXT
);

-- =====================================================
-- ANALYTICS & TRACKING TABLES
-- =====================================================

-- Funnel sessions - tracks user journey through the funnel
CREATE TABLE funnel_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  current_step funnel_step DEFAULT 'landing',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  -- Conversion tracking
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2) DEFAULT 0.00,
  -- UTM and source tracking
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  referrer TEXT,
  -- Device and location
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(2),
  city VARCHAR(100),
  -- A/B Testing
  variant VARCHAR(50),
  -- Additional metadata
  metadata JSONB DEFAULT '{}'
);

-- Funnel events - detailed event tracking within sessions
CREATE TABLE funnel_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES funnel_sessions(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- 'page_view', 'button_click', 'form_submit', etc.
  step funnel_step NOT NULL,
  data JSONB DEFAULT '{}', -- Additional event data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email subscriptions and preferences
CREATE TABLE email_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  subscribed BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(100), -- How they subscribed
  preferences JSONB DEFAULT '{}', -- Email preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(customer_id, email)
);

-- Refunds table - separate refund tracking
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processed, failed
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processor_refund_id VARCHAR(255), -- Stripe refund ID
  notes TEXT,
  created_by UUID -- Could reference an admin user table
);

-- Feature flags table for A/B testing and gradual rollouts
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_audience JSONB DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Customer indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_customers_last_purchase ON customers(last_purchase_at);
CREATE INDEX idx_customers_total_spent ON customers(total_spent);

-- Product indexes
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_display_order ON products(display_order);

-- Order indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_total_amount ON orders(total_amount);
CREATE INDEX idx_orders_session_id ON orders(session_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Payment indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_processor_transaction_id ON payments(processor_transaction_id);

-- Funnel session indexes
CREATE INDEX idx_funnel_sessions_session_id ON funnel_sessions(session_id);
CREATE INDEX idx_funnel_sessions_customer_id ON funnel_sessions(customer_id);
CREATE INDEX idx_funnel_sessions_started_at ON funnel_sessions(started_at);
CREATE INDEX idx_funnel_sessions_converted ON funnel_sessions(converted);
CREATE INDEX idx_funnel_sessions_utm_source ON funnel_sessions(utm_source);
CREATE INDEX idx_funnel_sessions_utm_campaign ON funnel_sessions(utm_campaign);

-- Funnel events indexes
CREATE INDEX idx_funnel_events_session_id ON funnel_events(session_id);
CREATE INDEX idx_funnel_events_event_type ON funnel_events(event_type);
CREATE INDEX idx_funnel_events_step ON funnel_events(step);
CREATE INDEX idx_funnel_events_created_at ON funnel_events(created_at);

-- Email subscription indexes
CREATE INDEX idx_email_subscriptions_customer_id ON email_subscriptions(customer_id);
CREATE INDEX idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX idx_email_subscriptions_subscribed ON email_subscriptions(subscribed);

-- Refund indexes
CREATE INDEX idx_refunds_order_id ON refunds(order_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_refunds_requested_at ON refunds(requested_at);

-- Feature flag indexes
CREATE INDEX idx_feature_flags_name ON feature_flags(name);
CREATE INDEX idx_feature_flags_enabled ON feature_flags(enabled);

-- Composite indexes for common queries
CREATE INDEX idx_orders_customer_status_date ON orders(customer_id, status, created_at);
CREATE INDEX idx_funnel_sessions_conversion_date ON funnel_sessions(converted, started_at);
CREATE INDEX idx_products_type_active ON products(type, is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable (for the funnel)
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (is_active = true);

-- Feature flags are publicly readable for frontend
CREATE POLICY "Feature flags are publicly readable" ON feature_flags
  FOR SELECT USING (enabled = true);

-- Customers: allow anonymous creation, authenticated access to own data
CREATE POLICY "Anyone can create customers" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view own data" ON customers
  FOR SELECT USING (
    email = COALESCE(auth.jwt() ->> 'email', 'anonymous')
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Customers can update own data" ON customers
  FOR UPDATE USING (
    email = auth.jwt() ->> 'email'
    OR auth.role() = 'service_role'
  );

-- Orders: customers can view/create their own orders, service role has full access
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = COALESCE(auth.jwt() ->> 'email', 'anonymous')
    )
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Service role can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'service_role');

-- Order items: accessible through order relationship
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view own order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o 
      JOIN customers c ON o.customer_id = c.id 
      WHERE c.email = COALESCE(auth.jwt() ->> 'email', 'anonymous')
    )
    OR auth.role() = 'service_role'
  );

-- Payments: customers can view their own payments, service role can manage
CREATE POLICY "Service role can manage payments" ON payments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Customers can view own payments" ON payments
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o 
      JOIN customers c ON o.customer_id = c.id 
      WHERE c.email = COALESCE(auth.jwt() ->> 'email', 'anonymous')
    )
  );

-- Funnel sessions: allow anonymous and authenticated access for tracking
CREATE POLICY "Allow funnel session tracking" ON funnel_sessions
  FOR ALL USING (true);

-- Funnel events: allow anonymous and authenticated access for tracking
CREATE POLICY "Allow funnel event tracking" ON funnel_events
  FOR ALL USING (true);

-- Email subscriptions: customers can manage their own subscriptions
CREATE POLICY "Anyone can create email subscriptions" ON email_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can manage own subscriptions" ON email_subscriptions
  FOR ALL USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = COALESCE(auth.jwt() ->> 'email', 'anonymous')
    )
    OR auth.role() = 'service_role'
  );

-- Refunds: customers can view their own refunds, service role can manage
CREATE POLICY "Service role can manage refunds" ON refunds
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Customers can view own refunds" ON refunds
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o 
      JOIN customers c ON o.customer_id = c.id 
      WHERE c.email = COALESCE(auth.jwt() ->> 'email', 'anonymous')
    )
  );

-- =====================================================
-- TRIGGERS FOR AUTOMATION
-- =====================================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_subscriptions_updated_at BEFORE UPDATE ON email_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update customer stats when orders change
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE customers 
    SET 
      total_spent = COALESCE((
        SELECT SUM(total_amount) 
        FROM orders 
        WHERE customer_id = NEW.customer_id AND status = 'completed'
      ), 0),
      order_count = COALESCE((
        SELECT COUNT(*) 
        FROM orders 
        WHERE customer_id = NEW.customer_id AND status = 'completed'
      ), 0),
      last_purchase_at = (
        SELECT MAX(created_at) 
        FROM orders 
        WHERE customer_id = NEW.customer_id AND status = 'completed'
      )
    WHERE id = NEW.customer_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE customers 
    SET 
      total_spent = COALESCE((
        SELECT SUM(total_amount) 
        FROM orders 
        WHERE customer_id = OLD.customer_id AND status = 'completed'
      ), 0),
      order_count = COALESCE((
        SELECT COUNT(*) 
        FROM orders 
        WHERE customer_id = OLD.customer_id AND status = 'completed'
      ), 0),
      last_purchase_at = (
        SELECT MAX(created_at) 
        FROM orders 
        WHERE customer_id = OLD.customer_id AND status = 'completed'
      )
    WHERE id = OLD.customer_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- Update order totals when order items change
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE orders 
    SET subtotal = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM order_items 
      WHERE order_id = NEW.order_id
    ),
    total_amount = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM order_items 
      WHERE order_id = NEW.order_id
    ) + COALESCE(tax_amount, 0) - COALESCE(discount_amount, 0)
    WHERE id = NEW.order_id;
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE orders 
    SET subtotal = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM order_items 
      WHERE order_id = OLD.order_id
    ),
    total_amount = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM order_items 
      WHERE order_id = OLD.order_id
    ) + COALESCE(tax_amount, 0) - COALESCE(discount_amount, 0)
    WHERE id = OLD.order_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_totals();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Customer summary view with lifetime stats
CREATE VIEW customer_summary AS
SELECT 
  c.id,
  c.email,
  c.name,
  c.created_at,
  c.total_spent,
  c.order_count,
  c.last_purchase_at,
  c.is_active,
  c.source,
  -- Recent activity
  COUNT(o.id) FILTER (WHERE o.created_at >= NOW() - INTERVAL '30 days') as orders_last_30_days,
  SUM(o.total_amount) FILTER (WHERE o.created_at >= NOW() - INTERVAL '30 days') as revenue_last_30_days,
  -- Average order value
  CASE WHEN c.order_count > 0 THEN c.total_spent / c.order_count ELSE 0 END as avg_order_value
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
GROUP BY c.id, c.email, c.name, c.created_at, c.total_spent, c.order_count, 
         c.last_purchase_at, c.is_active, c.source;

-- Funnel conversion analytics view
CREATE VIEW funnel_analytics AS
SELECT 
  DATE_TRUNC('day', started_at) as date,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE current_step = 'checkout' OR completed_at IS NOT NULL) as reached_checkout,
  COUNT(*) FILTER (WHERE converted = true) as conversions,
  SUM(conversion_value) FILTER (WHERE converted = true) as total_revenue,
  -- Conversion rates
  ROUND(
    COUNT(*) FILTER (WHERE current_step = 'checkout' OR completed_at IS NOT NULL)::DECIMAL 
    / NULLIF(COUNT(*), 0) * 100, 2
  ) as checkout_rate_percent,
  ROUND(
    COUNT(*) FILTER (WHERE converted = true)::DECIMAL 
    / NULLIF(COUNT(*), 0) * 100, 2
  ) as conversion_rate_percent,
  -- Average order value
  ROUND(
    SUM(conversion_value) FILTER (WHERE converted = true) 
    / NULLIF(COUNT(*) FILTER (WHERE converted = true), 0), 2
  ) as avg_order_value
FROM funnel_sessions
GROUP BY DATE_TRUNC('day', started_at)
ORDER BY date DESC;

-- Product performance view
CREATE VIEW product_performance AS
SELECT 
  p.id,
  p.name,
  p.type,
  p.price,
  COUNT(oi.id) as total_sold,
  SUM(oi.total_price) as total_revenue,
  COUNT(DISTINCT oi.order_id) as unique_orders,
  ROUND(AVG(oi.unit_price), 2) as avg_selling_price
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
WHERE p.is_active = true
GROUP BY p.id, p.name, p.type, p.price
ORDER BY total_revenue DESC NULLS LAST;

-- Order details view with customer and product info
CREATE VIEW order_details AS
SELECT 
  o.id as order_id,
  o.order_number,
  o.status,
  o.total_amount,
  o.created_at,
  o.guarantee_expires_at,
  c.email as customer_email,
  c.name as customer_name,
  -- Aggregate product info
  ARRAY_AGG(
    JSON_BUILD_OBJECT(
      'product_name', p.name,
      'product_type', p.type,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price,
      'total_price', oi.total_price
    )
  ) as items
FROM orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
GROUP BY o.id, o.order_number, o.status, o.total_amount, o.created_at, 
         o.guarantee_expires_at, c.email, c.name;

-- =====================================================
-- SECURITY FUNCTIONS
-- =====================================================

-- Function to get current customer ID from email
CREATE OR REPLACE FUNCTION get_customer_by_email(customer_email TEXT)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM customers 
    WHERE email = customer_email
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or get customer
CREATE OR REPLACE FUNCTION upsert_customer(
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50) DEFAULT NULL,
  customer_source VARCHAR(100) DEFAULT NULL,
  customer_ip INET DEFAULT NULL,
  customer_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  customer_id UUID;
BEGIN
  INSERT INTO customers (email, name, phone, source, ip_address, user_agent)
  VALUES (customer_email, customer_name, customer_phone, customer_source, customer_ip, customer_user_agent)
  ON CONFLICT (email) 
  DO UPDATE SET 
    name = EXCLUDED.name,
    phone = COALESCE(EXCLUDED.phone, customers.phone),
    updated_at = NOW()
  RETURNING id INTO customer_id;
  
  RETURN customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check feature flag access
CREATE OR REPLACE FUNCTION has_feature_access(feature_name VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  feature_enabled BOOLEAN;
BEGIN
  SELECT enabled INTO feature_enabled 
  FROM feature_flags 
  WHERE name = feature_name;
  
  RETURN COALESCE(feature_enabled, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create complete order with items
CREATE OR REPLACE FUNCTION create_order_with_items(
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  product_ids UUID[],
  quantities INTEGER[],
  session_id VARCHAR(255) DEFAULT NULL,
  order_source VARCHAR(100) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  customer_id UUID;
  order_id UUID;
  product_id UUID;
  quantity INTEGER;
  product_price DECIMAL(10,2);
  i INTEGER;
BEGIN
  -- Get or create customer
  customer_id := upsert_customer(customer_email, customer_name);
  
  -- Create order
  INSERT INTO orders (customer_id, session_id, source)
  VALUES (customer_id, session_id, order_source)
  RETURNING id INTO order_id;
  
  -- Add order items
  FOR i IN 1..array_length(product_ids, 1) LOOP
    product_id := product_ids[i];
    quantity := quantities[i];
    
    -- Get product price
    SELECT price INTO product_price FROM products WHERE id = product_id;
    
    -- Insert order item
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES (order_id, product_id, quantity, product_price, product_price * quantity);
  END LOOP;
  
  RETURN order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert default products based on your constants
INSERT INTO products (id, name, description, type, price, perceived_value, features, display_order) VALUES
(
  uuid_generate_v4(),
  'DIY Solution',
  'Everything you need to get started on your own',
  'tripwire',
  97.00,
  997.00,
  '["Complete sales funnel template", "Step-by-step implementation guide", "Email sequence templates", "24/7 email support"]'::jsonb,
  1
),
(
  uuid_generate_v4(),
  'Quick Start Guide',
  'Accelerate your success with our step-by-step video training',
  'bump',
  47.00,
  297.00,
  '["3-hour video training", "Copy-paste email templates", "30-day action plan", "Bonus: Social media content calendar"]'::jsonb,
  2
),
(
  uuid_generate_v4(),
  'Done-For-You',
  'Let our experts build and optimize your funnel',
  'upsell',
  9997.00,
  14997.00,
  '["Custom funnel strategy session", "Complete funnel setup", "Landing page design", "Email automation setup", "3 months of management", "Priority support"]'::jsonb,
  3
),
(
  uuid_generate_v4(),
  'Done-With-You',
  'Hands-on guidance to build your funnel together',
  'downsell',
  997.00,
  3997.00,
  '["4 weekly 1:1 coaching calls", "Funnel strategy session", "Implementation support", "Email template review", "2 weeks of Voxer support"]'::jsonb,
  4
);

-- Insert default feature flags
INSERT INTO feature_flags (name, description, enabled, rollout_percentage) VALUES
('dark_mode', 'Enable dark mode for all users', true, 100),
('reduced_motion', 'Enable reduced motion preferences', true, 100),
('advanced_analytics', 'Show advanced analytics dashboard', false, 25),
('ai_chat_support', 'Enable AI-powered chat support', false, 10),
('social_proof_enhanced', 'Enhanced social proof elements', true, 75),
('order_bump_default', 'Show order bump by default', true, 100),
('upsell_flow_enabled', 'Enable upsell/downsell flow', true, 100);

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant necessary permissions for authenticated users
GRANT SELECT ON products TO authenticated;
GRANT SELECT, INSERT, UPDATE ON customers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
GRANT SELECT, INSERT ON order_items TO authenticated;
GRANT SELECT, INSERT ON payments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON funnel_sessions TO authenticated;
GRANT SELECT, INSERT ON funnel_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_subscriptions TO authenticated;
GRANT SELECT ON refunds TO authenticated;
GRANT SELECT ON feature_flags TO authenticated;

-- Grant access to views
GRANT SELECT ON customer_summary TO authenticated;
GRANT SELECT ON funnel_analytics TO authenticated;
GRANT SELECT ON product_performance TO authenticated;
GRANT SELECT ON order_details TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_customer_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_customer(VARCHAR, VARCHAR, VARCHAR, VARCHAR, INET, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION has_feature_access(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION create_order_with_items(VARCHAR, VARCHAR, UUID[], INTEGER[], VARCHAR, VARCHAR) TO authenticated;

-- Anonymous users can track funnel events, view products, and create orders
GRANT SELECT ON products TO anon;
GRANT SELECT, INSERT, UPDATE ON funnel_sessions TO anon;
GRANT SELECT, INSERT ON funnel_events TO anon;
GRANT INSERT ON customers TO anon;
GRANT INSERT ON orders TO anon;
GRANT INSERT ON order_items TO anon;
GRANT SELECT ON feature_flags TO anon;
GRANT EXECUTE ON FUNCTION upsert_customer(VARCHAR, VARCHAR, VARCHAR, VARCHAR, INET, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION create_order_with_items(VARCHAR, VARCHAR, UUID[], INTEGER[], VARCHAR, VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION has_feature_access(VARCHAR) TO anon;

-- Service role has full access (for backend operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Comments for documentation
COMMENT ON TABLE customers IS 'Customer information and lifetime value tracking';
COMMENT ON TABLE products IS 'Product catalog for the sales funnel';
COMMENT ON TABLE orders IS 'Order tracking with guarantee and fulfillment info';
COMMENT ON TABLE order_items IS 'Individual items within orders';
COMMENT ON TABLE payments IS 'Payment processing and transaction tracking';
COMMENT ON TABLE funnel_sessions IS 'User journey tracking through the sales funnel';
COMMENT ON TABLE funnel_events IS 'Detailed event tracking for analytics';
COMMENT ON TABLE email_subscriptions IS 'Email subscription management';
COMMENT ON TABLE refunds IS 'Refund processing and tracking';
COMMENT ON TABLE feature_flags IS 'A/B testing and feature rollout management';
