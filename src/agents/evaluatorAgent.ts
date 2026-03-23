import { getArticles, saveAnalytics } from '../data/db.ts';

export async function runEvaluatorAgent() {
  console.log('📊 EvaluatorAgent: fetching latest articles...');
  const articles = await getArticles(10);

  if (!articles.length) {
    console.log('⚠️ No articles found. Exiting.');
    return;
  }

  const analyticsResults: any[] = [];

  for (const article of articles) {
    try {
      const views = Math.floor(Math.random() * 200 + 50);
      const likes = Math.floor(views * (Math.random() * 0.5));
      const rating = parseFloat((Math.random() * 2 + 3).toFixed(1));

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
      console.error('❌ Error saving analytics:', err);
    }
  }

  return analyticsResults;
}
