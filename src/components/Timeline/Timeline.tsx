import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Timeline.module.scss';
import { TimelineEvent } from '../../types/timeline';
import fetchData from '../../utils/fetchData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {},
  );

  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchData().then(setEvents).catch(console.error);
  }, []);

  const setTimelineRef = useCallback((el: HTMLDivElement | null) => {
    if (el) timelineRefs.current.push(el);
  }, []);

  const setYearRef = useCallback((el: HTMLDivElement | null) => {
    if (el) yearRefs.current.push(el);
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (timelineRefs.current.length > 0) {
      timelineRefs.current.forEach((el, index) => {
        if (el) {
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

          if (yearRefs.current[index]) {
            gsap.fromTo(
              yearRefs.current[index],
              { width: '20px', height: '20px', padding: '5px' },
              {
                width: '90px',
                height: '80px',
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
                delay: 0.2,
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
        >
          <div
            className={`${styles.card} ${
              !loadedImages[event._lineNumber] ? styles.skeleton : ''
            }`}
          >
            {!loadedImages[event._lineNumber] && (
              <div className={styles.skeletonAnimation} />
            )}
            <img
              src={event.Imagen}
              alt={event.Título}
              loading='lazy'
              className={styles.cardImage}
              onLoad={() => handleImageLoad(event._lineNumber.toString())}
              style={{ opacity: loadedImages[event._lineNumber] ? 1 : 0 }}
            />
            <div className={styles.text}>
              <div className={styles.card_year}>{event.Año}</div>
              <div className={styles.card_month}>{event.Mes}</div>
            </div>
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
