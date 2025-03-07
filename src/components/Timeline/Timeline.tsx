import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Timeline.module.scss';
import { TimelineEvent } from '../../types/timeline';
import fetchData from '../../utils/fetchData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearBackgroundRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchData().then(setEvents).catch(console.error);
  }, []);

  const setTimelineRef = useCallback((el: HTMLDivElement | null) => {
    if (el) timelineRefs.current.push(el);
  }, []);

  const setYearBackgroundRef = useCallback((el: HTMLDivElement | null) => {
    if (el) yearBackgroundRefs.current.push(el);
  }, []);

  const setYearRef = useCallback((el: HTMLDivElement | null) => {
    if (el) yearRefs.current.push(el);
  }, []);

  useEffect(() => {
    if (timelineRefs.current.length > 0) {
      timelineRefs.current.forEach((el, index) => {
        if (el) {
          // Animación principal del evento
          gsap.fromTo(
            el,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
              },
            },
          );

          // Animación del yearBackground (aparece un poco más tarde)
          if (yearBackgroundRefs.current[index]) {
            gsap.fromTo(
              yearBackgroundRefs.current[index],
              { opacity: 0, x: -50 },
              {
                opacity: 1,
                x: -20,
                duration: 1,
                ease: 'power3.out',
                delay: 0.3,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 80%',
                  end: 'bottom 20%',
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }

          // 🔥 Animación del year (círculo -> expansión con texto)
          if (yearRefs.current[index]) {
            gsap.fromTo(
              yearRefs.current[index],
              { width: '20px', height: '20px', padding: '5px' }, // Inicialmente pequeño
              {
                width: '50px',
                height: '50px',
                padding: '10px',
                duration: 0.5,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 80%',
                  end: 'bottom 20%',
                  toggleActions: 'play none none reverse',
                },
              },
            );

            gsap.fromTo(
              yearRefs.current[index]?.querySelector(`.${styles.year} span`),
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                delay: 0.2, // Se expande un poco después
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 80%',
                  end: 'bottom 20%',
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }
        }
      });
    }
  }, [events]);

  return (
    <div className={styles.timeline}>
      {events.map((event) => (
        <div
          key={event._lineNumber}
          className={styles.timelineEvent}
          ref={setTimelineRef}
          style={{ backgroundImage: `url(${event.Imagen})` }}
        >
          <div className={styles.overlay}></div>
          <div className={styles.yearBackground} ref={setYearBackgroundRef}>
            {event.Año}
          </div>
          <div className={styles.year} ref={setYearRef}>
            <span>{event.Año}</span>
          </div>
          <div className={styles.details}>
            <h2>{event.Título}</h2>
            <h3>{event.Principal}</h3>
            <p className={styles.subtitle}>{event.Subtítulo}</p>
            <p>{event.Descripción}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
