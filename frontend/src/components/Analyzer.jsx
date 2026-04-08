import { useState } from 'react';
import axios from 'axios';
import styles from './Analyzer.module.css';
import { FiSearch, FiCode, FiAward, FiClock, FiActivity } from 'react-icons/fi';

const Analyzer = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await axios.get(`http://localhost:3000/api/analyze/${username}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch user data. They might not exist.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyCount = (diff) => {
    const allStats = data?.rawStats?.totalSolved;
    if (!allStats) return 0;
    const stat = allStats.find(s => s.difficulty === diff);
    return stat ? stat.count : 0;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>LeetCode Consistency Analyzer</h1>
        <p className={styles.subtitle}>Determine genuine skill level and consistency directly from the source.</p>
      </div>

      <form className={styles.form} onSubmit={handleAnalyze}>
        <div className={styles.inputWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.input}
            placeholder="Enter LeetCode username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {data && (
        <div className={styles.resultsContainer}>
          <div className={styles.summaryGrid}>
            
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FiCode className={styles.icon} />
                <h3>Problems Solved</h3>
              </div>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Total</span>
                  <span className={styles.statValue}>{getDifficultyCount('All')}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Easy</span>
                  <span className={styles.statValue}>{getDifficultyCount('Easy')}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Medium</span>
                  <span className={styles.statValue}>{getDifficultyCount('Medium')}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Hard</span>
                  <span className={styles.statValue}>{getDifficultyCount('Hard')}</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FiAward className={styles.icon} />
                <h3>Contests & Ranking</h3>
              </div>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Contests Attended</span>
                  <span className={styles.statValue}>
                    {data.rawStats.contestRanking?.attendedContestsCount || 0}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Rating</span>
                  <span className={styles.statValue}>
                    {data.rawStats.contestRanking?.rating ? Math.round(data.rawStats.contestRanking.rating) : 'N/A'}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Global Ranking</span>
                  <span className={styles.statValue}>
                    {data.rawStats.contestRanking?.globalRanking || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FiClock className={styles.icon} />
                <h3>Time Estimates (AI)</h3>
              </div>
              <div className={styles.singleStat}>
                <span className={styles.bigNumber}>{data.analysis?.estimatedHoursSpent || 0}</span>
                <span className={styles.bigLabel}>Hours Spent</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FiActivity className={styles.icon} />
                <h3>Genuine Score (AI)</h3>
              </div>
              <div className={styles.singleStat}>
                <span className={styles.bigNumber}>{data.analysis?.genuineScore || 0}</span>
                <span className={styles.bigLabel}>/ 100</span>
              </div>
            </div>

          </div>

          <div className={styles.aiAnalysisPanel}>
            <h2>AI Profile Evaluation</h2>
            <div className={styles.feedbackSection}>
              <h4>Consistency Feedback</h4>
              <p>{data.analysis?.consistencyFeedback || "No feedback."}</p>
            </div>
            <div className={styles.feedbackSection}>
              <h4>Cheating & Genuineness Analysis</h4>
              <p>{data.analysis?.cheatingAnalysis || "No analysis generated."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
