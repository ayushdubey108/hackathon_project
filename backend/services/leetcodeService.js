import  post  from 'axios';

const GRAPHQL_URL = 'https://leetcode.com/graphql';

async function fetchUserData(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  try {
    const response = await post(GRAPHQL_URL, {
      query,
      variables: { username }
    });

    return response.data.data;
  } catch (error) {
    console.error(`Error fetching LeetCode data for ${username}:`, error.message);
    throw error;
  }
}

async function fetchContestData(username) {
  const query = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
      }
    }
  `;

  try {
    const response = await post(GRAPHQL_URL, {
      query,
      variables: { username }
    });
    return response.data.data.userContestRanking;
  } catch (error) {
    console.error(`Error fetching Contest data for ${username}:`, error.message);
    return null; // Return null if contests fail, maybe they just never participated
  }
}

export{
  fetchUserData,
  fetchContestData
};
