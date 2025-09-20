import React, { useState } from 'react'

interface PremiumModeProps {
  isPremiumUser: boolean;
  onUpgrade: () => void;
}

export default function PremiumMode({ isPremiumUser, onUpgrade }: PremiumModeProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const premiumFeatures = [
    {
      icon: '🏨',
      title: 'Hotel & Hospitality Scenarios',
      description: 'Practice check-ins, room service, and hospitality interactions'
    },
    {
      icon: '👮',
      title: 'Emergency & Police Scenarios',
      description: 'Learn essential phrases for emergencies and official interactions'
    },
    {
      icon: '🏥',
      title: 'Medical Scenarios',
      description: 'Practice medical consultations and health-related conversations'
    },
    {
      icon: '💼',
      title: 'Business & Professional',
      description: 'Master workplace conversations and business terminology'
    },
    {
      icon: '🚗',
      title: 'Transportation Scenarios',
      description: 'Navigate public transport, taxis, and travel situations'
    },
    {
      icon: '📱',
      title: 'Advanced AI Feedback',
      description: 'Get detailed pronunciation and grammar feedback powered by AI'
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Track your learning progress with detailed statistics and insights'
    },
    {
      icon: '🎯',
      title: 'Personalized Learning Path',
      description: 'AI-customized scenarios based on your learning goals and progress'
    }
  ];

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleUpgradeConfirm = () => {
    // In a real app, this would integrate with a payment system
    onUpgrade();
    setShowUpgradeModal(false);
  };

  if (isPremiumUser) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px solid #gold', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #fff9c4 0%, #fff3a0 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '24px', marginRight: '10px' }}>👑</span>
          <h3 style={{ margin: 0, color: '#b8860b' }}>Premium Member</h3>
        </div>
        <p style={{ color: '#8b7355', margin: 0 }}>
          You have access to all premium scenarios and features! Enjoy your enhanced learning experience.
        </p>
        <div style={{ marginTop: '15px' }}>
          <span style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '15px', 
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            ✓ PREMIUM ACTIVE
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Premium Upgrade Banner */}
      <div style={{ 
        padding: '20px', 
        border: '2px solid #FF9800', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px', marginRight: '10px' }}>⭐</span>
              <h3 style={{ margin: 0, color: '#e65100' }}>Upgrade to Premium</h3>
            </div>
            <p style={{ color: '#bf360c', margin: 0 }}>
              Unlock advanced scenarios and AI-powered features for accelerated learning!
            </p>
          </div>
          <button 
            onClick={handleUpgradeClick}
            style={{
              padding: '12px 24px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)'
            }}
          >
            🚀 Upgrade Now
          </button>
        </div>
      </div>

      {/* Premium Features Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>🌟 Premium Features</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '15px',
          marginTop: '15px'
        }}>
          {premiumFeatures.map((feature, index) => (
            <div key={index} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              position: 'relative',
              opacity: 0.9
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px',
                backgroundColor: '#FF9800',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                PREMIUM
              </div>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                {feature.icon}
              </div>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                {feature.title}
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#FF9800', marginBottom: '20px' }}>
              🚀 Upgrade to Premium
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>💳</div>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>
                Premium Plan
              </p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50', margin: '10px 0' }}>
                $9.99/month
              </p>
              <p style={{ color: '#666', margin: '10px 0' }}>
                Unlock all premium scenarios, AI feedback, and advanced features!
              </p>
            </div>
            
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <h4>✨ What you get:</h4>
              <ul style={{ paddingLeft: '20px' }}>
                <li>🏨 Hotel & hospitality scenarios</li>
                <li>👮 Emergency & police scenarios</li>
                <li>🏥 Medical consultation practice</li>
                <li>💼 Business & professional scenarios</li>
                <li>📱 Advanced AI feedback</li>
                <li>📊 Detailed progress analytics</li>
                <li>🎯 Personalized learning paths</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={handleUpgradeConfirm}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                💳 Subscribe Now
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Maybe Later
              </button>
            </div>
            
            <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
              * This is a demo. No actual payment will be processed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}