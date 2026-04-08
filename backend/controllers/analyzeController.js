import { fetchUserData, fetchContestData } from '../services/leetcodeService.js';
import analyzeProfile  from '../services/geminiService.js';

const analyzeUser = async (req, res) => {
  const { username } = req.params;

  try {
    // 1. Fetch LeetCode Data
    const leetcodeData = await fetchUserData(username);
    
    if (!leetcodeData || !leetcodeData.matchedUser) {
      return res.status(404).json({ error: 'User not found or no submissions.' });
    }

    // 2. Fetch Contest Data (Optional but good for consistency checking)
    const contestData = await fetchContestData(username);

    // 3. Prepare data subset for AI analysis
    const combinedData = {
      username,
      totalSolved: leetcodeData.matchedUser.submitStats.acSubmissionNum,
      contestRanking: contestData
    };

    // 4. Send to Gemini for analysis (Consistency, Estimated Time, Genuine Score)
    const analysisResult = await analyzeProfile(combinedData);

    // 5. Respond
    res.status(200).json({
      username,
      rawStats: combinedData,
      analysis: analysisResult
    });

  } catch (error) {
    console.error('Error analyzing user:', error);
    res.status(500).json({ error: 'Failed to analyze user.' });
  }
};

export default analyzeUser

