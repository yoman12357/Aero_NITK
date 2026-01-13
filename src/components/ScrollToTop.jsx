import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // If there's a hash (e.g., #contact), find the element
            const id = hash.replace('#', '');
            const element = document.getElementById(id);

            if (element) {
                // Use a slight timeout to ensure the page layout has shifted/rendered
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            // If no hash, always go to the absolute top
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;