-- ============================================================================
-- LOOPSPACE SEED DATA
-- Demonstrable seed records for viva & evaluation
-- ============================================================================

-- Insert mock profiles
insert into public.profiles (id, full_name, email, college_name, department, impact_points, role)
values
  ('a1111111-1111-1111-1111-111111111111', 'Alex Chen', 'alex.chen@campus.edu', 'State University of Technology', 'Computer Science & Engineering', 185, 'user'),
  ('b2222222-2222-2222-2222-222222222222', 'Priya Patel', 'priya.patel@campus.edu', 'State University of Technology', 'Electrical Engineering', 240, 'user'),
  ('c3333333-3333-3333-3333-333333333333', 'Marcus Johnson', 'marcus.j@campus.edu', 'State University of Technology', 'Mechanical Engineering', 95, 'user'),
  ('d4444444-4444-4444-4444-444444444444', 'Elena Rodriguez', 'admin.elena@campus.edu', 'State University of Technology', 'Biomedical Sciences', 310, 'admin')
on conflict (id) do nothing;

-- Insert resources
insert into public.resources (
  id, title, description, category, sharing_type, condition, quantity,
  images, pickup_location, available_from, available_until, owner_id, status, views_count
)
values
  (
    'e1111111-1111-1111-1111-111111111111',
    'TI-84 Plus CE Graphing Calculator',
    'Mint condition TI-84 Plus CE graphing calculator with color backlit display and rechargeable battery. Perfect for Linear Algebra, Calculus, or Engineering Statistics.',
    'Electronics',
    'lend',
    'like_new',
    1,
    array['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'],
    'Campus Library North Desk (Floor 2)',
    '2026-10-01',
    '2026-12-15',
    'a1111111-1111-1111-1111-111111111111',
    'available',
    84
  ),
  (
    'e2222222-2222-2222-2222-222222222222',
    'Introduction to Algorithms (CLRS 3rd Edition)',
    'The classic Cormen Algorithms textbook. Hardcover, very clean interior with minimal pencil highlights. Essential for CS301 / CS302 algorithms coursework.',
    'Books & Notes',
    'lend',
    'good',
    1,
    array['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    'Engineering Quad Hall A',
    '2026-10-05',
    '2026-12-20',
    'b2222222-2222-2222-2222-222222222222',
    'available',
    142
  ),
  (
    'e3333333-3333-3333-3333-333333333333',
    'Unisex White Cotton Lab Coat & Splash Goggles',
    'Size Medium 100% heavy-duty cotton lab coat meeting campus laboratory safety protocols. Includes UV & chemical splash protection safety goggles.',
    'Lab Equipment',
    'donate',
    'like_new',
    1,
    array['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    'Chemistry Building Room 104 Foyer',
    '2026-10-10',
    '2026-11-30',
    'd4444444-4444-4444-4444-444444444444',
    'available',
    67
  ),
  (
    'e4444444-4444-4444-4444-444444444444',
    'Arduino Uno Ultimate Starter Kit & Sensors',
    'Complete electronics IoT prototyping kit containing Arduino Uno R3, breadboard, 40+ jumper wires, ultrasonic sensor, servo motors, LCD display, and LEDs.',
    'Electronics',
    'lend',
    'like_new',
    1,
    array['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'],
    'MakerSpace Innovation Hub (Room 210)',
    '2026-10-12',
    '2026-11-25',
    'c3333333-3333-3333-3333-333333333333',
    'available',
    98
  )
on conflict (id) do nothing;

-- Insert impact transactions
insert into public.impact_transactions (
  user_id, points, activity_type, description, co2_saved_kg, money_saved_estimate
)
values
  ('a1111111-1111-1111-1111-111111111111', 20, 'loan_completed', 'Successfully lent Python for Data Science textbook', 2.7, 45.00),
  ('a1111111-1111-1111-1111-111111111111', 25, 'donation_completed', 'Donated Organic Chemistry Molecular Model Set', 3.2, 35.00),
  ('b2222222-2222-2222-2222-222222222222', 20, 'loan_completed', 'Lent Campbell Biology 11th edition', 2.7, 55.00),
  ('d4444444-4444-4444-4444-444444444444', 25, 'donation_completed', 'Donated Lab Coat & Goggles to Alex Chen', 11.5, 85.00)
on conflict do nothing;
