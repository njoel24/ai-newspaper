import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

export async function getTrends(limit = 10) {
  return prisma.trend.findMany({
    orderBy: { score: 'desc' },
    take: limit,
  });
}

export async function saveTrends(trendsArray: Array<any>) {
  const data = trendsArray.map((t) => ({
    id: uuid(),
    topic: t.topic,
    score: t.score,
    source: t.source || 'TrendAgent',
  }));
  return prisma.trend.createMany({ data });
}

export async function clearTrends() {
  return prisma.trend.deleteMany({});
}

export async function savePlan(planData: any) {
  return prisma.plan.create({
    data: {
      id: uuid(),
      topics: planData.topics,
      rawResponse: JSON.stringify(planData.rawResponse || {}),
      source: 'PlannerAgent',
    },
  });
}

export async function getLatestPlan() {
  return prisma.plan.findFirst({
    orderBy: { createdAt: 'desc' },
  });
}

export async function saveArticle(articleData: any) {
  return prisma.article.create({
    data: {
      id: uuid(),
      topic: articleData.topic,
      title: articleData.title,
      summary: articleData.summary,
      body: articleData.body,
      author: articleData.author || 'AI Writer',
      planId: articleData.planId || null,
    },
  });
}

export async function getArticles(limit = 10) {
  return prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function clearArticles() {
  return prisma.article.deleteMany({});
}

export async function saveAnalytics(record: any) {
  return prisma.analytics.create({
    data: {
      id: uuid(),
      articleId: record.articleId,
      views: record.views,
      likes: record.likes,
      rating: record.rating,
    },
  });
}

export async function clearAnalytics() {
  return prisma.analytics.deleteMany({});
}

export async function getAnalyticsSummary() {
  const all = await prisma.analytics.findMany();
  if (all.length === 0) return 'No analytics yet.';
  const avgRating = all.reduce((a, b) => a + b.rating, 0) / all.length;
  return `Average rating: ${avgRating.toFixed(2)} across ${all.length} articles.`;
}

export async function disconnect() {
  await prisma.$disconnect();
}
