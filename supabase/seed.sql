-- CWTH Events Calendar — Sample Data
-- Run after schema.sql to populate the calendar with demo events.

INSERT INTO public.events
  (title, description, event_date, start_time, end_time, location, delivery_mode, category, target_audience, booking_url, organiser_team, status)
VALUES
  (
    'Diabetes Management Update 2025',
    'An update on the latest NICE guidelines for Type 2 Diabetes management in primary care, with Q&A.',
    CURRENT_DATE + 3,
    '10:00', '12:00',
    'Microsoft Teams',
    'Online',
    'Clinical Development',
    'GPs, Practice Nurses',
    'https://cwtraininghub.co.uk/events/diabetes-update',
    'CWTH Education Team',
    'published'
  ),
  (
    'Leadership for Primary Care — Module 1',
    'First session of the CWTH Leadership Programme. Introduction to leadership styles and their application in PCN settings.',
    CURRENT_DATE + 7,
    '09:30', '16:00',
    'Coventry City Centre — TBC',
    'In Person',
    'Leadership & Management',
    'Practice Managers, PCN Clinical Directors',
    NULL,
    'CWTH Leadership Programme',
    'published'
  ),
  (
    'PCN Network Lunch — Coventry South',
    'Monthly networking lunch for primary care teams in the Coventry South PCN. Informal agenda, guest speaker TBC.',
    CURRENT_DATE + 10,
    '12:30', '14:00',
    'Coventry South PCN Hub',
    'In Person',
    'Networking & Events',
    'All Primary Care Staff — Coventry South',
    NULL,
    'Coventry South PCN',
    'published'
  ),
  (
    'Staff Wellbeing — Mindfulness Taster Session',
    'A 30-minute guided mindfulness session for primary care staff. No experience needed.',
    CURRENT_DATE + 5,
    '13:00', '13:30',
    'Zoom',
    'Online',
    'Wellbeing & Support',
    'All Primary Care Staff',
    'https://cwtraininghub.co.uk/events/mindfulness',
    'CWTH Wellbeing Team',
    'published'
  ),
  (
    'ICB Primary Care Update — March',
    'Monthly update from Coventry & Warwickshire ICB covering contract changes, workforce updates, and priorities.',
    CURRENT_DATE + 14,
    '15:00', '16:00',
    'Microsoft Teams',
    'Online',
    'PCN & ICB Updates',
    'GPs, Practice Managers, PCN Leads',
    'https://cwtraininghub.co.uk/events/icb-update',
    'CW ICB Primary Care Team',
    'published'
  ),
  (
    'Non-Medical Prescribing Study Day',
    'Full-day study day for nurse and pharmacist independent prescribers. CPD certificates issued.',
    CURRENT_DATE + 21,
    '09:00', '17:00',
    'University Hospitals Coventry — Education Centre',
    'In Person',
    'Training & Education',
    'Non-Medical Prescribers',
    'https://cwtraininghub.co.uk/events/nmp-study-day',
    'CWTH Education Team',
    'published'
  ),
  (
    'Cancelled: Winter Resilience Workshop',
    'This event has been postponed. A new date will be announced shortly.',
    CURRENT_DATE + 2,
    '14:00', '16:00',
    'Rugby Library',
    'In Person',
    'Networking & Events',
    'All Primary Care Staff',
    NULL,
    'CWTH Events Team',
    'cancelled'
  );
