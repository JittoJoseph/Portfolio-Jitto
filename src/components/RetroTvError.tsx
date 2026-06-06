import React from 'react';
import { cn } from '@/lib/utils';
import styles from './RetroTvError.module.css';

interface RetroTvErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  errorMessage?: string;
}

const RetroTvError = React.forwardRef<HTMLDivElement, RetroTvErrorProps>(
  (
    {
      className,
      errorMessage = '404 NOT FOUND',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.main_wrapper,
          className
        )}
        {...props}
      >
        <div className={styles.main}>
          <div className={styles.antenna}>
            <div className={styles.antenna_shadow}></div>
            <div className={styles.a1}></div>
            <div className={styles.a1d}></div>
            <div className={styles.a2}></div>
            <div className={styles.a2d}></div>
            <div className={styles.a_base}></div>
          </div>
          <div className={styles.tv}>
            <div className={styles.cruve}>
              <svg
                viewBox="0 0 189.929 189.929"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.curve_svg}
              >
                <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z" />
              </svg>
            </div>
            <div className={styles.display_div}>
              <div className={styles.screen_out}>
                <div className={styles.screen_out1}>
                  <div className={styles.screen}>
                    <span className={styles.notfound_text}>{errorMessage}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.lines}>
              <div className={styles.line1}></div>
              <div className={styles.line2}></div>
              <div className={styles.line3}></div>
            </div>
            <div className={styles.buttons_div}>
              <div className={styles.b1}>
                <div></div>
              </div>
              <div className={styles.b2}></div>
              <div className={styles.speakers}>
                <div className={styles.g1}>
                  <div className={styles.g11}></div>
                  <div className={styles.g12}></div>
                  <div className={styles.g13}></div>
                </div>
                <div className={styles.g}></div>
                <div className={styles.g}></div>
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.base1}></div>
            <div className={styles.base2}></div>
          </div>
        </div>
      </div>
    );
  }
);

RetroTvError.displayName = 'RetroTvError';

export default RetroTvError;
