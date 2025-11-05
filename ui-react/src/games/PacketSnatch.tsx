import React, { useEffect, useRef, useState } from 'react';
import { GameContainer } from '@components/GameContainer';
import { ResultScreen } from '@components/ResultScreen';
import { BaseGameProps, PacketSnatchData } from '@/types';
import { useTimer } from '@hooks/useTimer';
import '../styles/games/PacketSnatch.css';

interface Packet {
  id: number;
  x: number;
  y: number;
  speed: number;
  isValid: boolean;
}

export const PacketSnatch: React.FC<BaseGameProps> = ({ data, onComplete }) => {
  const gameData = data as PacketSnatchData;
  const speed = gameData.speed || 1;
  const timerDuration = gameData.timer || 30000;
  const requiredPackets = gameData.packets || 10;

  const [packets, setPackets] = useState<Packet[]>([]);
  const [caught, setCaught] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const nextIdRef = useRef(0);

  const { timeLeft } = useTimer({
    initialTime: timerDuration,
    autoStart: true,
    onExpire: () => {
      setGameSuccess(caught >= requiredPackets);
      setShowResult(true);
      setTimeout(() => onComplete(caught >= requiredPackets), 2000);
    },
  });

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const newPacket: Packet = {
        id: nextIdRef.current++,
        x: Math.random() * 80 + 10,
        y: -10,
        speed: 0.5 + speed * 0.5,
        isValid: Math.random() > 0.3, // 70% valid packets
      };
      setPackets((prev) => [...prev, newPacket]);
    }, 1500 / speed);

    return () => clearInterval(spawnInterval);
  }, [speed]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setPackets((prev) =>
        prev
          .map((packet) => ({ ...packet, y: packet.y + packet.speed }))
          .filter((packet) => packet.y < 110)
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  const handlePacketClick = (packet: Packet) => {
    if (showResult) return;

    setPackets((prev) => prev.filter((p) => p.id !== packet.id));

    if (packet.isValid) {
      const newCaught = caught + 1;
      setCaught(newCaught);

      if (newCaught >= requiredPackets) {
        setGameSuccess(true);
        setShowResult(true);
        setTimeout(() => onComplete(true), 2000);
      }
    } else {
      setGameSuccess(false);
      setShowResult(true);
      setTimeout(() => onComplete(false), 2000);
    }
  };

  if (showResult) {
    return <ResultScreen success={gameSuccess} />;
  }

  return (
    <GameContainer title="PACKET SNATCH" timer={timeLeft} className="packet-snatch-game">
      <div className="packet_snatch_container">
        <div className="packet_snatch_info">
          Catch valid packets (green) only!
          <br />
          Caught: {caught} / {requiredPackets}
        </div>
        <div className="packet_snatch_area">
          {packets.map((packet) => (
            <div
              key={packet.id}
              className={`packet ${packet.isValid ? 'valid' : 'invalid'}`}
              style={{
                left: `${packet.x}%`,
                top: `${packet.y}%`,
              }}
              onClick={() => handlePacketClick(packet)}
            >
              <i className={`fa-solid ${packet.isValid ? 'fa-check' : 'fa-xmark'}`}></i>
            </div>
          ))}
        </div>
      </div>
    </GameContainer>
  );
};
