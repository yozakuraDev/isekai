import React, { useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';

interface AudioPlayerProps {
  isMuted: boolean;
  volume: number;
}

const bgmTracks = [
  {
    name: "異世界の風",
    url: "https://assets.codepen.io/21542/howler-demo-bg-music.mp3"
  },
  {
    name: "魔法の森",
    url: "https://assets.codepen.io/21542/howler-demo-bg-music.mp3"
  },
  {
    name: "百鬼夜行",
    url: "https://assets.codepen.io/21542/howler-demo-bg-music.mp3"
  }
];

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isMuted, volume }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playClick] = useSound('/click.mp3', { volume: 0.5 });
  
  // Portal sound effect for page transitions
  const [playPortal] = useSound('/portal.mp3', { volume: 0.5 });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      
      if (!isMuted && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
    }
  }, [isMuted, volume]);

  const handleTrackEnd = () => {
    setCurrentTrack((prev) => (prev + 1) % bgmTracks.length);
  };

  // Add click sound to all buttons
  useEffect(() => {
    const buttons = document.querySelectorAll('button');
    
    const handleClick = () => {
      if (!isMuted) {
        playClick();
      }
    };
    
    buttons.forEach(button => {
      button.addEventListener('click', handleClick);
    });
    
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleClick);
      });
    };
  }, [isMuted, playClick]);

  // Add portal sound to page transitions
  useEffect(() => {
    const handleLinkClick = () => {
      if (!isMuted) {
        playPortal();
        
        // Create portal transition effect
        const portalTransition = document.createElement('div');
        portalTransition.className = 'portal-transition';
        document.body.appendChild(portalTransition);
        
        setTimeout(() => {
          portalTransition.classList.add('active');
        }, 10);
        
        setTimeout(() => {
          portalTransition.classList.remove('active');
          setTimeout(() => {
            portalTransition.remove();
          }, 500);
        }, 1000);
      }
    };
    
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });
    
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, [isMuted, playPortal]);

  return (
    <>
      <audio
        ref={audioRef}
        src={bgmTracks[currentTrack].url}
        loop={false}
        autoPlay={!isMuted}
        onEnded={handleTrackEnd}
      />
      <div className="current-track-info" style={{ 
        position: 'fixed', 
        bottom: '60px', 
        right: '20px', 
        background: 'rgba(10, 10, 10, 0.7)',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        opacity: isMuted ? 0 : 0.7,
        transition: 'opacity 0.3s ease'
      }}>
        ♪ {bgmTracks[currentTrack].name}
      </div>
    </>
  );
};

export default AudioPlayer;