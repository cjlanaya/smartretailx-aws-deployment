import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 16 }}>About SmartRetailX</h1>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.7 }}>
            We are a global digital commerce company helping millions of people shop smarter, faster, and more securely.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px' }}>

        {/* Story */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Our story</h2>
          <p style={{ color: '#444', lineHeight: 1.8, fontSize: 14, marginBottom: 14 }}>
            Founded in 2019, SmartRetailX started as a small technology startup with a simple goal — make online shopping reliable, transparent, and accessible to everyone. Today we serve customers across Europe, Asia, and the Middle East, powering retail experiences for thousands of merchants and millions of end consumers.
          </p>
          <p style={{ color: '#444', lineHeight: 1.8, fontSize: 14 }}>
            Our platform handles everything from product discovery and real-time inventory to secure payment processing and instant order notifications — all running on a cloud infrastructure designed for scale and resilience.
          </p>
        </div>

        <hr />

        {/* Mission */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Our mission</h2>
          <div className="grid3">
            {[
              { icon: '🌍', title: 'Global reach', desc: 'Serving customers in over 40 countries across three continents with localised payment and delivery options.' },
              { icon: '🔐', title: 'Security first', desc: 'Bank-grade encryption, fraud detection, and identity verification protect every transaction on our platform.' },
              { icon: '⚡', title: 'Always on', desc: 'Our distributed infrastructure guarantees 99.9% uptime — your store never closes and your customers never wait.' },
            ].map(m => (
              <div key={m.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{m.icon}</div>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{m.title}</h3>
                <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <hr />

        {/* Company facts */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Company at a glance</h2>
          <div className="grid2">
            {[
              { label: 'Founded', value: '2019, London, UK' },
              { label: 'Headquarters', value: 'London, United Kingdom' },
              { label: 'Regional offices', value: 'Dubai, Singapore, Colombo' },
              { label: 'Employees', value: '1,200+ globally' },
              { label: 'Merchants', value: '8,000+ active sellers' },
              { label: 'Annual transactions', value: '$2.4B+ processed' },
              { label: 'Markets', value: 'Europe, Asia, Middle East' },
              { label: 'Cloud infrastructure', value: 'Amazon Web Services' },
            ].map(item => (
              <div key={item.label} style={{ padding: '14px 16px', border: '1px solid #e5e5e5', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <hr />

        {/* Leadership */}
        <div style={{ margin: '48px 0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Leadership team</h2>
          <div className="grid3">
            {[
              { name: 'Alexandra Morgan', role: 'Chief Executive Officer', location: 'London' },
              { name: 'James Okafor', role: 'Chief Technology Officer', location: 'London' },
              { name: 'Priya Nair', role: 'VP of Engineering', location: 'Singapore' },
              { name: 'Tariq Al-Hassan', role: 'Head of Operations', location: 'Dubai' },
              { name: 'Laura Becker', role: 'Chief Financial Officer', location: 'Berlin' },
              { name: 'Kevin Tan', role: 'Head of Product', location: 'Singapore' },
            ].map(p => (
              <div key={p.name} style={{ padding: '16px', border: '1px solid #e5e5e5', borderRadius: 8 }}>
                <div style={{ width: 40, height: 40, background: '#f3f3f3', borderRadius: '50%', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{p.role}</div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{p.location}</div>
              </div>
            ))}
          </div>
        </div>

        <hr />

        <div style={{ marginTop: 48, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/shop"><button className="btn btn-primary">Browse the shop →</button></Link>
          <Link to="/contact"><button className="btn btn-secondary">Contact us</button></Link>
        </div>
      </div>
    </div>
  );
}
