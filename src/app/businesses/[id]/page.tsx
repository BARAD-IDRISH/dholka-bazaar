'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import rawBusinesses from '@/data/businesses.json';
import { Business } from '@/components/BusinessCard';

export default function BusinessDetailPage() {
  const { language, t } = useApp();
  const router = useRouter();
  const { id } = useParams();

  const business = (rawBusinesses as Business[]).find((b) => b.id === id);

  if (!business) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Business not found</h2>
        <button onClick={() => router.back()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  const name = language === 'en' ? business.name : business.nameGu;
  const description = language === 'en' ? business.description : business.descriptionGu;
  const address = language === 'en' ? business.address : business.addressGu;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <button
        onClick={() => router.back()}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '30px',
        }}
      >
        ← {t('back')}
      </button>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={business.image || 'https://via.placeholder.com/800x450'}
          alt={name}
          style={{ width: '100%', height: '400px', objectFit: 'cover' }}
        />

        <div style={{ padding: '40px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
            <span
              style={{
                backgroundColor: 'rgba(240, 160, 48, 0.1)',
                color: 'var(--accent)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              {business.category}
            </span>
            {business.featured && (
              <span
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {t('featured')}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
            {name}
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: '30px',
              whiteSpace: 'pre-line',
            }}
          >
            {description}
          </p>

          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '30px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '30px',
            }}
          >
            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                {t('address')}
              </h4>
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>{address}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                {t('phone')}
              </h4>
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>{business.phone}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--success)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flexGrow: 1,
                textAlign: 'center',
                transition: 'var(--transition)',
              }}
            >
              💬 {t('messageWhatsapp')}
            </a>
            <a
              href={`tel:${business.phone}`}
              style={{
                backgroundColor: 'transparent',
                border: '2px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'var(--transition)',
              }}
            >
              📞 {t('call')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
