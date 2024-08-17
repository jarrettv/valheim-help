import React, { useEffect, useState } from 'react';

import './Countdown.css';


interface CountdownProps {
  start: Date;
  end: Date;
  pre: string[];
  mid: string[];
  post: string[];
}

const CountdownTimer: React.FC<CountdownProps> = ({ start, end, pre, mid, post }) => {
  const [message, setMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(start.getTime() - new Date().getTime());
  const [pulse, setPulse] = useState<boolean>(false);

  const parseMessages = (messages: string[]) => {
    return messages.map(msg => {
      const [offset, text] = msg.includes(';') ? msg.split(';') : ["-100000000", msg];
      return { offset: parseInt(offset, 10), text };
    });
  };

  const preMessages = parseMessages(pre);
  const midMessages = parseMessages(mid);
  const postMessages = parseMessages(post);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distanceToStart = start.getTime() - now;
      const distanceToEnd = end.getTime() - now;

      let currentMessage = '';


      if (distanceToStart > 0 && distanceToEnd > 0) {
        currentMessage = preMessages[0].text;
        for (var msg of preMessages.slice(1).reverse()) {
          if (distanceToStart <= -msg.offset * 60 * 1000) {
            currentMessage = msg.text;
            break;
          }
        }
      } else if (distanceToEnd > 0) {
        currentMessage = midMessages[0].text;
        for (const msg of midMessages.slice(1).reverse()) {
          if (distanceToEnd <= -msg.offset * 60 * 1000) {
            currentMessage = msg.text;
            break;
          }
        }
      } else {
        currentMessage = postMessages[0].text;
        for (const msg of postMessages.slice(1).reverse()) {
          if (-distanceToEnd >= msg.offset * 60 * 1000) {
            currentMessage = msg.text;
            break;
          }
        }
      }

      setMessage(currentMessage);
      setTimeLeft(distanceToStart > 0 ? distanceToStart : distanceToEnd);

      // Trigger pulse animation
      setPulse(true);
      setTimeout(() => setPulse(false), 100); // Remove pulse class after 100ms
    }, 1000);

    return () => clearInterval(interval);
  }, [start, end, preMessages, midMessages, postMessages]);

  const formatTime = (milliseconds: number) => {
    milliseconds = Math.abs(milliseconds);
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    let msg = `${minutes}m ${seconds}s`;
    if (hours > 0) {
      msg = `${hours}h ${msg}`;
    }
    if (days > 0) {
      msg = `${days}d ${msg}`;
    }
    return msg;
  };

  return (
    <div className='countdown'>
      <div>{message}</div>
      <div className={pulse ? 'pulse' : ''}>{formatTime(timeLeft)}</div>
    </div>
  );
};

export default CountdownTimer;