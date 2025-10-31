import { getArticles, saveAnalytics } from "../data/db.js";

export async function runEvaluatorAgent() {
  console.log("📊 EvaluatorAgent: fetching latest articles...");
  const articles = await getArticles(10); // fetch last 10 articles

  if (!articles.length) {
    console.log("⚠️ No articles found. Exiting.");
    return;
  }

  const analyticsResults = [];

  for (const article of articles) {
    try {
      // Simple heuristic scoring
      const views = Math.floor(Math.random() * 200 + 50); // 50–250
      const likes = Math.floor(views * (Math.random() * 0.5)); // 0–50% of views
      const rating = parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0–5.0

      const analyticsRecord = {
        articleId: article.id,
        views,
        likes,
        rating,
      };

      await saveAnalytics(analyticsRecord);
      analyticsResults.push(analyticsRecord);

      console.log(`✅ Analytics saved for article: ${article.title}`);
    } catch (err) {
      console.error("❌ Error saving analytics:", err);
    }
  }

  return analyticsResults;
}
