import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @prisma/client before importing db.js
vi.mock('@prisma/client', () => {
  // In-memory store
  const trends = [];
  const plans = [];
  const articles = [];
  const analytics = [];

  class PrismaClient {
    constructor() {
      this.trend = {
        findMany: async ({ orderBy, take } = {}) => {
          // return top 'take' sorted by score desc
          const sorted = [...trends].sort((a, b) => b.score - a.score);
          return sorted.slice(0, take || sorted.length);
        },
        createMany: async ({ data }) => {
          for (const d of data) trends.push(d);
          return { count: data.length };
        },
      };

      this.plan = {
        create: async ({ data }) => {
          plans.push(data);
          return data;
        },
        findFirst: async ({ orderBy } = {}) => {
          return plans[plans.length - 1] || null;
        },
      };

      this.article = {
        create: async ({ data }) => {
          articles.push(data);
          return data;
        },
        findMany: async ({ orderBy, take } = {}) => {
          const reversed = [...articles].reverse();
          return reversed.slice(0, take || reversed.length);
        },
      };

      this.analytics = {
        create: async ({ data }) => {
          analytics.push(data);
          return data;
        },
        findMany: async () => analytics,
      };

      this.$disconnect = async () => {};
    }
  }

  return { PrismaClient };
});

import * as db from '../../src/data/db.ts';

describe('data/db', () => {
  it('saves and retrieves trends', async () => {
    await db.saveTrends([
      { topic: 'T1', score: 0.5, source: 'x' },
      { topic: 'T2', score: 0.9, source: 'x' },
    ]);
    const top = await db.getTrends(2);
    expect(top.length).toBeGreaterThan(0);
    expect(top[0].topic).toBe('T2');
  });

  it('saves and retrieves plans', async () => {
    const plan = await db.savePlan({ topics: { a: 1 }, rawResponse: '{}' });
    const latest = await db.getLatestPlan();
    expect(latest).toBeTruthy();
  });

  it('saves and retrieves articles', async () => {
    await db.saveArticle({ topic: 'x', title: 't', summary: 's', body: 'b', author: 'a' });
    const got = await db.getArticles(1);
    expect(got.length).toBeGreaterThan(0);
    expect(got[0].title).toBe('t');
  });

  it('saves and summarizes analytics', async () => {
    await db.saveAnalytics({ articleId: '1', views: 10, likes: 2, rating: 4.0 });
    const summary = await db.getAnalyticsSummary();
    expect(summary).toMatch(/Average rating/);
  });
});
