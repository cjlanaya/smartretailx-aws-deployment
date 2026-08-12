import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div>
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 12 }}>Contact us</h1>
        <p style={{ color: '#666', fontSize: 14 }}>Our team is here to help you, 24 hours a day, 7 days a week.</p>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* Contact info */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Get in touch</h2>
            {[
              { label: 'Customer support', value: 'support@smartretailx.com' },
              { label: 'Business enquiries', value: 'business@smartretailx.com' },
              { label: 'Press & media', value: 'press@smartretailx.com' },
              { label: 'Headquarters', value: '12 Commerce Way, London, EC2A 4NE, UK' },
              { label: 'Phone', value: '+44 20 7946 0300' },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f3f3f3' }}>
                <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: '#111' }}>{item.value}</div>
              </div>
            ))}

            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 12 }}>Regional offices</div>
              {['Dubai, UAE', 'Singapore', 'Berlin, Germany', 'Colombo, Sri Lanka'].map(office => (
                <div key={office} style={{ fontSize: 13, color: '#444', marginBottom: 6 }}>📍 {office}</div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ width: 48, height: 48, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 20 }}>✓</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Message received</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>Thanks for reaching out. Our team will get back to you within 24 hours.</p>
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 20 }} onClick={() => setSubmitted(false)}>Send another message</button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Send a message</h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 14 }}>
                    <label>Full name</label>
                    <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label>Email address</label>
                    <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label>Subject</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                      <option value="">Select a topic</option>
                      <option>Order issue</option>
                      <option>Payment problem</option>
                      <option>Product enquiry</option>
                      <option>Returns & refunds</option>
                      <option>Business partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label>Message</label>
                    <textarea rows={5} placeholder="How can we help?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', padding: 12 }} type="submit">Send message →</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
