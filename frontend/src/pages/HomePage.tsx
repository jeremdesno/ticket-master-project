import React, { useEffect, useState } from 'react';

import { GenreDataModel } from '../../../backend/src/common/models';
import { fetchGenres } from '../api/genreService';
import FeaturedGenresSectionContainer from '../containers/FeaturedGenresSectionContainer';
import GenreSectionContainer from '../containers/GenreSectionContainer';
import MostLikedSectionContainer from '../containers/MostLikedSectionContainer';
import RecommendedSectionContainer from '../containers/RecommendedSectionContainer';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/pages/HomePage.module.css';

const HomePage: React.FC = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const [genres, setGenres] = useState<GenreDataModel[]>([]);

  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    loadGenres();
  }, []);

  return (
    <div className={styles.homePage}>
      {isAuthenticated ? (
        <>
          <section className={styles.mostLikedEvents}>
            <h2>Top Most Liked Events</h2>
            <MostLikedSectionContainer />
          </section>

          <section className={styles.genresAndRecommendedSection}>
            <div className={styles.featuredGenres}>
              <h2>Featured Genres</h2>
              <FeaturedGenresSectionContainer />
            </div>

            <div className={styles.recommendedEvents}>
              <h2>Recommended for You</h2>
              <RecommendedSectionContainer />
            </div>
          </section>

          <section className={styles.upcomingEvents}>
            <h2>Upcoming Events</h2>
            {genres.map((genre, index) => (
              <GenreSectionContainer
                key={genre.id}
                genre={genre.name}
                index={index}
              />
            ))}
          </section>
        </>
      ) : (
        <p>Please log in to see the events.</p>
      )}
    </div>
  );
};

export default HomePage;
