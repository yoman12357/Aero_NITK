import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook that manages:
 * - Hiding the topbar when the user scrolls past a threshold
 * - Closing the modal via the Escape key
 *
 * @param {Object}   options
 * @param {Function} options.onEscape — called when the Escape key is pressed
 * @param {number}   [options.scrollThreshold=40] — scroll offset to trigger hide
 * @returns {{ isTopbarHidden: boolean }}
 */
export function useScrollAndKeyboard({ onEscape, scrollThreshold = 40 }) {
    const [isTopbarHidden, setIsTopbarHidden] = useState(false);

    const handleScroll = useCallback(() => {
        setIsTopbarHidden(window.scrollY > scrollThreshold);
    }, [scrollThreshold]);

    const handleKeyDown = useCallback(
        (keyboardEvent) => {
            if (keyboardEvent.key === 'Escape' && onEscape) {
                onEscape();
            }
        },
        [onEscape],
    );

    useEffect(() => {
        // Run once immediately to set the correct initial state
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleScroll, handleKeyDown]);

    return { isTopbarHidden };
}
