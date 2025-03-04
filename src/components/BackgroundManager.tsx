import React, { useState, useEffect } from 'react';

const backgrounds = [
  {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1684&q=80',
    name: 'floating-city'
  },
  {
    url: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
    name: 'ruins-temple'
  },
  {
    url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    name: 'magic-forest'
  },
  {
    url: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
    name: 'blood-moon'
  }
];

const BackgroundManager: React.FC = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Change background every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        setIsTransitioning(false);
      }, 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Check for inactivity to show ghost
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowGhost(false);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    const inactivityCheck = setInterval(() => {
      if (Date.now() - lastActivity > 60000) { // 1 minute of inactivity
        setShowGhost(true);
      }
    }, 10000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(inactivityCheck);
    };
  }, [lastActivity]);

  return (
    <div className="background-container">
      {backgrounds.map((bg, index) => (
        <img
          key={bg.name}
          src={bg.url}
          alt={bg.name}
          className={`background-image ${index === currentBg ? 'active' : ''}`}
          style={{ zIndex: index === currentBg ? 0 : -1 }}
        />
      ))}
      <div className="background-overlay"></div>
      
      {showGhost && (
        <div className="ghost-apparition">
          <img 
            src="https://i.imgur.com/XzMxmvC.gif" 
            alt="Ghost Apparition" 
            className="ghost-image"
            style={{
              position: 'fixed',
              bottom: '50px',
              right: '50px',
              width: '200px',
              height: 'auto',
              opacity: 0.7,
              zIndex: 1
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundManager;